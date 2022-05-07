import { send_crypted_message, extract_from_JSON } from "./index.js";

var socket = io();
var userName = "patoche " + Math.random();
let msg;

socket.emit("request", msg = { type: "login", name: userName });

//get_users
//sanytise input


//TO DO  disable button make an offer durong a convo by using element.disabled 
/*
var firstName = ...
var lastName = ...
*/
/*
var loadedConversations = {
    conv1:
        { "username": "patoche 0.13311599133578045", "messages": { "0": 88, "1": 252, "2": 228, "3": 172, "4": 138, "5": 97, "6": 75, "7": 167, "8": 5, "40": 95, "41": 19, "42": 114, "43": 93, "44": 241, "45": 212, "46": 110, "47": 231, "48": 8, "49": 50, "50": 83, "51": 169, "52": 169, "53": 158, "54": 137, "55": 201, "56": 163, "57": 203, "58": 205, "59": 249, "60": 148, "61": 139, "62": 108, "63": 115, "64": 252, "65": 255, "66": 223, "67": 184, "68": 53, "69": 66, "70": 59 }, "key": { "0": 40, "1": 245, "2": 61, "3": 20, "4": 135, "5": 198, "6": 60, "7": 152, "8": 29, "9": 136, "10": 253, "11": 142, "12": 171, "13": 76, "14": 116, "15": 175, "16": 111, "17": 103, "18": 64, "19": 193, "20": 141, "21": 150, "22": 17, "23": 157, "24": 61, "25": 5, "26": 249, "27": 11, "28": 70, "29": 125, "30": 243, "31": 135, "32": 62, "33": 192, "34": 13, "35": 57, "36": 201, "37": 77, "38": 0, "39": 39, "40": 30, "41": 57, "42": 60, "43": 46, "44": 203, "45": 113, "46": 74, "47": 128 }, "nonce": "rsnt7fO0hiLB", "conversationName": "patoche 0.2519065011979116", "date": "03/05/2022" },
    conv2:
        { "username": "patoche 0.13311599133578045", "messages": { "0": 88, "1": 252, "2": 228, "3": 172, "4": 138, "5": 97, "6": 75, "7": 167, "8": 5 }, "key": { "0": 40, "1": 245, "2": 61, "3": 20, "4": 135, "5": 198, "6": 60, "7": 152, "8": 29, "9": 136, "10": 253, "11": 142, "12": 171, "13": 76, "14": 116, "15": 175, "16": 111, "17": 103, "18": 64, "19": 193, "20": 141, "21": 150, "22": 17, "23": 157, "24": 61, "25": 5, "26": 249, "27": 11, "28": 70, "29": 125, "30": 243, "31": 135, "32": 62, "33": 192, "34": 13, "35": 57, "36": 201, "37": 77, "38": 0, "39": 39, "40": 30, "41": 57, "42": 60, "43": 46, "44": 203, "45": 113, "46": 74, "47": 128 }, "nonce": "rsnt7fO0hiLB", "conversationName": "patoche 0.2519065011979116", "date": "03/05/2022" }
}
loadedConversations = JSON.parse(loadedConversations);
for (let i in loadedConversations) {
    console.log(i);
}
*/
var userList = new Array();
var callee;
var options = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
}
var caller;
var pcCaller;
var pcCallee;
var dataChannel;
var dataChannelList = new Array();
var password = "coucou";



//put the name of the client in the front 
let divHeader = document.getElementById("friendName");
divHeader.innerHTML += `<div class="col-sm-8 col-xs-7 heading-name" id = "yourName">
            <a class="heading-name-meta">Hello ${userName} !
            </a>
          </div>
        `;
function putUserName() {
    document.getElementById("yourName").style.display = "initial";
};

//envoie msg 

let SendButton = document.getElementById("button");
SendButton.addEventListener("click", e => {
    let divMessage = document.getElementById("messageInput");
    displayMessageToSend(dataChannel, divMessage.value);
    if (dataChannelList.length > 0) {
        for (let i = 0; i < dataChannelList.length; i++)
            sendMessage(dataChannelList[i], divMessage.value, userName);
    }
    else {
        sendMessage(dataChannel, divMessage.value, userName);
    }

    divMessage.value = "";
});



