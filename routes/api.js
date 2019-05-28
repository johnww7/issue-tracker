/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var Controller = require('../handler/controller.js');

const MONGO_URI = process.env.MONGO_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
//const MONGO_URI = 'mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb';

module.exports = function (app) {
  var issueController = new Controller();
  
  MongoClient.connect(MONGO_URI, (err, db) => {
    if(err) {
      console.log('Database error: ' + err);
    }
    else {
      console.log('Successful database connection!');
      //const collection = db.collection(project);
      app.route('/api/issues/:project')      
        .get(function (req, res){
          let project = req.params.project;
          console.log('Get: ' + project);
        })
        
        .post(function (req, res){
          let project = req.params.project;
          let issueData = req.body;
          //console.log('params: ' + JSON.stringify(req.query.issue_title));
          console.log('params: ' + JSON.stringify(req.body));

          let submitIssue = issueController.sendIssue(issueData);
          console.log('submitted issue: ' + JSON.stringify(submitIssue));
          
          db.collection(project).insert(submitIssue, (err, res) => {
            if (err) { console.log(err); }
            console.log("1 issue inserted");
            //db.close();
          });
            
          
          //res.json(submitIssue);
        })
        
        .put(function (req, res){
          let project = req.params.project;
          console.log('Put: ' + project);
        })
        
        .delete(function (req, res){
          let project = req.params.project;
          console.log('Delete: ' + project);
        });
    }
  }); 
};
