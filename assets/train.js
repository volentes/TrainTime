// Initialize Firebase
var config = {
    apiKey: "AIzaSyDAU4Ld-cAm37_ZeG1ZMdtgiopPIUUSaqE",
    authDomain: "traintime-d756f.firebaseapp.com",
    databaseURL: "https://traintime-d756f.firebaseio.com",
    projectId: "traintime-d756f",
    storageBucket: "traintime-d756f.appspot.com",
    messagingSenderId: "813015234759"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

//Event handler for adding trains to schedule

$("#submit-btn").on("click", function(event){
  event.preventDefault();
//Grabs user input
  var trainName = $("#name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var startTime = $("#time-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

// Creating object to push to Firebase
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      time: startTime,
      frequency: frequency
    };

// Pushes user input to firebase
    database.ref().push(newTrain);

    //Clears the input fields
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");

});

  // Firebase event for:
  // Adding new Train to database and row in DOM when user enters new train
  // Performing calculations

   database.ref().on("child_added", function(childSnapshot, prevChildkey) {
     var trainName = childSnapshot.val().name;
     var trainDestination = childSnapshot.val().destination;

//Calculating Next Arrival Time and Minutes Until Train

    // Gets frequency from database
    var frequency = childSnapshot.val().frequency;

    // Gets start time from database
    var startTime = childSnapshot.val().time;

    // Gets initial time
    var firstTimeConverted = moment(startTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Getting the difference between start time and current time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    // Next Train Arrival
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

// Displays variables in DOM
    $("#train-table").append('<tr><td>' + trainName + '</td>'
    		       + '<td>' + trainDestination + '</td>'
    		       + '<td>' + frequency + '</td>'
    		       + '<td>' + nextTrain + '</td>'
               + '<td>' + tMinutesTillTrain + '</td></tr>');
});
