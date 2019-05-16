/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var Controller = require('../handler/controller.js');

const MONGO_URI = process.env.MONGO_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  var issueController = new Controller();
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
     
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let issueData = req.body;
      //console.log('params: ' + JSON.stringify(req.query.issue_title));
      console.log('params: ' + JSON.stringify(req.body));

      let submitIssue = issueController.sendIssue(issueData);
      console.log('submitted issue: ' + JSON.stringify(submitIssue));
      /*MongoClient.connect(MONGO_URI, (err, db) => {
        if(err) {
          console.log('Database error: ' + err);
        }
        else {
          console.log('Successful database connection!');
          db.collection(project).insertOne(issueData, (err, res) => {
            if (err) { console.log(err); }
            console.log("1 issue inserted");
            db.close();
          });
        }
      });*/
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
