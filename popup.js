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
						<th>Enabled</th>
						<th>Meeting Link</th>
						<th>Joining Time</th>
					</tr>
				</thead>
				<tbody>
				`;
		for (const meetingId in meetings) {
			const meeting = meetings[meetingId];
			meetingsTable.innerHTML += `
					<tr id="row-${meetingId}">
						<td>
							<div class="form-check form-switch">
								<input 
									class="toggle-enabled form-check-input" 
									type="checkbox" 
									id="flexSwitchCheckChecked" 
									${meeting.enabled ? 'checked' : ''}
								/>
							</div>
						</td>
						<td>${meeting.link}</td>
						<td>${meeting.joiningTime}</td>
					</tr>
					`;
		}
		meetingsTable.innerHTML += '</tbody>';
	}
});

// ----------------------------------------------------------------------------


// Create new meeting handler -------------------------------------------------

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
		const meetings = result.meetings || {};
		const newMeeting = {
			enabled: true,
			link,
			joiningTime
		};
		const meetingId = 'meeting-' + Date.now();
		meetings[meetingId] = newMeeting;
		chrome.storage.sync.set({meetings}, () => {
			chrome.runtime.sendMessage({
				type: 'NEW_MEETING',
				payload: {
					newMeetingId: meetingId,
					meetings
				}
			});
		});
	});
};

createMeetingForm.addEventListener('submit', createMeeting);

// ----------------------------------------------------------------------------


// Meeting options handler ----------------------------------------------------

const toggleMeeting = meetingId => {
	chrome.storage.sync.get(['meetings'], result => {
		const meetings = result.meetings;
		meetings[meetingId].enabled = !(meetings[meetingId].enabled);
		chrome.storage.sync.set({meetings}, () => {
			chrome.runtime.sendMessage({
				type: 'EDIT_MEETING',
				payload: {
					meetingId,
					meetings
				}
			});
		});
	});
};

const meetingRows = {};
chrome.storage.sync.get(['meetings'], result => {
	const meetings = result.meetings;
	for (const meetingId in meetings) {
		const meetingRow = document.getElementById('row-' + meetingId);
		meetingRow.getElementsByClassName('toggle-enabled')[0].addEventListener('click', () => {
			toggleMeeting(meetingId);
		});
	}
});

// ----------------------------------------------------------------------------



