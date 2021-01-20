//main function to run all functions
function main(chat, timelimit) {

//clear
document.getElementById("cleaned").innerHTML = "";

//Get room name (First line of copied chat, *usually*)
roomname = chat.split("\n")[0];

//Identify where the chat starts
modchat = findstart(chat);

//Find a preliminary list of all users involved
users = findusers(modchat);

var repeatsremoved = false;

//Label the usernames, room notifs, and time stamps
contentlabels = userlabels(modchat, users, repeatsremoved)[0];
contentlabels = roomlabels(modchat, users, contentlabels);
contentlabels = timelabels(modchat, users, contentlabels);

//Remove the duplicate username statements
modchat = removerepeats(modchat, contentlabels);
repeatsremoved = true;

//Relabel the usernames, room notifs, and time stamps (offset during duplicate removals)
contentlabels = userlabels(modchat, users, repeatsremoved)[0];
contentlabels = roomlabels(modchat, users, contentlabels);
contentlabels = timelabels(modchat, users, contentlabels);

modchat = cleanroomnotifs(modchat, contentlabels);

//Relabel the usernames, room notifs, and time stamps (offset during room notification cleaning)
contentlabels = userlabels(modchat, users, repeatsremoved)[0];
contentlabels = roomlabels(modchat, users, contentlabels);
contentlabels = timelabels(modchat, users, contentlabels);

//Make sure everything is labeled correctly
contentlabels = roomcheck(contentlabels);

//Verify the list is only of users that have messaged once
users = verifyusers(modchat, users, contentlabels);

//Relabel the usernames, room notifs, and time stamps (offset during user verification)
contentlabels = userlabels(modchat, users, repeatsremoved)[0];
contentlabels = roomlabels(modchat, users, contentlabels);
contentlabels = timelabels(modchat, users, contentlabels);

//Identify the starting index of the chat
chatstart = parseInt(userlabels(modchat, users, repeatsremoved)[1], 10);

//Identify replies
contentlabels = replylabels(modchat, users, contentlabels);

//Identify emoji reactions
contentlabels = emojilabels(modchat, contentlabels);

//Identify facilitators and youth chatters
youth = findyouth(modchat, contentlabels);
facilitators = findfacilitators(modchat, contentlabels, chatstart, youth);

ungreet = ungreeted(modchat, contentlabels, timelimit, facilitators)[0];
joinedusers = ungreeted(modchat, contentlabels, timelimit, facilitators)[1];

messagearray = reqmessages(modchat, contentlabels, facilitators);
introincluded = messagearray[0];
concincluded = messagearray[1];

//Show facilitators and youth chatters
var analysis = "<br> <b>ALL ACTIVE USERS:</b> " + users.length + "<br>";
var index;

//Sort Alphabetically (Ignore Case)
users.sort(function(p1, p2) { 
	maxlen = Math.min(p1.length, p2.length);
	var character
	for(character = 0; character < maxlen; character++) {
		ascii1 = p1.toLowerCase().charCodeAt(character);
		ascii2 = p2.toLowerCase().charCodeAt(character);
		if(ascii1 != ascii2) {
			return ascii1 - ascii2;
		}
	}
	if(p1.length > p2.length) {
		return 1;
	} else {
		return -1;
	}
});

for(index = 0; index < users.length; index++) {
	analysis += users[index];
	if(index < users.length-1) {
		analysis += ", ";
	}
}

analysis += "<br><br>" + "<b>FACILITATORS:</b> " + facilitators.length + "<br>";

facilitators.sort(function(p1, p2) {
	maxlen = Math.min(p1.length, p2.length);
	var character
	for(character = 0; character < maxlen; character++) {
		ascii1 = p1.toLowerCase().charCodeAt(character);
		ascii2 = p2.toLowerCase().charCodeAt(character);
		if(ascii1 != ascii2) {
			return ascii1 - ascii2;
		}
	}
	if(p1.length > p2.length) {
		return 1;
	} else {
		return -1;
	}
});

for(index = 0; index < facilitators.length; index++) {
	analysis += facilitators[index];
	if(index < facilitators.length-1) {
		analysis += ", ";
	}
}

analysis += "<br><br>" + "<b>PARTICIPATING USERS:</b> " + youth.length + "<br>";

youth.sort(function(p1, p2) { 
	maxlen = Math.min(p1.length, p2.length);
	var character
	for(character = 0; character < maxlen; character++) {
		ascii1 = p1.toLowerCase().charCodeAt(character);
		ascii2 = p2.toLowerCase().charCodeAt(character);
		if(ascii1 != ascii2) {
			return ascii1 - ascii2;
		}
	}
	if(p1.length > p2.length) {
		return 1;
	} else {
		return -1;
	} 
});

for(index = 0; index < youth.length; index++) {
	analysis += youth[index];
	if(index < youth.length-1) {
		analysis += ", ";
	}
}

//Show which users were not greeted in time
analysis += "<br><br>" + "<b>UNGREETED USERS:</b> " + ungreet.length + "/" + joinedusers.length + "<br>";
ungreet.sort(function(p1, p2) { 
	maxlen = Math.min(p1.length, p2.length);
	var character
	for(character = 0; character < maxlen; character++) {
		ascii1 = p1.toLowerCase().charCodeAt(character);
		ascii2 = p2.toLowerCase().charCodeAt(character);
		if(ascii1 != ascii2) {
			return ascii1 - ascii2;
		}
	}
	if(p1.length > p2.length) {
		return 1;
	} else {
		return -1;
	}
});

for(index = 0; index < ungreet.length; index++) {
	analysis += ungreet[index];
	if(index < ungreet.length-1) {
		analysis += ", ";
	}
}

if(ungreet.length == 0) {
	analysis += "All users greeted.";
}

analysis += "<br><br>" + "<b>INTRO MESSAGE INCLUDED:</b> " + introincluded + "<br>";
analysis += "<br>" + "<b>CLOSER INCLUDED:</b> " + concincluded + "<br>";

analysis += "<br>" + "--- CHAT ---";
document.getElementById("data").innerHTML = analysis;

//Colorcode the chat
modchat = colorcode(modchat, contentlabels);

//Display the formatted chat
modchatsplit = modchat.split("\n");
var index;
var formatted = roomname + "<br>" + youth.length + " youth chatters" + "<br><br>";

for(index = 0; index < modchatsplit.length; index++) {
	//document.getElementById("cleaned").innerHTML = document.getElementById("cleaned").innerHTML + modchatsplit[index] + /*" " + contentlabels[index] +*/ "<br>";
	
	//If reached the end of chat (in case of archived and unarchived chat)
	if(modchatsplit[index] == "This room is read only" || (modchatsplit[index] == "Message" && (modchatsplit[index+2].includes("KaTeX") || modchatsplit[index+1].includes("KaTeX")))) {
		//End the chat display
		index = modchatsplit.length
	} else {
		formatted += modchatsplit[index] + "<br>";
	} //end of if statement
} //end of for loop

document.getElementById("cleaned").innerHTML = formatted;

//Indicate ready by changing background color. Also makes it easier to paste.
document.getElementById("body").style.backgroundColor = "";

}

