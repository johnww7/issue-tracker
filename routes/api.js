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

//const MONGO_URI = process.env.MONGO_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const MONGO_URI = 'mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb';

var issueController = new Controller();

module.exports = function(app) {
  //const collection = db.collection(project);
  app
    .route("/api/issues/:project")
    .get(function(req, res, next) {
      let project = req.params.project;
      let queryData = req.query;
      console.log("Get: " + project);
      console.log('Query string: ' + JSON.stringify(queryData) + ' type: ' + typeof(queryData));

      try {
        MongoClient.connect(MONGO_URI, (err, db) => {
          if (err) {
            console.log("Database error: " + err);
          }

          console.log("Successful database connection!");
          let myFindPromise = () => {
            return new Promise((resolve, reject) => {
              let queryFields = issueController.queryIssues(queryData);
              db.collection(project).find(queryFields).toArray((err, res) => {
                if (err) {
                  reject(err);
                } else {
                  console.log("Find returns: " + res);
                  resolve(res);
                }
              });
            });
          };

          let findPromise = async () => {
            let promiseResult = await myFindPromise();
            return promiseResult;
          };
          //insertPromise().then(function(promResult) {
          findPromise().then(function(result) {
            db.close();
            return res.json(result);
          });
          db.close();
        });
      } catch (e) {
        console.log(e);
        //next(e);
      }
      //next();
    })

    .post(function(req, res, next) {
      let project = req.params.project;
      let issueData = req.body;
      //console.log('params: ' + JSON.stringify(req.query.issue_title));
      console.log("params: " + JSON.stringify(req.body));

      let submitIssue = issueController.sendIssue(issueData);
      console.log("submitted issue: " + JSON.stringify(submitIssue));

      if (Object.keys(submitIssue).length === 1) {
        res.json(submitIssue);
      } else {
        let issueInserted;
        try {
          MongoClient.connect(MONGO_URI, (err, db) => {
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
                    console.log("id: " + res.ops[0]._id);
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
              console.log("posted: " + JSON.stringify(postedIssue));
              //console.log('posted: ' + JSON.stringify(promResult));
              //res.json(promResult);
              res.json(postedIssue);
            });
          });
        } catch(e) {
          console.log(e);
          //next(e);
        }
      }
      next();
    })

    .put(function(req, res) {
      let project = req.params.project;
      let issueData = req.body;
      let idSearch = issueData._id;
      console.log("Put: " + project);
      console.log("put data: " + JSON.stringify(issueData));

      let result;
      try {
        MongoClient.connect(MONGO_URI, (err, db) => {
          if (err) {
            console.log("Database error: " + err);
          }

          console.log("Successful database connection!");
          let updateDataToSend = issueController.updateIssue(issueData);
          console.log("updateData type: " + typeof updateDataToSend);
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
                      console.log("Updated: " + JSON.stringify(data));
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
            console.log("returned data: " + resultUpdate);
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
        //next(e);
      }
    })

    .delete(function(req, res) {
      let project = req.params.project;
      let deleteIssue = req.body;
      let deleteResult;
      console.log("Delete: " + project);
      console.log(
        "Issue to delete: " +
          JSON.stringify(deleteIssue) +
          "type of id: " +
          typeof req.body._id
      );
      try {
        MongoClient.connect(MONGO_URI, (err, db) => {
          if (err) {
            console.log("Database error: " + err);
          }
          console.log("Successful database connection!");
          let myPromise = () => {
            return new Promise((resolve, reject) => {
              if (!ObjectId.isValid(req.body._id)) {
                resolve({ result: "_id error" });
              } else {
                // let deleteQuery = { _id: ObjectId(req.body._id) };
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
            console.log("deleted data: " + deleteResult);
            return deleteResult;
          };

          deletePromise().then(function(promResult) {
            db.close();
            let result;
            console.log(
              "delete result: " + JSON.stringify(promResult.deletedCount)
            );
            if (promResult.deletedCount == 1) {
              result = { success: "deleted " + deleteIssue._id };
            } else if (promResult.deletedCount == 0) {
              result = { failed: "could not delete " + deleteIssue._id };
            } else {
              result = promResult;
            }
            res.json(result);
          });

          db.close();
        });
      } catch (e) {
        console.log(e);
        //next(e);
      }
    });
};