async function deleteMessages(convName) {
    //remove messages and hide the quit button 
    let messages = "";
    let divMsg = document.getElementById("messages");
    //console.log(divMsg);
    let divMessages = document.getElementsByClassName("message-text");
    for (let i = 0; i < divMessages.length; i++) {
        //console.log(divMessages[i].parentElement.children);
        if (divMessages[i].parentNode.className == "receiver") {
            // console.log(divMessages[i].textContent.trimStart());
            messages += "$£€/receiv/";
        }
        else if (divMessages[i].parentNode.className == "sender") {
            messages += "$£€/sender/";
        }
        let message = divMessages[i].textContent.trimStart().trimEnd();
        messages += message;

    }

    console.log(messages);
    divMsg.parentNode.removeChild(divMsg);
    document.getElementById("button_quit").parentNode.removeChild(document.getElementById("button_quit"));
    let divConvo = document.getElementById("conversation");
    divConvo.innerHTML += `<div id="messages"></div>`;
    document.getElementById("logo_title").style.display = "initial";
    //displayLoadedConversation(messages);
    let JSONToSave = await send_crypted_message(messages, password, convName, userName);
    // JSONToSave = JSON.stringify(JSONToSave);
    //console.log("stringify:");
    //console.log(JSONToSave);
    JSONToSave = JSON.parse(JSONToSave);
    console.log("parse:");
    console.log(JSONToSave);
    /*
    for (let i in JSONToSave) {
        let arrayMessage = new Array;
        //console.log(i);
        let arrayKey = new Array;
        if (i == "key") {
            for (let j in JSONToSave[i]) {
                arrayKey.push(JSONToSave[i][j]);
            }
            JSONToSave[i] = arrayKey;
        }
        if (i == "messages") {
            for (let j in JSONToSave[i]) {
                arrayMessage.push(JSONToSave[i][j]);
            }
            JSONToSave[i] = arrayMessage;
            console.log(JSONToSave);
        }
        /* for (let j in JSONToSave[i].messages) {
             arrayMessage.push(JSONToSave[i].messages[j])
         }
         JSONToSave[i].messages = arrayMessage;
         console.log(JSONToSave[i].messages);
         */
    //        }

    let loadedMessages = await extract_from_JSON(JSONToSave, password);
    displayLoadedConversation(loadedMessages);
    return messages;
}

function displayLoadedConversation(messages) {
    let messagesToDisplay = messages.split("$£€");
    messagesToDisplay.forEach(message => {
        if (message.slice(0, 8) == "/receiv/") {
            //Afficher le message.slice(8) avec la classe receiver
            let divMsg = document.getElementById("messages");
            divMsg.innerHTML += `
             <div class="row message-body">
                 <div class="col-sm-12 message-main-receiver">
                     <div class="receiver">
                         <div class="message-text">
                                 ${message.slice(8)}
                                 </div>
                         </div>
                 </div>
             </div>
             `;
            //console.log(message.slice(8));
        }
        else if (message.slice(0, 8) == "/sender/") {
            //Afficher le message.slice(8) avec la classe sender
            //PAS OUF LE COPIE COLLE 
            let divMsg = document.getElementById("messages");
            divMsg.innerHTML += `
             <div class="row message-body">
                 <div class="col-sm-12 message-main-sender">
                     <div class="sender">
                         <div class="message-text">
                         ${message.slice(8)}
                         </div>
                     </div>
                 </div>
             </div>
             `;
            //console.log(message.slice(8));
        }
    });
};