//Finds the start of the chat
//PARAMETERS: Chat data (chat - STRING)
//RETURNS: Chat data, starting at the statement "Start of conversation" (cleanchat - STRING)

function findstart(chat) {

chatsplit = chat.split("\n");

started = false;

var index;
var cleanchat = "";
//Parse through each chat element
for(index = 0; index < chatsplit.length; index++) {
	
	//Find element where the chat starts
	if(chatsplit[index] == "Start of conversation") {
		started = true;
	} //end of if statement
	
	//Begin the chat data at that point
	if(started) {
		cleanchat = cleanchat + chatsplit[index] + "\n";
	}

} //end of for loop

//If there is no "Start of Conversation" line indication the start of the conversation
if(!(started)) {
	produceintro = false;
	for(index = 0; index < chatsplit.length; index++) {
		//Find the first username (followed by the same username)
		if(chatsplit[index] == chatsplit[index+1] && chatsplit[index+2].includes(":") && !(produceintro)) {
			//Make sure it is a username (repeat is followed by a timestamp)
			timecheck = chatsplit[index+2].split(" ");
			if(timecheck[0].includes(":") && (timecheck[1].includes("PM") || timecheck[1].includes("AM"))) {
				cleanchat = cleanchat + "Start of conversation\n\n";
				started = true;
				produceintro = true;
			} //end of if statement
		} //end of if statement
		
		//Begin the chat data at that point
		if(started) {
			cleanchat = cleanchat + chatsplit[index] + "\n";
		} //end of if statement
	} //end of for loop
} //end of if statement

	//Return string
	return cleanchat;

} //end of findstart function





//Identifies all potential usernames
//PARAMETERS: Chat data (chat - STRING)
//RETURNS: A list of all identified users, inactive or active (users - STRING ARRAY)

function findusers(chat) {

chatsplit = chat.split("\n");

var users = [];

var index;
for(index = 0; index < chatsplit.length; index++) {

	//BIG BLOCK OF CODE COMMENTED OUT IN CASE IT BECOMES IMPORTANT
	//LOOKS FOR USERNAMES IN THE ROOM NOTIFICATIONS
	/*
		//Find users added by an administrator
		if(chatsplit[index].includes("User") && chatsplit[index].includes("added by")) {
			sentence = chatsplit[index].split(" ");
			if(sentence.length == 6) {
				user1 = sentence[2];
				user2 = sentence[5].replace(".", "");

				if(!(users.includes(user1))) {
					users.push(user1);
				} //end of if statement

				if(!(users.includes(user2))) {
					users.push(user2);
				} //end of if statement

			} //end of if statement
		} //end of if statement

		//Find users removed by an administrator
		if(chatsplit[index].includes("User") && chatsplit[index].includes("removed by")) {
			sentence = chatsplit[index].split(" ");
			if(sentence.length == 6) {
				user1 = sentence[2];
				user2 = sentence[5].replace(".", "");

				if(!(users.includes(user1))) {
					users.push(user1);
				} //end of if statement

				if(!(users.includes(user2))) {
					users.push(user2);
				} //end of if statement

			} //end of if statement
		} //end of if statement


		//Find users muted by a user
		if(chatsplit[index].includes("User") && chatsplit[index].includes("muted by")) {
			sentence = chatsplit[index].split(" ");
			if(sentence.length == 6) {
				user1 = sentence[2];
				user2 = sentence[5].replace(".", "");

				if(!(users.includes(user1))) {
					users.push(user1);
				} //end of if statement

				if(!(users.includes(user2))) {
					users.push(user2);
				} //end of if statement

			} //end of if statement
		} //end of if statement

		//Find users unmuted by a user
		if(chatsplit[index].includes("User") && chatsplit[index].includes("unmuted by")) {
			sentence = chatsplit[index].split(" ");
			if(sentence.length == 6) {
				user1 = sentence[2];
				user2 = sentence[5].replace(".", "");

				if(!(users.includes(user1))) {
					users.push(user1);
				} //end of if statement

				if(!(users.includes(user2))) {
					users.push(user2);
				} //end of if statement

			} //end of if statement
		} //end of if statement

		//Find Users that have joined the chat
		if(chatsplit[index] == "Has joined the channel.") {
			if(!(users.includes(chatsplit[index-2]))) {
				users.push(chatsplit[index-2]);
			}
		}

	*/

	var titles = ["Admin", "Owner", "Facilitator", "Q Chatter", "Moderador", "Spanish facilitator", "Coordinating staff person"];	

	//Find users by user title
	if (titles.includes(chatsplit[index])) {
		//Username is not a user title
		if(!(titles.includes(chatsplit[index-1])) && !(users.includes(chatsplit[index-1]))) {
			users.push(chatsplit[index-1]);
		} //end of if statement
	} //end of if statement


	//Find usernames appearing before something that looks like a time
	if((chatsplit[index].includes("AM") || chatsplit[index].includes("PM")) && (chatsplit[index].length == 8 || chatsplit[index].length == 7)) {
		//Username should be one word and is not a user title
		if(!(titles.includes(chatsplit[index-1])) && !(chatsplit[index-1].includes(" ")) && !(users.includes(chatsplit[index-1]))) {
			users.push(chatsplit[index-1]);
		}
	}


} //end of for loop

	//Return array
	return users;

} //end of findusers function





