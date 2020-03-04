const socketio = require("socket.io");
const mongoose = require("mongoose");
const shortid = require("shortid");
const logger = require("./loggerLib");
const events = require("events");
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib");
const check = require("./checkLib");
const response = require("./responseLib");

let setServer = server => {
  let allOnlineUsers = [];
  let io = socketio.listen(server);

  let myIo = io.of("");
  //main event handler
  myIo.on("connection", socket => {
    console.log("on connection -- emitting verify user");

    socket.emit("verifyUser", "");

    //code to verify the user and make him online

    socket.on("set-user", authToken => {
      console.log("set-user called");
      tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
        if (err) {
          socket.emit("auth-error", {
            status: 500,
            error: "Please provide correct auth token"
          });
        } else {
          console.log("User is verified.. setting details");
          let currentUser = user.data;
          //setting socket userId
          socket.userId = currentUser.userId;
          let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
          console.log(`${fullName} is online`);
          //socket.emit(currentUser.userId, "You are online");

          let userObj = {
            userId: currentUser.userId,
            name: currentUser.firstName + " " + currentUser.lastName
          };
          allOnlineUsers.push(userObj);
          console.log(allOnlineUsers);

          //setting room name
          socket.room = "chat";
          //joining chat-group room
          socket.join(socket.room);
          socket
            .to(socket.room)
            .broadcast.emit("online-user-list", allOnlineUsers);
        }
      });
    }); //end listening setUser

    socket.on("chat-msg", data => {
      console.log("socket chat-msg called");
      console.log(data);
      io.emit(data.receiverId, data);
    });

    socket.on("typing", fullName => {
      socket.to(socket.room).broadcast.emit("typing", fullName);
    });

    socket.on("disconnect", () => {
      //disconect the user from the socket
      //remove the user from online list
      //unsubscribe the user from this own channel
      console.log("user is disconnected");
      console.log(socket.userId);
      let removeIndex = allOnlineUsers
        .map(user => {
          return user.userId;
        })
        .indexOf(socket.userId);
      console.log(removeIndex);
      allOnlineUsers.splice(removeIndex, 1);
      console.log(allOnlineUsers);

      //broadcast the updated ist of users after the disconnect event
      socket.join(socket.room);
      socket.to(socket.room).broadcast.emit("online-user-list", allOnlineUsers);
      //leave the room
      socket.leave(socket.room);
    }); //end disconnect event
  });
};

module.exports = {
  setServer: setServer
};
