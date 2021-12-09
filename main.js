// Handling creating new meetings ---------------------------------------------

const createMeetingForm = document.getElementById('create-meeting-form');

const createMeeting = () => {
	// e.preventDefault();
	const formData = new FormData(createMeetingForm);
	const link = formData.get('link');
	const joiningTime = formData.get('joiningTime');

	// TODO: Validate form data

	// Fetching meetings array using chrome storage API
	// Adding the new meeting to that array
	// Saving the updated list of meetings to chrome storage
	chrome.storage.sync.get(['meetings'], result => {
		const meetings = result.meetings || [];
		const newMeeting = {
			enabled: true,
			link,
			joiningTime
		};
		meetings.push(newMeeting);
		chrome.storage.sync.set({meetings}, () => {
			console.log('Meetings set to', meetings);
		});
	});
};

createMeetingForm.addEventListener('submit', createMeeting);

// ----------------------------------------------------------------------------


// Populating the list of meetings --------------------------------------------

const meetingsTable = document.getElementById('meetings-table');

chrome.storage.sync.get(['meetings'], result => {
	const meetings = result.meetings;
	if (!meetings) {
		meetingsTable.innerHTML = 'No meetings added yet!';
	} else {
		meetingsTable.innerHTML = `
				<thead>
					<tr>
						<th>Meeting Link</th>
						<th>Joining Time</th>
					</tr>
				</thead>
				<tbody>
				`;
		for (const meeting of meetings) {
			meetingsTable.innerHTML += `
					<tr>
						<td>${meeting.link}</td>
						<td>${meeting.joiningTime}</td>
					</tr>
					`;
		}
		meetingsTable.innerHTML += '</tbody>';
	}
});

// ----------------------------------------------------------------------------
