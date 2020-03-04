const express = require("express");
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig");

//middleware
const auth = require("./../middlewares/auth");

module.exports.setRouter = app => {
  let baseUrl = `${appConfig.apiVersion}/users`;

  // defining routes.

  // params: firstName, lastName, email, mobileNumber, password
  app.post(`${baseUrl}/signup`, userController.signUpFunction);

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
    */

  // params: email, password.
  app.post(`${baseUrl}/login`, userController.loginFunction);

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users api for getAllUSers.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All the users present in the DB",
            "status": 200,
            "data": [
                {
                    "_id": "5e5cf724a324d4111c0aa92e",
                    "__v": 0,
                    "createdOn": "2020-03-02T12:08:04.000Z",
                    "mobileNumber": 9482785720,
                    "email": "vinayaknaik1962@gmail.com",
                    "password": "$2b$10$VnVV47Wbe8K9fSyKO.Se/uAewJ5xRxat8bkcdKny1TDU6vYrf7vBW",
                    "lastName": "Naik",
                    "firstName": "Vinayak",
                    "userId": "-qYQv8aD"
                }
            ]

        }
    */

  // params:

  app.get(`${baseUrl}`, auth.isAuthorized, userController.getAllUsers);

  /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }
    */

  // auth token params: userId.
  app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);
};