function messageReceive(dataChannel) {
    dataChannel.addEventListener("message", event => {
        console.log("Message send by : " + event.currentTarget.label)
        console.log("Message received : " + event.data);
        console.log(event);
        let divMsg = document.getElementById("messages");
        divMsg.innerHTML += `
         <div class="row message-body">
             <div class="col-sm-12 message-main-receiver">
                 <div class="receiver">
                     <div class="message-text">
                             ${event.data}
                             </div>
                     </div>
             </div>
         </div>
         `;
        if (dataChannelList.length > 0) {
            for (let i = 0; i < dataChannelList.length; i++) {
                if (dataChannelList[i] != dataChannel) {
                    dataChannelList[i].send(event.data);
                }
            }
        }
    });
}
function displayMessageToSend(dataChannel, message) {
    if (dataChannel.readyState == "open") {
        let divMsg = document.getElementById("messages");
        divMsg.innerHTML += `
         <div class="row message-body">
             <div class="col-sm-12 message-main-sender">
                 <div class="sender">
                     <div class="message-text">
                     ${message}
                     </div>
                 </div>
             </div>
         </div>
         `;
    }
}
function sendMessage(dataChannel, message, senderName) {
    if (dataChannel.readyState === "open") {
        dataChannel.send(senderName + " : " + message);
    }
};
function displayOffer(senderName) {
    console.log("Sender name :" + senderName);
    let divModal = document.getElementById("modal");
    divModal.innerHTML += `<div id="offer" class="modal">
         <div class="modal-dialog">
             <div class="modal-content">
                 <div class="total">
                     <div class="modalContainer"> Hi ! Somebody want to connect &#x1F600; </div>
                     <div class="namename">  ${senderName} </div>
                 </div>
                 <button class="acceptButton" id=${changeWhiteSpacesIntoUnderscore(senderName)}><img src="/img/telephone.png" >Accept</button>
                 <button class="declineButton" id=${changeWhiteSpacesIntoUnderscore(senderName)}><img src="/img/decline.png" >Decline</button>
             </div >
             `;


    let divHeader = document.getElementById("friendName");
    document.getElementById("yourName").style.display = "none";

    divHeader.innerHTML += `<div class="col-sm-8 col-xs-7 heading-name" id="userName">
                <a class="heading-name-meta">${senderName}
                </a>
                <spa>Online</span>
            </div>
            <button class="btn btn-secondary pull-right" id="button_quit">Quitter la conversation</button>
            `;
};

function searchFriend() {
    let divModal = document.getElementById("modal");
    divModal.innerHTML += `<div id="search" class="modal">
        <div class="searchConv">
            <button type="button" class="element-head" aria-label="Close" id="button_quit_search">
                <span aria-hidden="true">&times;</span>
            </button>
            <input id="searchbar" onkeyup="search_friend()" type="text" name="search" placeholder="Search a friend..">
            <div id = "result_search_friends"> </br> john Doe <button>ajouter best friend </button>
            </br> Johnette Doe <button>ajouter best friend </button> </br>
            </div>
          </div>
        </div>`
};

function displayWaiting(senderName) {
    let divModal = document.getElementById("modal");
    divModal.innerHTML += `<div id="offer2" class="modal" >
             <div class="modal-dialog">
                 <div class="modal-content">
                     <button type="button" class="element-head" aria-label="Close" id="button_quit_waiting">
                         <span aria-hidden="true">&times;</span>
                     </button>
                     <header class="modalContainer"> Waiting for answer...</header>
                 </div >
                 `;


    let divHeader = document.getElementById("friendName");
    document.getElementById("yourName").style.display = "none";
    if (dataChannelList.length < 1) {
        divHeader.innerHTML += `<div class="col-sm-8 col-xs-7 heading-name" id="userName">
             <a class="heading-name-meta">${senderName}
             </a>
             <span>Online</span>
         </div>
         <button class="btn btn-secondary pull-right" id="button_quit">Quitter la conversation</button>
         `;

    };
};
function displayDecline() {
    let divModal = document.getElementById("modal");
    divModal.innerHTML += `<div id="offer1" class="modal">
                     <div class="modal-dialog">
                         <div class="modal-content">
                             <button type="button" class="element-head" aria-label="Close" id="button_quit_decline">
                                 <span aria-hidden="true">&times;</span>
                             </button>
                             <header class="modalContainer"> Offer declined, maybe he doesn't like you ...</header>
                         </div >
                         `;
};

function displayOldConv() {
    let divModal = document.getElementById("modal");
    divModal.innerHTML += `
                        <div class="oldConv" id="oldConvo">
                            <button type="button" class="element-head" aria-label="Close" id="button_quit_conv">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <div class="col-sm-6 ">
                                <div class="side-one">
                                    <div class="row heading" id="headingLeft">
                                        <h4 class="text-center">Mes conversations</h4>
                                    </div>
                                    <div class="row sideBar" id="conv">
                                    </div>
                                </div>
                            </div>
                        </div>`
};

