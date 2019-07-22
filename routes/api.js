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
            try {
              MongoClient.connect(MONGO_URI, (err, db) => {
                if(err) {
                  console.log('Database error: ' + err);
                }
                console.log('Successful database connection!');
                let myPromise = () => {
                  return new Promise((resolve, reject) => {
                    db.collection(project).insertOne(submitIssue, (err, res) => {
                      if (err) { 
                        reject(err); 
                      }
                      else {
                        console.log("1 issue inserted");
                        issueInserted = res.ops[0]._id;
                        console.log('id: ' + res.ops[0]._id);
                        resolve(issueInserted);
                      }
                    });
                  });
                };
                let insertPromise = async() => { 
                  let result = await (myPromise());
                  return result;
                
                };
                
                insertPromise().then(function(promResult) {
                  db.close();
                  let postedIssue = Object.assign({}, {_id: promResult}, submitIssue);
                  console.log('posted: ' + JSON.stringify(postedIssue));
                  //console.log('posted: ' + JSON.stringify(promResult));
                  //res.json(promResult);
                  res.json(postedIssue);
                });
                
                  
              });
            } catch(e) {
              next(e)
            }
            
          }
        })
        
        .put(function (req, res) {
          let project = req.params.project;
          let issueData = req.body;
          let idSearch = issueData._id;
          console.log('Put: ' + project);
          console.log('put data: ' + JSON.stringify(issueData));

          let result;
          try {
            MongoClient.connect(MONGO_URI, (err, db) => {
              if(err) {
                console.log('Database error: ' + err);
              }
              
              console.log('Successful database connection!');
              let updateDataToSend = issueController.updateIssue(issueData);
              console.log('updateData type: ' + typeof(updateDataToSend));
              let myPromise = () => {
                return new Promise((resolve, reject) => {
                  if(updateDataToSend.fail === 'no fields'){
                    resolve({matchedCount: 1, modifiedCount: 0})
                  }
                  else {
                    db.collection(project).updateOne({"_id": ObjectId(req.body._id)}, {$set: updateDataToSend}, (err, data) => {
                      if(err) {
                        reject(err);
                      }
                      else {
                      //result = {result: 'successfully updated'};
                      //res.json({result: 'successfully updated'});
                      console.log("Updated: " + JSON.stringify(data));         
                      console.log('1 updated occured');
                      //res.json({result: 'successfully updated'});
                      //db.close();
                        
                        resolve(data);
                      }
                    });
                  }
                });
              };

              let updatePromise = async() => { 
                let resultUpdate = await (myPromise());
                console.log('returned data: ' + resultUpdate);
                return resultUpdate;
              };
              
              updatePromise().then(function(promResult) {
                db.close();
                console.log('update result: ' + promResult.matchedCount + ' modified: ' + promResult.modifiedCount);
                let updateResult;
                if(promResult.matchedCount == 1 && promResult.modifiedCount == 1){
                  updateResult = {result: 'successfully updated'};
                }
                else if(promResult.matchedCount == 1 && promResult.modifiedCount == 0) {
                  updateResult = {result: 'no updated field sent'};
                }
                else {
                  updateResult = {result: 'could not update ' + issueData._id};
                }
                //let postedIssue = Object.assign({}, {_id: promResult}, submitIssue);
                //console.log('posted: ' + JSON.stringify(postedIssue));
                //console.log('posted: ' + JSON.stringify(promResult));
                //res.json(promResult);
                res.json(updateResult);
              });                
            });
          }
          catch (e) {
            next(e);
          }
           
             
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

