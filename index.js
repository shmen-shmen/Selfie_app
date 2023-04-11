const express = require("express"); //importing express
const fs = require("fs");
// const path = require("path");
const Datastore = require("@seald-io/nedb"); //importing nedb

//create the app
const app = express();

//listen at a port
app.listen(3000, () => {
	console.log("listening at 3000");
});

//serving up files from 'public' folder
app.use(express.static("public"));

//otherwise app wouldn't know what to do with JSON and give 'undefined'
app.use(express.json({ limit: "1mb" }));
// also size limit option added for example purpose

// initializing a database using NeDB
const database = new Datastore({ filename: "database.db" });
database.loadDatabase();

app.get("/api", (request, response) => {
	database.find({}, (err, data) => {
		if (err) {
			console.error(err);
			response.end;
			return;
		} else {
			response.json(data);
		}
	});
});

app.post("/api", async (request, response) => {
	const data = request.body;

	data.timestamp = Date.now();

	const imageData = data["image64"].split(";base64,").pop();
	const imageFileName = `${data.myName} FACE ON ${new Date(
		data.timestamp
	)}.png`;

	fs.writeFile(
		`public/snapshots/${imageFileName}`,
		imageData,
		"base64",
		(err) => {
			if (err) throw err;
			// console.log("The file has been saved!");
		}
	);

	delete data["image64"];
	data.imageFile = imageFileName;

	// console.log(data.image64);
	database.insert(data);
	//RESPONSE
	//you are required to make a response, for example:
	response.json({
		status: "success",
		...data,
		// image64: `SNAPSHOT ON ${new Date(data.timestamp)}.png`,
	});
});
