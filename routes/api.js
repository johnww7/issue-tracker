/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
var Controller = require("../handler/controller.js");

const MONGO_URI = process.env.MONGO_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
/*const MONGO_URI =
  "mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb";*/

var issueController = new Controller();

module.exports = function(app) {
  app
    .route("/api/issues/:project")
    .get(function(req, res, next) {
      let project = req.params.project;
      let queryData = req.query;

      try {
        MongoClient.connect(process.env.MONGO_URI, (err, db) => {
          if (err) {
            console.log("Database error: " + err);
          }

          console.log("Successful database connection!");
          let myFindPromise = () => {
            return new Promise((resolve, reject) => {
              let queryFields = issueController.queryIssues(queryData);
              db.collection(project)
                .find(queryFields)
                .toArray((err, res) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(res);
                  }
                });
            });
          };

          let findPromise = async () => {
            let promiseResult = await myFindPromise();
            return promiseResult;
          };

          findPromise().then(function(result) {
            db.close();
            return res.json(result);
          });
        });
      } catch (e) {
        console.log(e);
      }
    })

    .post(function(req, res, next) {
      let project = req.params.project;
      let issueData = req.body;

      let submitIssue = issueController.sendIssue(issueData);

      let issueInserted;
      try {
        MongoClient.connect(process.env.MONGO_URI, (err, db) => {
          if (err) {
            console.log("Database error: " + err);
          }
          console.log("Successful database connection!");
          let myPromise = () => {
            return new Promise((resolve, reject) => {
              db.collection(project).insertOne(submitIssue, (err, res) => {
                if (err) {
                  reject(err);
                } else {
                  console.log("1 issue inserted");
                  issueInserted = res.ops[0]._id;
                  resolve(issueInserted);
                }
              });
            });
          };
          let insertPromise = async () => {
            let result = await myPromise();
            return result;
          };

          insertPromise().then(function(promResult) {
            db.close();
            let postedIssue = Object.assign(
              {},
              { _id: promResult },
              submitIssue
            );
            res.json(postedIssue);
          });
        });
      } catch (e) {
        console.log(e);
      }
    })

    .put(function(req, res) {
      let project = req.params.project;
      let issueData = req.body;
      let idSearch = issueData._id;

      let result;
      try {
        MongoClient.connect(process.env.MONGO_URI, (err, db) => {
          if (err) {
            console.log("Database error: " + err);
          }

          console.log("Successful database connection!");
          let updateDataToSend = issueController.updateIssue(issueData);
          let myPromise = () => {
            return new Promise((resolve, reject) => {
              if (updateDataToSend.fail === "no fields") {
                resolve({ matchedCount: 1, modifiedCount: 0 });
              } else if (!ObjectId.isValid(req.body._id)) {
                resolve({ matchedCount: 0, modifiedCount: 0 });
              } else {
                db.collection(project).updateOne(
                  { _id: ObjectId(req.body._id) },
                  { $set: updateDataToSend },
                  (err, data) => {
                    if (err) {
                      reject(err);
                    } else {
                      console.log("1 updated occured");
                      resolve(data);
                    }
                  }
                );
              }
            });
          };

          let updatePromise = async () => {
            let resultUpdate = await myPromise();
            return resultUpdate;
          };

          updatePromise().then(function(promResult) {
            db.close();
            console.log(
              "update result: " +
                promResult.matchedCount +
                " modified: " +
                promResult.modifiedCount
            );
            let updateResult;
            if (promResult.matchedCount == 1 && promResult.modifiedCount == 1) {
              updateResult = { result: "successfully updated" };
            } else if (
              promResult.matchedCount == 1 &&
              promResult.modifiedCount == 0
            ) {
              updateResult = { result: "no updated field sent" };
            } else {
              updateResult = { result: "could not update " + issueData._id };
            }

            res.json(updateResult);
          });
        });
      } catch (e) {
        console.log(e);
      }
    })

    .delete(function(req, res) {
      let project = req.params.project;
      let deleteIssue = req.body;
      let deleteResult;

      try {
        MongoClient.connect(process.env.MONGO_URI, (err, db) => {
          if (err) {
            console.log("Database error: " + err);
          }
          console.log("Successful database connection!");
          let myPromise = () => {
            return new Promise((resolve, reject) => {
              if (!ObjectId.isValid(req.body._id)) {
                resolve({ result: "_id error" });
              } else {
                db.collection(project).deleteOne(
                  { _id: ObjectId(req.body._id) },
                  function(err, resObj) {
                    if (err) {
                      console.log(err);
                    } else {
                      resolve(resObj);
                    }
                  }
                );
              }
            });
          };
          let deletePromise = async () => {
            let deleteResult = await myPromise();
            return deleteResult;
          };

          deletePromise().then(function(promResult) {
            db.close();
            let result;

            if (promResult.deletedCount == 1) {
              result = { success: "deleted " + deleteIssue._id };
            } else if (promResult.deletedCount == 0) {
              result = { failed: "could not delete " + deleteIssue._id };
            } else {
              result = promResult;
            }
            res.json(result);
          });
        });
      } catch (e) {
        console.log(e);
      }
    });
};
