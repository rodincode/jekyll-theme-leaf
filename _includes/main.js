var config = {
    apiKey: "YOUR_API_KEY",
    authDomain: "Your_AuthDomain",
    databaseURL: "YOUR_DATABAE_URL",
    projectId: "comments-3edb1",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "1:105109435190:web:3bb2a0b68bdad58e3c7997"
};
firebase.initializeApp(config);
// Reference messages collection
var messagesRef = firebase.database().ref('peoplecomments');

$('#contactForm').submit(function(e) {
    e.preventDefault();
 
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: $('.fullname').val(),
 
        message: $('.message').val()
    });
 
    $('.success-message').show();
 
    $('#contactForm')[0].reset();
});
$('#contactForm').submit(function(e) {
    e.preventDefault();
 
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: $('.fullname').val(),
        message: $('.message').val()
    });
 
    $('.success-message').show();
 
    $('#contactForm')[0].reset();
});
    