//Verify the active users that sent at least one message during the chat
//PARAMETERS: Chat data (chat - STRING), List of usernames (userlist - STRING ARRAY), Existing labels array (contentarray - STRING ARRAY)
//RETURNS: Updated list of active users (users - STRING ARRAY)

function verifyusers(chat, userlist, contentarray) {

chatsplit = chat.split("\n");

var users = [];

var userindex;
//for every potential username
for(userindex = 0; userindex < userlist.length; userindex++) {
	var chatindex;

	//go through the chat
	for(chatindex = 0; chatindex < chatsplit.length; chatindex++) {
		
		//if the element is a username followed by a timestamp or a user title
		if(chatsplit[chatindex] == userlist[userindex] && (contentarray[chatindex+1] == "time" || contentarray[chatindex+1] == "usertitle")) {

			//AND the previous element is empty (not in the middle of a message)
			if(chatsplit[chatindex-1] == "" && !(users.includes(userlist[userindex]))) {
				//It is a username, and they have messaged at least once
				users.push(userlist[userindex]);

				//Go to next potential username
				chatindex = chatsplit.length;

			} //end of if statement
		} //end of if statement
	} //end of for loop


} //end of for loop

	//Return string array
	return users;


} //end of verifyusers function





//Finds the list of facilitators in the chat
//PARAMETERS: Chat data (chat - STRING), Existing labels array (contentarray - STRING ARRAY), Index of where the chat starts (chatstartindex - INTEGER), list of youth (youlist - STRING ARRAY)
//RETURNS: List of facilitators (fac - STRING ARRAY)

function findfacilitators(chat, contentarray, chatstartindex, youlist) {

chatsplit = chat.split("\n");

var fac = [];

var index;
for(index = 0; index < chatsplit.length; index++) {

	//If the user is a facilitator and has not been added yet
	if(isfacilitator(chat, contentarray, index, chatstartindex) && !(fac.includes(chatsplit[index]))) {

		//Add them
		fac.push(chatsplit[index]);

	} //end of if statement

} //end of for loop

//Go through every element before the first chat comment
for(index = chatstartindex; index > 0; index--){
	//If a user is added
	if(contentarray[index] == "roomnotif" && chatsplit[index].includes("added by")) {
		//document.getElementById("test").innerHTML = document.getElementById("test").innerHTML + " " + chatsplit[index];

		words = chatsplit[index].split(" ");

		//If the user was not previously added as a facilitator and is not a youth
		if(!(fac.includes(words[2]) || youlist.includes(words[2]))) {
			//They must be an inactive facilitator
			fac.push(words[2] + " (inactive)");

		} //end of if statement

	} //end of if statement

} //end of for loop
	
	//Return array
	return fac;

} //end of findfacilitators function





//Finds the list of youth in the chat
//PARAMETERS: Chat data (chat - STRING), Existing labels array (contentarray - STRING ARRAY)
//RETURNS: List of youth(youth - STRING ARRAY)

function findyouth(chat, contentarray) {

chatsplit = chat.split("\n");

var youth = [];

var index;
for(index = 0; index < chatsplit.length; index++) {

	//If the user is a youth user and has not been added yet
	if(isyouth(chat, contentarray, index) && !(youth.includes(chatsplit[index]))) {

		//Add them
		youth.push(chatsplit[index]);

	} //end of if statement

} //end of for loop
	
	//Return array
	return youth;

} //end of findyouth function





//Labels which elements in chat are usernames and titles (Admin, Owner, Facilitator) in a separate array
//PARAMETERS: Chat data (chat - STRING), List of usernames (userlist - STRING ARRAY), If repeat usernames were removed (repeatsremoved - BOOLEAN)
//RETURNS: Array with username and user title indices identified, and the index of where the chat starts (returnarray - ARRAY OF STRING ARRAYS)

function userlabels(chat, userlist, repeatsremoved) {

chatsplit = chat.split("\n");

var contentarray = [];

chatstartindex = 0;

var index;
for(index = 0; index < chatsplit.length; index++) {
	var titles = ["Admin", "Owner", "Facilitator", "Q Chatter", "Moderador", "Spanish facilitator", "Coordinating staff person"];

	//Identify which of the content is username labels
	//If repeats have been removed, check that the line before the username is blank (start of a message)
	if(userlist.includes(chatsplit[index]) && (chatsplit[index-1] == "" || !(repeatsremoved))) {
		//Add it to the array
		contentarray[index] = "username";

		//Identify the index of where the chat starts to distinguish early-on room notifications
		if(chatstartindex == 0) {
			chatstartindex = index;
		}

	//Identify which of the content is user titles
	//Must be a user title following a username OR another user title
	} else if (titles.includes(chatsplit[index]) && (userlist.includes(chatsplit[index-1]) || titles.includes(chatsplit[index-1]))) {
		//Add it to the array
		contentarray[index] = "usertitle";

	//default the rest of the array
	} else if(chatsplit[index] == "") {
		contentarray[index] == "";

	} else {
		contentarray[index] = "message";
	} //end of if statement

} //end of for loop

	returnarray = [contentarray, chatstartindex];

	//Return array
	return returnarray;

} //end of userlabels function





