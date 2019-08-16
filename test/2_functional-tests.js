/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
     
      test('Every field filled in', function(done) {
        //this.timeout(30000);
       chai.request(server)
        .post("/api/issues/test")
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
            assert.equal(res.status, 200);
            console.log('body: ' + res.body);  
            //assert.equal(res.body.issue_title, 'Title');
            assert.isDefined(res.body.issue_title, 'field has been filled');
            assert.isDefined(res.body.issue_text, 'field has been filled');
            assert.isDefined(res.body.created_by, 'field has been filled');
            assert.isDefined(res.body.assigned_to, 'field has been filled');
            assert.isDefined(res.body.status_text, 'field has been filled');
            /*assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'text');
            assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
            assert.equal(res.body.assigned_to, 'Chai and Mocha');
            assert.equal(res.body.status_text, 'In QA');*/
            //fill me in too!
            //setTimeout(done, 5000);
            done();  
          
        });
        
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post("/api/issues/test")
        .send({
          issue_title: 'Required Title',
          issue_text: 'Required Text',
          created_by: 'Functional Test - Required fields filled in',
          
        })
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Required Title');
          assert.isDefined(res.body.issue_text, 'Required Text');
          assert.isDefined(res.body.created_by, 'Functional Test - Required fields filled in');
          
          done();  
          
        }); 
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post("/api/issues/test")
        .send({
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: 'Danny',
          status_text: 'In Progress'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          //console.log('In missing body: ' + JSON.stringify(res.body));
          //assert.equal(res.body.issue_title, 'Please fill out title field');
          assert.equal(res.body.issue_title, 'Please fill out title field');
          
          done();
        });       
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body for update', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({
          _id: '32dAxmWn4G'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log('No body fields: ' + JSON.stringify(res.body));
         // assert.equal(res.body._id, '32dAxmWn4G');
          assert.equal(res.body.result, 'no updated field sent');
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({
          _id: '5d4df42704b7c4102971f4f8',
          updated_on: new Date(),
          status_text: 'In review'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log('One field to update: ' + JSON.stringify(res.body));
          //assert.equal(res.body._id, '32dAxmWn4G');
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({
          _id: '5d4df42704b7c4102971f4f8',
          updated_on: new Date(),
          issue_text: 'Optional text',
          assigned_to: 'Michael',
          status_text: 'Fixed'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          done();
        });  
      });
      
    }); 
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
         // console.log('No filter query: ' + JSON.stringify(res.body));
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: true
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log('One filter query: ' + JSON.stringify(res.body));
          assert.isArray(res.body);
          assert.property(res.body[0], 'open');
          assert.equal(res.body[0].open, true);
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: true,
          status_text: 'Fixed',
          issue_text: 'Optional text',
          assigned_to: 'Michael'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          console.log('Multiple filter query: ' + JSON.stringify(res.body));
          assert.isArray(res.body);
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'assigned_to');
       //   assert.equal(res.body[0].open, true);
        //  assert.equal(res.body[0].status_text, 'In progress');
        //  assert.equal(res.body[0].issue_text, 'Multiple fields present');
        //  assert.equal(res.body[0].assigned_to, 'William');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: ''
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, '_id error');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: '5d50e912b5d2410c54ed0bf3'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          console.log('Valid id for delete: ' + JSON.stringify(res.body));
          assert.equal(res.body.success, 'deleted 5d50e912b5d2410c54ed0bf3');
          done();
        });
      });
      
    });

});
