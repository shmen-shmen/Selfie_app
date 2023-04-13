// p5 setup:
function setup() {
	noCanvas();

	const latitudeEl = document.getElementById("lat");
	const longitudeEl = document.getElementById("long");
	const sendBtnEl = document.getElementById("submit_btn");
	const nameInputEl = document.getElementById("name_input");
	const subjectNumberEl = document.getElementById("subject_number");
	subjectNumberEl.innerText = Math.floor(Math.random() * 666);
	const video = createCapture(VIDEO);
	video.size(160, 120);
	video.parent("video-container");

	if ("geolocation" in navigator) {
		console.log("GEOLOCATION IS AVAILABLE");

		navigator.geolocation.getCurrentPosition((position) => {
			const myLat = position.coords.latitude;
			latitudeEl.innerText = myLat;
			const myLong = position.coords.longitude;
			longitudeEl.innerText = myLong;

			const dataExchangeSequence = async () => {
				if (nameInputEl.value) {
					const myName = nameInputEl.value;
					nameInputEl.value = "";

					video.loadPixels();
					const image64 = video.canvas.toDataURL();

					const data = { myLat, myLong, myName, image64 };

					//  hey, I want:
					//  1 this data to be sent as JSON
					//  2 I tell you this is JSON
					//  2 I want to post it to '/api'
					const options = {
						method: "POST",
						body: JSON.stringify(data),
						headers: { "Content-Type": "application/json" },
					};
					//OMG here i make a request to a server and then i log response
					//So this is what it means
					const response = await fetch("/api", options);
					console.log("COORDINATES SENT TO SERVER, AWAIT RESPONSE");
					const newData = await response.json();
					console.log("RESPONSE FROM SERVER: ", newData);
				} else {
					nameInputEl.placeholder = "DO NOT TRY TO DECIEVE US";
				}
			};

			sendBtnEl.addEventListener("click", dataExchangeSequence);
		});
	} else {
		console.log("ERROR GEOLOCATION IS NOT AVAILABLE");
		latitudeEl.innerText = "*******";
		longitudeEl.innerText = "*******";
		sendBtnEl.innerText = "GEO DATA NOT AVAILABLE";
	}
}