function hideDecline() {
    const offer1 = document.getElementById("offer1");
    offer1.parentNode.removeChild(offer1);
};

function changeWhiteSpacesIntoUnderscore(word) {
    word = word.replace(/\s+/g, '_');
    return word;
}
function changeUnderscoreIntoWhiteSpaces(word) {
    word = word.replace('_', ' ');
    return word;
}



var cells = document.getElementById("cells");
socket.on("getUsers", users => {
    for (let i = 0; i < users.length; i++) {
        addUsers(users[i]);
    }
});

function addUsers(user) {
    userList.push(user);

    let id = userList.length;
    //Add to the list of user on the UI 
    let contactList = document.getElementById("friends");
    contactList.innerHTML += `
                         <div class="row sideBar-body" id="${user}">
                             <div class="col-sm-3 col-xs-3 sideBar-avatar">
                                 <div class="avatar-icon">
                                     <img src="img/man-2-512.png">
                                 </div>
                             </div>
                             <div class="col-sm-9 col-xs-9 sideBar-main">
                                 <div class="row">
                                     <div class="col-sm-8 col-xs-8 sideBar-name">
                                         <span class="name-meta">${user}
                                         </span>
                                         <button class="offerButton" id="${user}">Send an offer <img src="/img/offer.png"> </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         `;


};
function deleteUser(user) {
    for (let i = 0; i < userList.length; i++) {

        if (userList[i] == user) {

            userList.splice(i, 1);
        }
    }
    let userToDelete = document.getElementById(user);
    userToDelete.parentNode.removeChild(userToDelete);
};
function whatchForClosing(dataChannel, convName) {
    dataChannel.addEventListener("close", ev => {
        console.log(dataChannel.readyState);
        let divName = document.getElementById("userName");
        divName.parentNode.removeChild(divName);
        putUserName();
        deleteMessages(convName);
        //marche pas
        document.getElementsByClassName("offerButton").disabled = false;


    });

};

function closeDc(dataChannel) {
    let quitButton = document.getElementById("button_quit");
    quitButton.addEventListener("click", e => {
        if (dataChannelList.length > 0) {
            for (let i = 0; i < dataChannelList.length; i++) {
                dataChannelList[i].close();
                dataChannelList.splice(i, 1);
            }
        }
        else {
            dataChannel.close();
        }


    });

};

function parseData(response) {
    console.log("dans parse data");
    search_response = JSON.parse(response);
    console.log("search_response : ");
    console.log(search_response);
    let div = document.getElementById("response");
    div.parentNode.removeChild(div);
    document.getElementById("response").innerHTML = `</br>`;
    for (var i = 0; i < search_response.length; i++) {

        document.getElementById("response").innerHTML += (search_response[i].full_name)
        document.getElementById("response").innerHTML += `<button onclick="addThisFriend('${search_response[i].id}','${search_response[i].full_name}');">ajouter</button>`;
        document.getElementById("response").innerHTML += "</br>";

    };
};
async function addThisFriend(id, full_name) {
    let xhr = new XMLHttpRequest();
    console.log(full_name);
    let param = `friend_id_to_add=` + id + `&friend_full_name=` + full_name;
    xhr.open("POST", url + `/add_friend/?` + param, true);
    xhr.send()
    await delay(300)
    window.location.reload();
};
//search_friend place
//fonctions menu
function openNav() {
    document.getElementById("sideNavigation").style.width = "180px";
    document.getElementById("main").style.marginLeft = "180px";
}

function closeNav() {
    document.getElementById("sideNavigation").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}




socket.on("newUser", user => {
    addUsers(user);
    console.log("new user :" + user);
});
//handle user leaving 
socket.on("userLeave", user => {
    deleteUser(user);
    console.log(user);
});

socket.on("connectedUsers", usersAlreadyConnected => {
    for (let i = 0; i < usersAlreadyConnected.length; i++) {
        addUsers(usersAlreadyConnected[i]);
    }
});

//'''''''''''''''''''''''''''Caller side''''''''''''''''''''''''''''''''//

