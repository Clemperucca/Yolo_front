var socket = io();
var userName = "patoche " + Math.random();

socket.emit("request", msg = { type: "login", name: userName });

//get_users


//TO DO  disable button make an offer durong a convo by using element.disabled 
/*
var firstName = ...
var lastName = ...
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

function deleteMessages() {
    //remove messages and hide the quit button 
    let divMsg = document.getElementById("messages");
    divMsg.parentNode.removeChild(divMsg);
    document.getElementById("button_quit").style.display = "none";
    let divConvo = document.getElementById("conversation");
    divConvo.innerHTML += `<div id="messages"></div>`;
    document.getElementById("logo_title").style.display = "initial";
}

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
            <div class= "namename">  ${senderName} </div>
            </div>
            <button class="acceptButton" id=${changeWhiteSpacesIntoUnderscore(senderName)}><img src="/img/telephone.png" >Accept</button>   
            <button class="declineButton" id=${changeWhiteSpacesIntoUnderscore(senderName)}><img src="/img/decline.png" >Decline</button>   
          </div >
        `;


    let divHeader = document.getElementById("friendName");
    document.getElementById("yourName").style.display = "none";
    divHeader.innerHTML += `<div class="col-sm-8 col-xs-7 heading-name" id ="userName">
            <a class="heading-name-meta">${senderName}
            </a>
            <spa>Online</span>
          </div>
          <button class="btn btn-secondary pull-right"id="button_quit">Quitter la conversation</button>
          `;

};

function searchFriend() {
    let divModal = document.getElementById("modal");
    divModal.innerHTML += `<div id="offer" class="modal">
        <div class="modal-dialog">
            <div class="modal-content" id = "search">
                <input id="searchbar" onkeyup="search_friend()" type="text" name="search" placeholder="Search a friend..">
            </div>
        </div>`
}

function displayWaiting() {
    let divModal = document.getElementById("modal");
    divModal.innerHTML += `<div id="offer" class="modal" >
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <header class="modalContainer"> Waiting for answer...</header>
                        </div >
                        `;
};
function displayDecline() {
    let divModal = document.getElementById("modal");
    divModal.innerHTML += `<div id="offer" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <button type="button" class="element-head" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <header class="modalContainer"> Offer declined, maybe he doesn't like you ...</header>
            </div >
            `;
};

function hideDecline() {
    document.getElementById("offer").style.display = "none";
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
function whatchForClosing(dataChannel) {
    dataChannel.addEventListener("close", ev => {
        console.log(dataChannel.readyState);
        let divName = document.getElementById("userName");
        divName.style.display = "none";
        putUserName();
        deleteMessages();
    });

};

function closeDc(dataChannel) {
    let quitButton = document.getElementById("button_quit");
    quitButton.addEventListener("click", e => {
        dataChannel.close();
        deleteMessages();
        let div = document.getElementById("userName");
        div.style.display = "none";
        putUserName();

    });

};

function parseData(response) {
    console.log("dans parse data");
    search_response = JSON.parse(response);
    console.log("search_response : ");
    console.log(search_response);

    document.getElementById("response").innerHTML = `</br>`;
    for (var i = 0; i < search_response.length; i++) {
        document.getElementById("response").innerHTML += `<button onclick="addThisFriend('${search_response[i].id}','${search_response[i].full_name}');">ajouter</button>`;
        document.getElementById("response").innerHTML += (search_response[i].full_name)
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
function search() {
    const val = document.querySelector('input').value;
    console.log(val);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url + `/get_users/` + val, false);
    xhr.onload = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.statusText);
                parseData(xhr.responseText);
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = () => {
        console.error(xhr.statusText);
    };
    xhr.send(null);
};
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
    console.log("entré dans answer");
    callee = receiverName;
    console.log("Connexion accepté de :" + receiverName);
    document.getElementById("offer").style.display = "none";


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


    whatchForClosing(dataChannel);
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
    document.getElementById("offer").style.display = "none";
    displayDecline();

    //await delay(1000);
    console.log("delay");
    setTimeout(hideDecline, 1000);


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
        whatchForClosing(dataChannel);
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
document.addEventListener('click', function (e) {
    if (e.target && e.target.className == 'offerButton') {
        //Caller sending his offer to the callee 
        socket.emit("request", { type: "offer", name: e.target.id });
        console.log(e.target.id);
        //display pop up
        displayWaiting();
        let divHeader = document.getElementById("friendName");
        document.getElementById("yourName").style.display = "none";
        divHeader.innerHTML += `<div class="col-sm-8 col-xs-7 heading-name" id="userName">
                                    <a class="heading-name-meta">${e.target.id}
                                    </a>
                                    <span>Online</span>
                                </div>
                                <button class="btn btn-secondary pull-right" id="button_quit">Quitter la conversation</button>
                                `;
        document.getElementById("logo_title").style.display = "none";
    }
    if (e.target && e.target.className == 'acceptButton') {
        console.log(e.target);
        document.getElementById("offer").style.display = "none";
        //callee accepted the offer and sending back his answer to the caller 
        socket.emit("request", { type: "answer", name: changeUnderscoreIntoWhiteSpaces(e.target.id) });
        console.log(changeUnderscoreIntoWhiteSpaces(e.target.id));
        caller = changeUnderscoreIntoWhiteSpaces(e.target.id);
        document.getElementById("logo_title").style.display = "none";



    };
    //handle decline offer
    if (e.target && e.target.className == 'declineButton') {
        document.getElementById("offer").style.display = "none";
        socket.emit("request", { type: "decline", name: changeUnderscoreIntoWhiteSpaces(e.target.id) });
        document.getElementById("button_quit").style.display = "none";
        let div = document.getElementById("userName")
        div.style.display = "none";
        putUserName();


    };

});

searchButton.addEventListener("click", e => {
    searchFriend();
})

//closing the app
window.addEventListener('beforeunload', e => {
    socket.emit("disconnect");
});