//Labels which elements in chat are times in a separate array
//PARAMETERS: Chat data (chat - STRING), List of usernames (userlist - STRING ARRAY), Existing labels array (contentarray - STRING ARRAY)
//RETURNS: labels array with the time indices identified (addarray - STRING ARRAY)

function timelabels(chat, userlist, contentarray) {

chatsplit = chat.split("\n");

addarray = contentarray;

var index;
//Up to second to last element (last element won't be a timestamp)
for(index = 0; index < chatsplit.length-1; index++) {

	//Identify which of the content looks like a time
	if((chatsplit[index].includes("AM") || chatsplit[index].includes("PM")) && (chatsplit[index].length == 8 || chatsplit[index].length == 7))  {
		//Identify which are timestamps occuring after a username or user title, or occuring before a room notification
		if(contentarray[index-1] == "username" || contentarray[index-1] == "usertitle" || contentarray[index+1] == "roomnotif") {
			//Add it to the array
			addarray[index] = "time";
		} //end of if statement
	} //end of if statement

} //end of for loop
	
	//Return array
	return addarray;

} //end of timelabels function





//Labels which elements in chat are room notifications in a separate array
//PARAMETERS: Chat data (chat - STRING), List of usernames (userlist - STRING ARRAY), Existing labels array (contentarray - STRING ARRAY)
//RETURNS: labels array with the room notification indices identified (addarray - STRING ARRAY)

function roomlabels(chat, userlist, contentarray) {

chatsplit = chat.split("\n");

addarray = contentarray;

var index;
for(index = 0; index < chatsplit.length; index++) {

	if(chatsplit[index].includes("User") && chatsplit[index].includes("added by")) {
		sentence = chatsplit[index].split(" ");
		if(sentence.length == 6) {
			addarray[index] = "roomnotif";
		} //end of if statement
	} //end of if statement
	
	if(chatsplit[index].includes("User") && chatsplit[index].includes("removed by")) {
		sentence = chatsplit[index].split(" ");
		if(sentence.length == 6) {
			addarray[index] = "roomnotif";
		} //end of if statement
	} //end of if statement

	if(chatsplit[index].includes("User") && chatsplit[index].includes("muted by")) {
		sentence = chatsplit[index].split(" ");
		if(sentence.length == 6) {
			addarray[index] = "roomnotif";
		} //end of if statement
	} //end of if statement

	if(chatsplit[index].includes("User") && chatsplit[index].includes("unmuted by")) {
		sentence = chatsplit[index].split(" ");
		if(sentence.length == 6) {
			addarray[index] = "roomnotif";
		} //end of if statement
	} //end of if statement

	if(chatsplit[index].includes("was set owner by")) {
		sentence = chatsplit[index].split(" ");
		if(sentence.length == 7) {
			addarray[index] = "roomnotif";
		} //end of if statement
	} //end of if statement

	if(chatsplit[index].includes("is no longer owner by")) {
		sentence = chatsplit[index].split(" ");
		if(sentence.length == 8) {
			addarray[index] = "roomnotif";
		} //end of if statement
	} //end of if statement

	if(chatsplit[index].includes("Room announcement changed to:") && chatsplit[index].includes("by")) {
		addarray[index] = "roomnotif";
	} //end of if statement
	
	if(chatsplit[index].includes("Room description changed to:") && chatsplit[index].includes("by")) {
		addarray[index] = "roomnotif";
	} //end of if statement

	if(chatsplit[index].includes("Room name changed to:") && chatsplit[index].includes("by")) {
			addarray[index] = "roomnotif";
	} //end of if statement

	if(chatsplit[index].includes("Room topic changed to:") && chatsplit[index].includes("by")) {
			addarray[index] = "roomnotif";
	} //end of if statement

	if(chatsplit[index].includes("Room type changed to:") && chatsplit[index].includes("by")) {
			addarray[index] = "roomnotif";
	} //end of if statement

	if(chatsplit[index].includes("Pinned a message:") || chatsplit[index].includes("pinned a message:")) {
			addarray[index] = "roomnotif";
	} //end of if statement

	if(chatsplit[index].includes("Has joined the channel.") || chatsplit[index].includes("has joined the channel.")) {
			addarray[index] = "roomnotif";
	} //end of if statement

	if(chatsplit[index].includes("Has left the channel.") || chatsplit[index].includes("has left the channel.")) {
			addarray[index] = "roomnotif";
	} //end of if statement

} //end of for loop
	
	//Return array
	return addarray;

} //end of roomlabels





//Labels which elements are reply notifications and replies
//NOTE: If someone deletes their message that people have replied to, the replies will not
//		be formatted correctly.
//PARAMETERS: Chat data (chat - STRING), List of usernames (userlist - STRING ARRAY), Existing labels array (contentarray - STRING ARRAY)
//RETURNS: labels array with the reply labels identified (addarray - STRING ARRAY)