// callee accepted the offer 
socket.on("answer", async receiverName => {
    //création sdp et envoi de sdp puis de ICE
    //côté caller
    callee = receiverName;
    console.log("Connexion accepté de :" + receiverName);
    document.getElementById("offer2").parentNode.removeChild(document.getElementById("offer2"));


    //Creating the caller peer connection and his sdp

    pcCaller = new RTCPeerConnection();
    dataChannel = pcCaller.createDataChannel(receiverName);
    dataChannelList.push(dataChannel);


    pcCaller.addEventListener('connectionstatechange', event => {
        console.log("connection ?")
        if (pcCaller.connectionState === 'connected') {
            // Peers connected!
            //for (let i = 0; i < dataChannelList.length; i++)
            //messageReceive(dataChannelList[i]);
            messageReceive(dataChannel);
            console.log("GGWP peers connected!");
        }
    });


    whatchForClosing(dataChannel, callee);
    closeDc(dataChannel);




    var CallerSdp = await pcCaller.createOffer({ iceRestart: true });
    //Sending the caller sdp to the callee  
    socket.emit("request", { type: "sdpCaller", name: receiverName, sdp: CallerSdp, dc: dataChannel })
    //Setting the caller (his) local description
    await pcCaller.setLocalDescription(CallerSdp);
});

function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n)
    });
};

socket.on("decline", async ev => {
    document.getElementById("offer2").parentNode.removeChild(document.getElementById("offer2"));
    displayDecline();
    const quitDecline = document.getElementById("button_quit_decline");
    quitDecline.addEventListener("click", e => {
        hideDecline();
    });
    let div = document.getElementById("userName");
    div.parentNode.removeChild(div);
    let button_quit = document.getElementById("button_quit");
    button_quit.parentNode.removeChild(button_quit);
    putUserName();

});
// when callee send spd info
socket.on("calleeSdp", async calleeSdp => {
    //Caller set callee description
    const remoteDesc = new RTCSessionDescription(calleeSdp);
    console.log(pcCaller.iceGatheringState);
    await pcCaller.setRemoteDescription(remoteDesc);
    console.log("callee descripiton set");
    console.log(remoteDesc);

    //navigator.mediaDevices.getUserMedia({audio: true, video: true });
    //pcCaller.addStream(localStream);

    //Then 
    //Caller listen to his peerconnection for some icecandidate and when one is found the caller send it to the callee 

    console.log(pcCaller.iceGatheringState);



    pcCaller.addEventListener('icecandidate', event => {

        if (event.candidate != null) {
            console.log("ice candidate found");
            console.log(event.candidate);
            socket.emit("request", { type: 'iceCandidateToCallee', name: callee, candidate: event.candidate });
        }
    });

    dataChannel.addEventListener("open", ev => {
        const readyState = dataChannel.readyState;
        console.log("Send channel state is: " + readyState);
        sendMessage(dataChannel, "coucou bro 2", userName);
    });
    dataChannel.addEventListener("error", ev => {
        console.log(ev);
    });




    // Listen for connectionstatechange on the local RTCPeerConnection



});



