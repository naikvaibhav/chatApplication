const socket = io("http://localhost:3000");
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Im5aaC1BWGJPIiwiaWF0IjoxNTgzMzIzODg2OTg1LCJleHAiOjE1ODMzMjc0ODYsInN1YiI6ImF1dGhUb2tlbiIsImlzcyI6InZhaWJoYXYiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6OTQ4Mjc4NTcyMCwiZW1haWwiOiJ2aW5heWFrbmFpazE5NjJAZ21haWwuY29tIiwibGFzdE5hbWUiOiJOYWlrIiwiZmlyc3ROYW1lIjoiVmluYXlhayIsInVzZXJJZCI6Ii1xWVF2OGFEIn19.Urvtokg0uqOa7mBzi34Do3nAeNhYwIfsF8mlhHBpG8E";
const userId = "-qYQv8aD";

let chatMessage = {
  createdOn: Date.now(),
  receiverId: "c0WHYVr2",
  receiverName: "Vaibhav Naik",
  senderId: userId,
  senderName: "Vinayak Naik"
};

let chatSocket = () => {
  socket.on("verifyUser", data => {
    console.log("socket trying to verify user");
    socket.emit("set-user", authToken);
  });

  socket.on(userId, data => {
    console.log("You received a message from " + data.senderName);
    console.log(data);
  });

  socket.on("online-user-list", data => {
    console.log(
      "Online user list is updated, some user can me online or offline"
    );
    console.log(data);
  });

  $("#send").on("click", () => {
    let messageText = $("#messageToSend").val();
    chatMessage.message = messageText;
    socket.emit("chat-msg", chatMessage);
  });

  $("#messageToSend").on("keypress", () => {
    socket.emit("typing", "Vinayak naik");
  });

  socket.on("typing", data => {
    console.log(data + " is typing");
  });

  // socket.emit("chat-msg", chatMessage);

  socket.emit("disconnect");
}; //end chatSocket function

chatSocket();