function replylabels(chat, userlist, contentarray) {

chatsplit = chat.split("\n");

addarray = contentarray;

var index;
for(index = 0; index < chatsplit.length; index++) {

	var checkreply = chatsplit[index].split(" ");

	//If line contains these key words
	if(checkreply[1] == "reply" || checkreply[1] == "replies") {
		var checkreply2 = chatsplit[index+1].split(" ");

		//And the following line has a timestamp
		if(checkreply2[4] == "PM" || checkreply2[4] == "AM") {

			//Then they are a reply notification
			addarray[index] = "replynotif";
			addarray[index+1] = "replynotif";

			message = chatsplit[index-2];

			//Special case with a reply to a link
			if(message == "" && chatsplit[index-3].includes("https://")) {
				message = chatsplit[index-3];
			}

			//document.getElementById("test").innerHTML = document.getElementById("test").innerHTML + " " + message

			var timestampfound = false;
			var replyindex;

			//Check to see where the message is repeated and mark the response as a reply
			for(replyindex = index; replyindex < chatsplit.length; replyindex++) {
														//In case the message is a filename (things get weird)												
				if(chatsplit[replyindex] == message || (message.includes(".doc") && (chatsplit[replyindex].includes(message) || message.includes(chatsplit[replyindex])))) {
					//In case the reply is an exact copy (only mark the first occurence as a replyto)	
					if(userlist.includes(chatsplit[replyindex+2]) && addarray[replyindex] == "message") {
						addarray[replyindex] = "replyto";
						addarray[replyindex+3] = "reply";
					} //end of if statement
				} //end of if statement

				if(addarray[replyindex] == "time") {
					timestampfound = true;
				}
				
				//If it is a direct reply, occuring right after the message (special format)
				if(!(timestampfound) && addarray[replyindex] == "username" && addarray[replyindex+1] == "message") {
					addarray[replyindex-1] = "replytodirect";
					addarray[replyindex+1] = "reply";
				} //end of if statement

			} //end of for loop

		} //end of if statement

	} //end of if statement

} //end of for loop

	//return array
	return addarray;

} //end of replylabels function





//Labels which elements are emoji reactions
//***NOTE: If the last line of a user's message is non-letter and a small number, it will read as a reaction***
//***NOTE: Emoji color cannot be saved
//PARAMETERS: Chat data (chat - STRING), Existing labels array (contentarray - STRING ARRAY)
//RETURNS: Labels array with the emojis identified (addarray - STRING ARRAY)

function emojilabels(chat, contentarray) {
	chatsplit = chat.split("\n");

	addarray = contentarray;
	
	var counter;
	var numbers = [];
	//Assumes there will be no more than 50 reactions on a message
	for(counter = 1; counter <= 50; counter++) {
		numbers.push(counter.toString());
	}

	//List of all letters and some characters
	var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
	"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C",
	"D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
	"T", "U", "V", "W", "X", "Y", "Z", "!", "@", "#", "$", "%", "^", "&", "*", "(",
	")", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	
	var index;
	for(index = 0; index < chatsplit.length; index++) {
	
		var checkemo = chatsplit[index].split(" ");

		var emoji = true;

		var emojindex;
		//Look at all the letters/characters
		for(emojindex = 0; emojindex < letters.length; emojindex++) {
			//If the first character contains any of those letters
			if(checkemo[0].includes(letters[emojindex])) {
				//Then it is not an emoji
				emoji = false;
				emojindex = letters.length;
			}
		}
	
		//If the first character does not have any letters (likely an emoji) and the second character is a number
		if(emoji && numbers.includes(checkemo[1])) {
			//And the following line is a message or a blank space (end of message)
			if(addarray[index+1] == "message" || chatsplit[index+1] == "") {
				//The line is an emoji reaction
				addarray[index] = "emoji";
			}
		}

	} //end of for loop
	
		//return array
		return addarray;

} //end of emojilabels function





//Checks to make sure the content labels are correct
//PARAMETERS: Existing labels array (contentarray - STRING ARRAY)
//RETURNS: labels array that follows the correct model (addarray - STRING ARRAY)

function roomcheck(contentarray) {

addarray = contentarray;

var index;
//Up to second to last element
for(index = 0; index < chatsplit.length-1; index++) {
	
	//If room notification is not preceded by a time
	if(contentarray[index] == "roomnotif" && contentarray[index-1] != "time") {
		//It is not a room notification
		contentarray[index] == "message";
	}

	//If a username is not followed by a time or a user title
	if(contentarray[index] == "username" && (contentarray[index+1] != "time" || contentarray[index+1] != "usertitle")) {
		//It is not a username
		contentarray[index] == "message";
	}

} //end of for loop
	
	//Return array
	return addarray

}





//Removes redundant usernames in the chat data
//PARAMETERS: Chat data (chat - STRING), labels array (contentarray - STRING ARRAY)
//RETURNS: Chat data without repeated usernames (cleanchat - STRING)

function removerepeats(chat, contentarray) {

chatsplit = chat.split("\n");
	
var index;
var cleanchat = "";
for(index = 0; index < chatsplit.length; index++) {

	//Keep the last two elements
	if(index >= chatsplit.length-2) {
		cleanchat += chatsplit[index] + "\n";

	//For any other element...
	} else {
	
		//If it is a username sandwiched by a repeat and a timestamp
		if(contentarray[index] == "username" && chatsplit[index-1] == chatsplit[index] && contentarray[index+1] == "time" && chatsplit[index-2] == "") {
			//Remove it

		//If it is a username sandwiched by a repeat and a user title
		} else if(contentarray[index] == "username" && chatsplit[index-1] == chatsplit[index] && contentarray[index+1] == "usertitle" && chatsplit[index-2] == "") {
			//Remove it
			
		//In all other cases...
		} else {
			//Keep it
			cleanchat += chatsplit[index] + "\n";
		} //end of if statement
	} //end of if statement

} //end of for loop

	//Return string
	return cleanchat;

} //end of removerepeats function



