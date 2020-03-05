const socket = io("http://localhost:3000");
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ik1sMTJGS2pTIiwiaWF0IjoxNTgzMzg4NTQzMDg5LCJleHAiOjE1ODMzOTIxNDMsInN1YiI6ImF1dGhUb2tlbiIsImlzcyI6InZhaWJoYXYiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6OTQ4Mjc4NTcyMCwiZW1haWwiOiJ2aW5heWFrbmFpazE5NjJAZ21haWwuY29tIiwibGFzdE5hbWUiOiJOYWlrIiwiZmlyc3ROYW1lIjoiVmluYXlhayIsInVzZXJJZCI6Ii1xWVF2OGFEIn19.aSG1TFbNM52rGDIRkevGzEb2dwEs1c-OzPc9b6btoU4";
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
    console.log(messageText);
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
