const mongoose = require("mongoose");
const shortid = require("shortid");
const time = require("./../libs/timeLib");
const response = require("./../libs/responseLib");
const logger = require("./../libs/loggerLib");
const validateInput = require("../libs/paramsValidationLib");
const check = require("../libs/checkLib");
const passwordLib = require("../libs/passwordLib");
const tokenLib = require("./../libs/tokenLib");

/* Models */
const UserModel = mongoose.model("User");

// start user signup function

let signUpFunction = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (req.body.email) {
        if (!validateInput.Email(req.body.email)) {
          let apiResponse = response.generate(
            true,
            "Email id does not meet the requirement",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.password)) {
          let apiResponse = response.generate(
            true,
            "password parameter is missing",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Field missing during user creation",
          "userController:validateUserInput",
          1
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          null
        );
        reject(apiResponse);
      }
    });
  }; //end validUSerInput

  let createUser = () => {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ email: req.body.email.toLowerCase() }).exec(
        (err, retrievedUserDetails) => {
          if (err) {
            logger.error(err.message, "userController:createUser", 10);
            let apiResponse = response.generate(
              true,
              "Failed to Create User",
              500,
              null
            );
            reject(apiResponse);
          } else if (check.isEmpty(retrievedUserDetails)) {
            console.log(req.body);
            let newUser = new UserModel({
              userId: shortid.generate(),
              firstName: req.body.firstName,
              lastName: req.body.lastName || "",
              password: passwordLib.hashPassword(req.body.password),
              email: req.body.email.toLowerCase(),
              mobileNumber: req.body.mobileNumber,
              //   apiKey:
              //     req.params.apiKey ||
              //     req.query.apiKey ||
              //     req.body.apiKey ||
              //     req.header,
              createdOn: time.now()
            });
            newUser.save((err, newUser) => {
              if (err) {
                logger.error(err.message, "userController:createUser", 10);
                let apiResponse = response.generate(
                  true,
                  "Failed to create a new user",
                  500
                );
                reject(apiResponse);
              } else {
                newUser = newUser.toObject();
                resolve(newUser);
              }
            });
          } else {
            logger.error(
              "User cannot be created. User already present",
              "userController:createUser",
              4
            );
            let apiResponse = response.generate(
              true,
              "User with this email id already present",
              403,
              null
            );
            reject(apiResponse);
          }
        }
      );
    });
  }; //end createUser function

  validateUserInput(req, res)
    .then(createUser)
    .then(resolve => {
      delete resolve.password;
      let apiResponse = response.generate(false, "User  created", 200, resolve);
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
}; // end user signup function

// start of login function
let loginFunction = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (req.body.email) {
        if (!validateInput.Email(req.body.email)) {
          let apiResponse = response.generate(
            true,
            "Email id does not meet the requirement",
            400,
            null
          );
          reject(apiResponse);
        } else if (check.isEmpty(req.body.password)) {
          let apiResponse = response.generate(
            true,
            "password parameter is missing",
            400,
            null
          );
          reject(apiResponse);
        } else {
          resolve(req);
        }
      } else {
        logger.error(
          "Field missing during user login",
          "userController:validateUserInput",
          1
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          null
        );
        reject(apiResponse);
      }
    });
  }; //end validUserInput function

  let findUser = () => {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ email: req.body.email }).exec(
        (err, retrievedUserDetails) => {
          if (err) {
            logger.error(err.message, "userController:findUser", 10);
            let apiResponse = response.generate(
              true,
              "Failed to Find User",
              500,
              null
            );
            reject(apiResponse);
          } else {
            resolve(retrievedUserDetails);
          }
        }
      );
    });
  }; //end findUser function

  let comparePassword = userDetails => {
    return new Promise((resolve, reject) => {
      let passwordVerified = passwordLib.comparePassword(
        req.body.password,
        userDetails.password
      );
      if (!passwordVerified) {
        logger.error(
          "Password match failed",
          "userController:comparePassword",
          10
        );
        let apiResponse = response.generate(
          true,
          "Password did not match",
          400,
          null
        );
        reject(apiResponse);
      } else {
        userDetails = userDetails.toObject();
        delete userDetails.password;
        delete userDetails.createdOn;
        delete userDetails._id;
        delete userDetails.__v;
        resolve(userDetails);
      }
    });
  }; //end comparePassword function

  let generateToken = userDetails => {
    return new Promise((resolve, reject) => {
      tokenLib.generateToken(userDetails, (err, token) => {
        if (err) {
          logger.error(err.message, "userController:generateToken", 10);
          let apiResponse = response.generate(
            true,
            "Failed to generate the token",
            500,
            null
          );
          reject(apiResponse);
        } else {
          let tokenDetails = {
            token: token.token,
            userDetails: userDetails
          };
          resolve(tokenDetails);
        }
      });
    });
  }; //end generateToken function

  validateUserInput(req, res)
    .then(findUser)
    .then(comparePassword)
    .then(generateToken)
    .then(resolve => {
      let apiResponse = response.generate(false, "Login success", 200, resolve);
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

// end of the login function

let logout = (req, res) => {}; // end of the logout function.

module.exports = {
  signUpFunction: signUpFunction,
  loginFunction: loginFunction,
  logout: logout
}; // end exports