//Removes the username preceding room notifications for cleaner look
//PARAMETERS: Chat data (chat - STRING), Existing labels array (contentarray - STRING ARRAY)
//RETURNS: Cleaned up chat data (cleanchat - STRING);

function cleanroomnotifs(chat, contentarray) {

chatsplit = chat.split("\n");

var index;
var cleanchat = "";
for(index = 0; index < chatsplit.length; index++) {

	//Keep the last two elements
	if(index >= chatsplit.length-2) {
		cleanchat += chatsplit[index] + "\n";

	//If the username is for a room notification
	} else if(contentarray[index] == "username" && contentarray[index+2] == "roomnotif") {

		//Format join channel message
			if(chatsplit[index+2].includes("Has joined the channel.")) {
			chatsplit[index+2] = chatsplit[index] + " has joined the channel.";

		//Format leave channel message
		} else if(chatsplit[index+2].includes("Has left the channel.")) {
			chatsplit[index+2] = chatsplit[index] + " has left the channel.";

		//Format pinned message
		} else if(chatsplit[index+2].includes("Pinned a message:")) {
			chatsplit[index+2] = chatsplit[index] + " pinned a message:"
								+ "<br>\xa0\xa0\xa0\xa0" + chatsplit[index+3] +
								"<br>\xa0\xa0\xa0\xa0" + chatsplit[index+4];
			chatsplit[index+3] = "";
			chatsplit[index+4] = "";
		
		//If any other notification or already formatted
		} else {
			//Remove it
		}

	//For any other element...
	} else {
		//Keep it
		cleanchat += chatsplit[index] + "\n";
	} //end of if statement

} //end of for loop

	//Return string
	return cleanchat;

} //end of cleanroomnotifs function





//Helper function to determine whether a user is a facilitator
//PARAMETERS: Chat data (chat - STRING), Existing labels array (contentarray - STRING ARRAY), index of username (userindex - INTEGER)
//RETURNS: Whether the user is a facilitator (isfacilitator - BOOLEAN)

function isfacilitator(chat, contentarray, userindex) {
chatsplit = chat.split("\n");
var isfacilitator = false;

//If the index is not at a username
if(contentarray[userindex] != "username") {
	//Not a facilitator
	return isfacilitator;
}

var index;
for(index = userindex+1; index < chatsplit.length; index++) {

	//If the user has a facilitator title under their name
	if(contentarray[index] == "usertitle" && chatsplit[index] == "Facilitator") {
		
		//They are a facilitator
		isfacilitator = true;

		//Finish
		index = chatsplit.length;
	
	//If the message is reached and there is no facilitator title
	} else if(contentarray[index] == "message" || contentarray[index] == "reply") {
		
		//End the loop
		index = chatsplit.length;

	} //end of if statement

} //end of for loop

	//Return boolean
	return isfacilitator;

} //end of isfacilitator function





//Helper function to determine whether a user is a youth user
//PARAMETERS: Chat data (chat - STRING), Existing labels array (contentarray - STRING ARRAY), index of username (userindex - INTEGER)
//RETURNS: Whether the user is a youth user (isyouth - BOOLEAN)

function isyouth(chat, contentarray, userindex) {

chatsplit = chat.split("\n");
var isyouth = false;

//If the index is not at a username
if(contentarray[userindex] != "username") {
	//Not a youth username
	return isyouth;
}

var index;
for(index = userindex+1; index < chatsplit.length; index++) {

	//If the user has a Q Chatter title under their name
	if(contentarray[index] == "usertitle" && chatsplit[index] == "Q Chatter") {

		//They are a youth user
		isyouth = true;

		//Finish
		index = chatsplit.length
	
	//If the message is reached and there is no title
	} else if(contentarray[index] == "time") {

		//They are a youth user
		isyouth = true;

		//Finish
		index = chatsplit.length;

	//Otherwise...
	} else {

		//End the loop
		index = chatsplit.length;

	}//end of if statement



} //end of for loop


	//Return boolean
	return isyouth;

} //end of isyouth function





//Find the list of users that were not greeted within the time limit.
/* ***NOTE: CANNOT TAKE INTO ACCOUNT CHANGED USERNAMES - IF A USER CHANGES THEIR USERNAME AFTER JOINING AND THE FACILITATOR REFERS TO THEM BY
   THE NEW USERNAME, IT WILL NOT BE CONSIDERED GREETED. */
//PARAMETERS: Chat data (chat - STRING), Existing labels array (contentarray - STRING ARRAY), Time limit for greeting (timelimit - INT), List of facilitators (faclist - STRING ARRAY)
//RETURNS: A list of all the youth that were not greeted, and a list of all the usernames that joined (alljoin - ARRAY OF STRING ARRAYS)