socket.on('calleeIceCandidate', async calleeIceCandidate => {
    console.log(calleeIceCandidate);
    if (calleeIceCandidate) {
        //Try to add the caller ice candidate 
        try {
            await pcCaller.addIceCandidate(calleeIceCandidate);
            console.log("callee ice cadidate added");
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});


//-----------------------------Callee side----------------------------------//

// callee received an offer from the caller 
socket.on("offer", senderName => {
    console.log("Demande de connexion de:" + senderName);
    displayOffer(senderName);

});
socket.on("quitWaiting", e => {
    let offer = document.getElementById("offer");
    offer.parentNode.removeChild(offer);
    let button_quit = document.getElementById("button_quit");
    button_quit.parentNode.removeChild(button_quit);
    let div = document.getElementById("userName");
    div.parentNode.removeChild(div);
    putUserName();
});

//receiving a peerConnection offer from the caller (send by the signaling server)
socket.on("pcOffer", async (callerSdp, dc) => {
    //creating the callee peer connection
    console.log("entré dans pcoffer");
    pcCallee = new RTCPeerConnection();
    // dataChannel = dc;
    // console.log(dc);
    pcCallee.addEventListener("datachannel", ev => {
        dataChannel = ev.channel;

        console.log("datachannel ? : ");
        console.log(dataChannel);

        sendMessage(dataChannel, "coucou bro", userName);
        messageReceive(dataChannel);
        //functions for closing the dc
        whatchForClosing(dataChannel, caller);
        closeDc(dataChannel);


    }, false);
    //messageReceive(dataChannel);
    //Setting the caller sdp description
    await pcCallee.setRemoteDescription(callerSdp);
    console.log("caller description set:");
    console.log(callerSdp);
    pcCallee.addEventListener('icecandidate', event => {

        if (event.candidate != null) {
            console.log("ice candidate found");
            console.log(event.candidate);
            socket.emit("request", { type: 'iceCandidateToCaller', name: caller, candidate: event.candidate });
        }
    });
    //Creating the callee sdp answer 
    var calleeSdp = await pcCallee.createAnswer();
    pcCallee.setLocalDescription(calleeSdp);

    //Sending the callee sdp to the caller 
    socket.emit("request", { type: "sdpCallee", name: caller, sdp: calleeSdp })

});

//Signaling server emiting caller ice candidate 
socket.on('callerIceCandidate', async callerIceCandidate => {
    console.log(callerIceCandidate);
    if (callerIceCandidate) {
        //Try to add the caller ice candidate 
        try {
            await pcCallee.addIceCandidate(callerIceCandidate);
            console.log("caller ice cadidate added");
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }

    // searching for callee candidate 

});


/////////////////////////////////////////////////////////////////////////////////////////

socket.on("disconnection", senderName2 => {

});


const acceptButton = document.getElementsByClassName("acceptButton");
const declineButton = document.getElementsByClassName("acceptButton");
const searchButton = document.getElementById("buttonAdd");
const convButton = document.getElementById("buttonConv");


document.addEventListener('click', function (e) {
    if (e.target && e.target.className == 'offerButton') {
        //Caller sending his offer to the callee 
        socket.emit("request", { type: "offer", name: e.target.id });
        console.log(e.target.id);
        //display pop up
        displayWaiting(e.target.id);
        const quitwaiting = document.getElementById("button_quit_waiting");
        quitwaiting.addEventListener("click", event => {
            document.getElementById("offer2").parentNode.removeChild(document.getElementById("offer2"));
            document.getElementById("logo_title").style.display = "initial";
            let button_quit = document.getElementById("button_quit");
            button_quit.parentNode.removeChild(button_quit);
            socket.emit("request", { type: 'quitWaiting', name: e.target.id });
        });


        document.getElementById("logo_title").style.display = "none";
    }
    if (e.target && e.target.className == 'acceptButton') {
        document.getElementById("offer").parentNode.removeChild(document.getElementById("offer"))
        //callee accepted the offer and sending back his answer to the caller 
        socket.emit("request", { type: "answer", name: changeUnderscoreIntoWhiteSpaces(e.target.id) });
        console.log(changeUnderscoreIntoWhiteSpaces(e.target.id));
        caller = changeUnderscoreIntoWhiteSpaces(e.target.id);
        document.getElementById("logo_title").style.display = "none";
        //marche pas 
        document.getElementsByClassName("offerButton").disabled = true;



    };
    //handle decline offer
    if (e.target && e.target.className == 'declineButton') {
        document.getElementById("offer").parentNode.removeChild(document.getElementById("offer"));
        socket.emit("request", { type: "decline", name: changeUnderscoreIntoWhiteSpaces(e.target.id) });
        let button_quit = document.getElementById("button_quit");
        button_quit.parentNode.removeChild(button_quit);
        let div = document.getElementById("userName");
        div.parentNode.removeChild(div);
        putUserName();


    };

});

searchButton.addEventListener("click", e => {
    searchFriend();
    const quitDecline = document.getElementById("button_quit_search");
    quitDecline.addEventListener("click", e => {
        let search = document.getElementById("search");
        search.parentNode.removeChild(search);
    });
});

convButton.addEventListener("click", e => {
    displayOldConv();
    const quitConv = document.getElementById("button_quit_conv");
    quitConv.addEventListener("click", e => {
        let conv = document.getElementById("oldConvo");
        conv.parentNode.removeChild(conv);
    });
});


//closing the app
/*
window.addEventListener('unload', e => {
    socket.emit("deconnect");
});
*/


