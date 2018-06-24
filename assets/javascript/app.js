// Initialize Firebase
var config = {
    apiKey: "AIzaSyDr6UCfD6iSnWnFMIDERfROnPrCM4CfLK0",
    authDomain: "train-scheduler-a5763.firebaseapp.com",
    databaseURL: "https://train-scheduler-a5763.firebaseio.com",
    projectId: "train-scheduler-a5763",
    storageBucket: "",
    messagingSenderId: "325097214614"
};
firebase.initializeApp(config);

var database = firebase.database();
var thisTime = moment();

//FUNCTION THAT WILL RUN BELOW TO CLEAR INPUT 
function clearInput() {
    $("#input-name").val("");
    $("#input-dest").val("");
    $("#input-time").val("");
    $("#input-min").val("");
}

//ON CLICK TO GRAB USER INPUT
$("#input-submit").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#input-name").val().trim();
    var trainDest = $("#input-dest").val().trim();
    var trainTime = moment($("#input-time").val().trim(), "h:mm A").format("HH:mm");
    var trainFreq = $("#input-min").val().trim();

    var newTrain = {
        name: trainName,
        destination: trainDest,
        time: trainTime,
        freq: trainFreq,
        currentTime: thisTime
    }

    database.ref().child("trains").push(newTrain);
    clearInput()
})

database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFreq = childSnapshot.val().freq;

    $("#train-info > tbody").append(`<tr><td> ${trainName} </td><td> ${trainDest} </td><td> 
        ${trainFreq} </td><td> ${trainFreq} </td><td> Hello </td></tr>`);

})

function minutesAway() {
    database.ref().once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            thisTime = moment().format('X');
            database.ref("trains/" + childSnapshot.key).update({
                currentTime: thisTime,
            })
        })
    });
};

setInterval(minutesAway, 10000);