function ungreeted(chat, contentarray, timelimit, faclist) {

chatsplit = chat.split("\n");

nogreet = [];
searched = [];
alljoin = [];

var index = 0;
for(index = 0; index < chatsplit.length; index++) {
	username = "";
	time1 = "";
	time2 = "";

	words = chatsplit[index].split(" ");

	//If there is a room notification of someone joining the channel
	if(contentarray[index] == "roomnotif") { 
		time1 = chatsplit[index-1];

		//Get their username
		if (chatsplit[index].includes("has joined the channel."))  {
			username = words[0]
		} else if (chatsplit[index].includes("added by") && chatsplit[index].includes("User")) {
			username = words[2];
		} //end of if statement
	} //end of if statement

	//If the user is not a facilitator
	if(username != "" && !(faclist.includes(username) || faclist.includes(username + " (inactive)")) && !(searched.includes(username))) {
		var greeted = false;
		var leftsoon = false;
		var greetindex;

		//Go through every message after the join notification
		for(greetindex = index; greetindex < chatsplit.length; greetindex++) {

			//If you come across a facilitator username
			if(faclist.includes(chatsplit[greetindex])) {
				var messageindex;

				//Go through each message after the username
				for(messageindex = greetindex+1; messageindex < chatsplit.length; messageindex++) {

					//When you reach the timestamp
					if(contentarray[messageindex] == "time") {

						//Store it
						time2 = chatsplit[messageindex]

					//If you reach the next username
					} else if(contentarray[messageindex] == "username") {

						//You have gone through the whole message, so stop searching
						messageindex = chatsplit.length;

					//Otherwise...
					} else {

						//If the message includes the username and occured in time
						if(chatsplit[messageindex].includes(username) && checktimes(time1, time2, timelimit)) {

							//The user was greeted, so stop searching this user completely
							greeted = true;
							messageindex = chatsplit.length;
							greetindex = chatsplit.length;

						} //end of if statement

					} //end of if statement

				} //end of for loop

			//If you come across a leaving or removal notification for the user
			} else if(contentarray[greetindex] == "roomnotif" && (chatsplit[greetindex].includes("removed by") || chatsplit[greetindex].includes("has left the channel.")) && chatsplit[greetindex].includes(username)) {
				time3 = chatsplit[greetindex-1];
				//If the user left within the greeting time limit
				if(checktimes(time1, time3, timelimit)) {
					//A greeting was not necessary anyway
					//So it should not be counted as an ungreeted user
					greeted = true;
					leftsoon = true;
					messageindex = chatsplit.length;
					greetindex = chatsplit.length;
				} //end of if statement

			//If you come across a notification of the channel being made private (chat ends)
			} else if(contentarray[greetindex] == "roomnotif" && chatsplit[greetindex].includes("Room type changed to: Private Group")) {
				time3 = chatsplit[greetindex-1];
				//If the channel ends within the greeting time limit
				if(checktimes(time1, time3, timelimit)) {
					//A greeting was not necessary anyway
					//So it should not be counted as an ungreeted user
					greeted = true;
					leftsoon = true;
					messageindex = chatsplit.length;
					greetindex = chatsplit.length;
				} //end of if statement
			}//end of if statement 

		} //end of for loop
		
		//*Check to see if the user was accidentally added by a facilitator through an @ mention *//
		//If there was no greeting after the user joined
		if(!(greeted)) {
			var wronguindex;
			//Go backwards from the notification
			for(wronguindex = index-1; wronguindex > 0; wronguindex--) {
				//If a message contains the added username
				if(contentarray[wronguindex] == "message" && chatsplit[wronguindex].includes(username)) {
					//The user must have been added by accident due to the @ mention
					//It should not be counted as an ungreeted user
					greeted = true;
					leftsoon = true;
					wronguindex = 0;
				} //end of if statement
			} //end of for loop
		} //end of if statement

		//If the user was not greeted
		if(!(greeted)) {
			//Add their name to the list
			nogreet.push(username)
		} //end of if statement

		//If the user did not leave or get removed prematurely, or was not an accident, or the channel did not end immediately after joining
		if(!(leftsoon)) {
			//Consider them completely searched
			searched.push(username);
		} //end of if statement

	} //end of if statement

} //end of for loop

	alljoin = [nogreet, searched];

	//Return array
	return alljoin;

} //end of ungreeted function





//Checks if an introductory and a concluding message are included
//NOTE: Looks for key phrases. If the message does not include all those phrases, it will not count.
//PARAMETERS: Chat data (chat - STRING), Existing labels array (contentarray - STRING ARRAY), List of facilitators (faclist - STRING ARRAY)
//RETURNS: An array representing if an introduction and conclusion are present (reqsent - BOOLEAN ARRAY)

function reqmessages(chat, contentarray, faclist) {

chat = chat.split("\n");

reqsent = [false, false];

//Phrases that the introduction and conclusion should contain
intro = ["1.", "2.", "3.", "4.", "5.", "support", "mental health", "group", "questions"]
introSpanish = ["1.", "2.", "3.", "4.", "5.", "salud mental", "siendo abusadx"]
conc = ["forms.gle/jqhzksh6f2hndgnt8"]
concSpanish = ["forms.gle/uAqfbu1b6UP1phRJA"]

var index = 0;
for(index = 0; index < chatsplit.length; index++) {

	//If the user is a facilitator
	if(faclist.includes(chatsplit[index])) {
		var message = "";

		//Go through every line after their username
		for(messageindex = index+1; messageindex < chatsplit.length; messageindex++) {

			var messageindex;

			//Concatenate the message into a single string
			if(contentarray[messageindex] == "username" || contentarray[messageindex] == "roomnotif") {
				messageindex = chatsplit.length;
			} else {
				message += chatsplit[messageindex].toLowerCase() + " ";
			} //end of if statement
		
		} //end of for loop

		var checkindex;
		var count = 0;

		//For every required introductory phrase
		for(checkindex = 0; checkindex < intro.length; checkindex++) {
			//Check how many phrases the message includes
			if(message.includes(intro[checkindex])) {
				count++;
			} //end of if statement
		} //end of for loop

		//If all are included, there is an introduction
		if(count == intro.length) {
			reqsent[0] = true;
		//Otherwise, check for Spanish introduction
		} else {
			//Reset count
			count = 0;

			//For every required Spanish introductory phrase
			for(checkindex = 0; checkindex < introSpanish.length; checkindex++) {
				//Check how many phrases the message includes
				if(message.includes(introSpanish[checkindex])) {
					count++;
				} //end of if statement
			} //end of for loop
			
			//If all are included, there is an introduction
			if(count == introSpanish.length) {
				reqsent[0] = true;
			} //end of if statement

		} //end of if statement
	
		count = 0;

		//For every required concluding phrase
		for(checkindex = 0; checkindex < conc.length; checkindex++) {
			//Check how many phrases the message includes
			if(message.includes(conc[checkindex])) {
				count++;
			} //end of if statement
		} //end of for loop

		//If all are included, there is a conclusion
		if(count == conc.length) {
			reqsent[1] = true;
		//Otherwise, check for Spanish conclusion
		} else {
			//Reset count
			count = 0;

			//For every required Spanish introductory phrase
			for(checkindex = 0; checkindex < concSpanish.length; checkindex++) {
				//Check how many phrases the message includes
				if(message.includes(concSpanish[checkindex])) {
					count++;
				} //end of if statement
			} //end of for loop
			
			//If all are included, there is an introduction
			if(count == introSpanish.length) {
				reqsent[1] = true;
			} //end of if statement
			
		} //end of if statement

	} //end of if statement

} //end of for loop

	//return array
	return reqsent;

} //end of introduction function





