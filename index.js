const express = require("express");
const app = express();

//include events module - core nodejs module
const events = require("events");

//create an instance of event emiiter
const eventEmiiter = new events.EventEmitter();

//event listener
//waiting for the event to happen
eventEmiiter.on("welcomeEmail", function(data) {
  console.log("Listener was called");
  console.log("code to send email will be written here");
  console.log(
    `supposed to send email to ${data.name} whose email is ${data.email}}`
  );
});

app.get("/signup", (req, res) => {
  //create a user
  //save it
  let user = { name: "Vaibhav", email: "naikvaibhav1994@gmail.com" };
  //send him the email using event
  setTimeout(() => {
    eventEmiiter.emit("welcomeEmail", user);
  }, 5000);

  //response
  console.log("sending response");
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
