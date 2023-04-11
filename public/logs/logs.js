const getData = async () => {
	const response = await fetch("/api");
	const data = await response.json();

	data.map((entry) => {
		const { myName, myLat, myLong, imageFile, timestamp } = entry;

		const listEl = document.getElementById("pediki_list");
		const entryEl = document.createElement("li");
		listEl.appendChild(entryEl);

		const nameEl = document.createElement("h4");
		nameEl.textContent = myName;

		const coordsEl = document.createElement("p");
		coordsEl.textContent = `where: ${myLat}, ${myLong}`;

		const timeEl = document.createElement("p");
		const dateString = new Date(timestamp);
		timeEl.textContent = `when: ${dateString}`;

		const imageEl = document.createElement("img");
		imageEl.src = `../snapshots/${imageFile}`;

		entryEl.append(nameEl, coordsEl, timeEl, imageEl);
	});
};

getData();