//Helper function to check if two timestamps are within a time limit. Assumes that time2 occurs after time1. Assumes small time differences.
//PARAMETERS: Timestamp of first message (time1 - STRING), Timestamp of second message (time2 - STRING), Maximum allowed time difference (timelimit - INT)
//RETURNS: Whether the timestamps occur within the time limit (intime - BOOLEAN)

function checktimes(time1, time2, timelimit) {
var intime = false;
var timediff;

time1 = time1.split(" ");
time2 = time2.split(" ");

t1 = time1[0].split(":");
t2 = time2[0].split(":");

t1[0] = parseInt(t1[0], 10);
t1[1] = parseInt(t1[1], 10);
t2[0] = parseInt(t2[0], 10);
t2[1] = parseInt(t2[1], 10);

//If the second hour is higher numerically than the first
if(t1[0] <= t2[0]) {
	t1total = 60 * t1[0] + t1[1];
	t2total = 60 * t2[0] + t2[1];

	timediff = t2total - t1total;

	if(timediff <= timelimit) {
		intime = true;
	} //end of if statement

} else {
	t1difference = 60 * (12 - t1[0]) - t1[1];
	t2total = 60 * t2[0] + t2[1];

	timediff = t2total + t1difference;	

	if(timediff <= timelimit) {
		intime = true;
	} //end of if statement

} //end of if statement

	//Return boolean
	return intime;

} //end of checktimes function





//Color code the chat to make it visually easier to read.
//PARAMETERS: Chat data (chat - STRING), Existing labels array (labels - STRING ARRAY)
//RETURNS: Color coded chat (colorchat - STRING)

function colorcode(chat, labels) {

chatsplit = chat.split("\n");

var colorchat = "";
var index;
replymessage = "";
for(index = 0; index < chatsplit.length; index++) {
	/* NOTE: If the font colors of two elements are different, they are not equivalent
	even if the string is the same. */
	/* NOTE: You can only change a font color once... ? I think it's because doing it again 
	would be like doing .fontcolor('a').fontcolor('b') so you have to be careful*/	

	if(labels[index] == "time") {
		chatsplit[index] = chatsplit[index].fontcolor("gray");
		colorchat += "\n" + chatsplit[index] + "\n";
	}

	if(labels[index] == "username") {
		chatsplit[index] = chatsplit[index].fontcolor("blue");
		colorchat += "\n" + chatsplit[index];
	}

	if(labels[index] == "usertitle") {
		chatsplit[index] = chatsplit[index].fontcolor("purple");
		colorchat += " (" + chatsplit[index] + ")";
	}

	if(labels[index] == "roomnotif") {
		chatsplit[index] = chatsplit[index].fontcolor("gray");
		colorchat += chatsplit[index] + "\n";
	}

	if(labels[index] == "message") {
		//chatsplit[index] = chatsplit[index].fontcolor("black");
		colorchat += chatsplit[index] + "\n";
	}

	if(labels[index] == "replynotif" && labels[index+1] == "replynotif") {
		replymessage = chatsplit[index-2];
		chatsplit[index] = "\xa0\xa0\xa0\xa0" + chatsplit[index] + ": " + chatsplit[index+1];
		chatsplit[index+1] = "";

		chatsplit[index] = chatsplit[index].fontcolor("gray");
		colorchat += chatsplit[index] + "\n";
	}

	if(labels[index] == "replytodirect") {
		chatsplit[index] = "REPLY TO: " + replymessage;
		chatsplit[index] = chatsplit[index].fontcolor("red");
		colorchat += "\n" + chatsplit[index];
	}

	if(labels[index] == "replyto") {
		chatsplit[index] = "REPLY TO: " + chatsplit[index];
		chatsplit[index] = chatsplit[index].fontcolor("red");
		colorchat += "\n" + chatsplit[index];
	}

	if(labels[index] == "reply") {
		colorchat += "\n" + chatsplit[index] + "\n";
	}

	if(labels[index] == "emoji") {
		reactions = chatsplit[index].split(" ");
		var message = "REACTIONS: "

		emoindex = 0;
		for(emoindex = 0; emoindex < reactions.length-2; emoindex += 2) {
			message += reactions[emoindex] + "x" + reactions[emoindex+1] + " ";
		}

		message = message.fontcolor("green");
		colorchat += message + "\n";
	}


} //end of for loop

	return colorchat;

} //end of colorcode function