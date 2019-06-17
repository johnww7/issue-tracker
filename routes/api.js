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

//const MONGO_URI = process.env.MONGO_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
 const MONGO_URI = "mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb";
 var issueController = new Controller();

module.exports = function (app) {
  
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

          if(Object.keys(submitIssue).length === 1 ) {
            res.json(submitIssue);
          }
          else{
            MongoClient.connect(MONGO_URI, (err, db) => {
              if(err) {
                console.log('Database error: ' + err);
              }
              else {
                console.log('Successful database connection!');
                db.collection(project).insertOne(submitIssue, (err, res) => {
                  if (err) { console.log(err); }
                  console.log("1 issue inserted");
                  db.close();
                });
              }
            });
            res.json(submitIssue);
          }
        })
        
        .put(function (req, res){
          let project = req.params.project;
          let issueData = req.body;
          console.log('Put: ' + project);
          console.log('put data: ' + JSON.stringify(issueData));

         // let updatedIssue = issueController.checkUpdatedIssue(issueData);
          //console.log('Body length: ' + Object.keys(issueData).length + ' _id: ' + issueData._id);
            let result;
            MongoClient.connect(MONGO_URI, (err, db) => {
            //res.json({result: 'successfully updated'});
            
              if(err) {
                console.log('Database error: ' + err);
              }
              else {
                console.log('Successful database connection!');
                db.collection(project).findOne({_id: issueData._id}, (err, res) =>{
                  if (err) {console.log(err);}
                  let updatedIssue = issueController.checkUpdatedIssue(res,issueData);
                  console.log('Results: ' + JSON.stringify(updatedIssue));
                  if(res._id === null) {
                    result = {result: 'could not update' + res._id};
                    //res.json({result: 'could not update' + res.id});
                    db.close();
                    //res.json({result: 'could not update' + res._id})
                  }
                  else if(Object.keys(updatedIssue).length == 1 && issueData._id !== undefined){
                    result = {update: 'no updated field sent'};
                    //res.json({result: 'no updated field sent'});
                    db.close();
                  }
                  else {
                    let updateCollection = updatedIssue;
                    console.log('Update info: ' + JSON.stringify(updateCollection));
                    db.collection(project).updateOne({_id: res._id}, updateCollection, (err, data) => {
                      if(err) {console.log(err);}
                      result = {result: 'successfully updated'};
                      //res.json({result: 'successfully updated'});
                      console.log("Updated: " + JSON.stringify(data));         
                      console.log('1 updated occured');
                      //res.json({result: 'successfully updated'});
                      db.close();
                    });
                    
                  }
                   
                  //db.close();
                });
                 
              }
              
            });
            console.log('Results of update: ' + result);
            res.json(result);  
          
        })
        
        .delete(function (req, res){
          let project = req.params.project;
          console.log('Delete: ' + project);
        });
    
   
};
