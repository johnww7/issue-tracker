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
            let issueInserted;
            MongoClient.connect(MONGO_URI, (err, db) => {
              if(err) {
                console.log('Database error: ' + err);
              }
              else {
                console.log('Successful database connection!');
                db.collection(project).insertOne(submitIssue, (err, res) => {
                  if (err) { console.log(err); }
                  console.log("1 issue inserted");
                  issueInserted = JSON.stringify(res.ops[0]._id);
                  console.log('id: ' + issueInserted);
                 // res.send(issueInserted);
                  //db.close();
                });
              }
            });
            //let postedIssue = {_id: issueInserted, ... submitIssue}
            let postedIssue = Object.assign({}, issueInserted, submitIssue);
            console.log('posted: ' + JSON.stringify(postedIssue));
            res.json(postedIssue);
          }
        })
        
        .put(function (req, res) {
          let project = req.params.project;
          let issueData = req.body;
          console.log('Put: ' + project);
          console.log('put data: ' + JSON.stringify(issueData));

            let result;
            MongoClient.connect(MONGO_URI, (err, db) => {
              if(err) {
                console.log('Database error: ' + err);
              }
              else {
                console.log('Successful database connection!');
                db.collection(project).findOne({_id: issueData._id}, (err, res) =>{
                  if (err) {console.log(err);}
                  console.log('Results of findOne: ' + JSON.stringify(res));
                  let updatedIssue = issueController.checkUpdatedIssue(res,issueData);
                  console.log('Results: ' + JSON.stringify(updatedIssue));
                  
                  if(updatedIssue.result === 'could not update') {
                    let noUpdateReturn = updatedIssue.result + ' ' + issueData._id;
                    console.log('no update: ' + noUpdateReturn)
                    result = {result: noUpdateReturn};
                    //res.json({result: 'could not update' + res.id});
                    db.close();
                    //res.json({result: 'could not update' + res._id})
                  }
                  else if(Object.keys(updatedIssue).length == 1 && issueData._id !== undefined){
                    console.log('no updated field');
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
          let deleteIssue = req.body;
          let deleteResult;
          console.log('Delete: ' + project);
          console.log('Issue to delete: ' + JSON.stringify(deleteIssue));

          
          if(deleteIssue._id === '' || deleteIssue._id === null) {
            res.json({result: '_id error'});
          }
          else {
            MongoClient.connect(MONGO_URI, (err, db) => {
              if(err) {
                console.log('Database error: ' + err);
              }
              console.log('Successful database connection!');
              let deleteQuery = {_id: ObjectId(deleteIssue._id)};
              db.collection(project).deleteOne(deleteIssue._id, function(err,resObj) {
                if(err) { console.log(err); }

                if (resObj.deletedCount == 1 || resObj.deletedCount === '1'){
                  console.log('deleted ' + deleteIssue._id);
                  deleteResult = 1;
                 //deleteResult = {success: 'deleted ' + deleteIssue._id};
                  
                }
                else {
                  console.log('could not delete ' + deleteIssue._id);
                  deleteResult = 0;
                  //deleteResult = {failed: 'could not delete ' + deleteIssue._id};
                  
                }
                db.close();
              });
            });
            //res.json({succes: 'success deleted'});
            if(deleteResult = 1){
              let success = 'deleted ' + deleteIssue._id;
              res.json({success});
              
            }
            else {
              let failed = 'could not delete ' + deleteIssue._id;
              res.json({failed});
            }
            
          }

        });
    
   
};
