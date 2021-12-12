// chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
// 	console.log(req, sender, sendRes);
// });


const scheduleMeeting = (meeting) => {
	if (!meeting.enabled) {
		if (meeting.timeoutId) clearTimeout(meeting.timeoutId);
		return null;
	}
	let msTillMeeting = new Date().setHours(...meeting.joiningTime.split(':'), '0') - Date.now();

	// Adding a day if the meeting time is past
	if (msTillMeeting < 0) msTillMeeting += 86400000;
	const timeoutId = setTimeout(() => {
		chrome.tabs.create({url: meeting.link});
	}, msTillMeeting);
	return timeoutId;
};

console.log('in background.js');

chrome.runtime.onMessage.addListener(message => {
	switch(message.type) {
	case 'NEW_MEETING': {
		const newMeetingId = message.payload.newMeetingId;
		const meetings = message.payload.meetings;
		const newMeeting = meetings[newMeetingId];
		const timeoutId = scheduleMeeting(newMeeting);
		meetings[newMeetingId].timeoutId = timeoutId;
		chrome.storage.sync.set({meetings});
	}
		break;
	case 'EDIT_MEETING': {
		const meetingId = message.payload.meetingId;
		const meetings = message.payload.meetings;
		const timeoutId = scheduleMeeting(meetings[meetingId]);
		meetings[meetingId].timeoutId = timeoutId;
		chrome.storage.sync.set({meetings});
	}
		break;
	}
});

chrome.storage.onChanged.addListener(changes => {
	console.log('Changes');
	console.log(changes);
});
