
var socket = io();
var messages = document.getElementById("messages");


(function() {
  $("form").submit(function(e) {
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading
    //emit msg to the server
    socket.emit("chat message", {message: $("#message").val(), sender: $("div #userName").text()});

    messages.appendChild(li).append($("#message").val());
    let span = document.createElement("span");
    messages.appendChild(span).append(`From ${$("div #userName").text()}`);

    $("#message").val("");


    return false;
  });
  socket.on("welcome", data => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data);
    scrollToBottom();
  }); 

  socket.on("chat message", data => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append(`From ${data.sender}`);
    scrollToBottom();
   
  }); 

  


})();

// fetching initial chat messages from the database
(function() {
  fetch("/chats")
    .then(response => {
      return response.json();
    })
    .then(data => {
      data.map(data => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);
        messages
          .appendChild(span)
          .append("From " + data.sender + ": " + formatTimeAgo(data.createdAt));
        scrollToBottom();
      });
    });
})();

 function scrollToBottom(){
        $(".messages").animate({ scrollTop: $(document).height()+$(window).height() },500);
    }
