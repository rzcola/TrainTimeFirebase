$(document).ready(function(){
    // Initialize Firebase
 var config = {
   apiKey: "AIzaSyAYCYLUsB6Nzz1qUjVSxVg8CTyYKsfcU5Y",
   authDomain: "traintime-745d2.firebaseapp.com",
   databaseURL: "https://traintime-745d2.firebaseio.com",
   projectId: "traintime-745d2",
   storageBucket: "traintime-745d2.appspot.com",
   messagingSenderId: "174495384904"
 };

 firebase.initializeApp(config);

   // A variable to reference the database.
   var database = firebase.database();

   // Variables for the on .Click event
   var name;
   var firstTrain;
   var destination;
   var frequency = 0;
   //   On click function and event.preventDefault so that the page doesn't refresh
   $("#add-train").on("click", function() {
       event.preventDefault();
       // Tracking and Recording data info as it comes in and out 
       name = $("#train-name").val().trim();
       firstTrain = $("#first-train").val().trim();
       destination = $("#destination").val().trim();
       frequency = $("#frequency").val().trim();

       // Push function....into firebase data
       database.ref().push({
           name: name,
           destination: destination,
           firstTrain: firstTrain,
           frequency: frequency,
           dateAdded: firebase.database.ServerValue.TIMESTAMP
       });
       $("form")[0].reset();
   });
// Firebase snapshot .on("child_added"
   database.ref().on("child_added", function(childSnapshot) {
       var newArry;
       var minAway;
       var nextTrain = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
       // Time difference between the current and previous train
       var timeDifferance = moment().diff(moment(nextTrain), "minutes");
       var remainder = timeDifferance % childSnapshot.val().frequency;
       // Time in (Min) for next train arrival
       var minAway = childSnapshot.val().frequency - remainder;
       var nextTrain = moment().add(minAway, "minutes");
       nextTrain = moment(nextTrain).format("hh:mm");

       // user inputs data and submits it appends the previous inputs 
       $("#add-row").append("<tr><td>" + childSnapshot.val().name +
               "</td><td>" + childSnapshot.val().destination +
               "</td><td>" + childSnapshot.val().frequency +
               "</td><td>" + nextTrain + 
               "</td><td>" + minAway + "</td></tr>");

           // handles the errors 
       }, function(errorObject) {
           console.log("Errors handled: " + errorObject.code);
   });

   database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
       // Change the HTML to reflect
       $("#train-name-display").html(snapshot.val().name);
       $("#destination-display").html(snapshot.val().email);
       $("#first-train-display").html(snapshot.val().age);
       $("#frequency").html(snapshot.val().comment);
   });
});
