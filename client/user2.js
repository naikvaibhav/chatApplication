const socket = io("http://localhost:3000");
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6ImFkSTZ1MjlkIiwiaWF0IjoxNTgzMzIzOTM0NTYyLCJleHAiOjE1ODMzMjc1MzQsInN1YiI6ImF1dGhUb2tlbiIsImlzcyI6InZhaWJoYXYiLCJkYXRhIjp7Im1vYmlsZU51bWJlciI6OTQ4Mjc4NTcyMCwiZW1haWwiOiJuYWlrdmFpYmhhdjE5OTRAZ21haWwuY29tIiwibGFzdE5hbWUiOiJOYWlrIiwiZmlyc3ROYW1lIjoiVmFpYmhhdiIsInVzZXJJZCI6ImMwV0hZVnIyIn19.Np8csGLDYnf3nNkuGmKurRQitQxi63gi_tZIxTTqk94";
const userId = "c0WHYVr2";

let chatMessage = {
  createdOn: Date.now(),
  receiverId: "-qYQv8aD",
  receiverName: "Vinayak Naik",
  senderId: userId,
  senderName: "Vaibhav Naik"
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
    socket.emit("typing", "Vaibhav naik");
  });

  socket.on("typing", data => {
    console.log(data + " is typing");
  });

  socket.emit("disconnect");
}; //end chatSocket function

chatSocket();
