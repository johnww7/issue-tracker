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
          assigned_to: '',
          status_text: ''
        })
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.isDefined(res.body.issue_title, 'field has been filled');
          assert.isDefined(res.body.issue_text, 'field has been filled');
          assert.isDefined(res.body.created_by, 'field has been filled');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
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
          assert.equal(res.body.issue_title, 'Please fill out title field');
          
          done();
        });       
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({
          _id: '32dAxmWn4G'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, '32dAxmWn4G');
          assert.equal(res.body.update, 'no updated field sent');
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({
          _id: '32dAxmWn4G',
          updated_on: new Date(),
          status_text: 'In review'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, '32dAxmWn4G');
          assert.equal(res.body.updated_on, new Date());
          assert.equal(res.body.status_text, 'In review');
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({
          _id: '32dAxmWn4G',
          updated_on: new Date(),
          issue_text: 'Optional text',
          assigned_to: 'Michael',
          status_text: 'Fixed'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, '32dAxmWn4G');
          assert.equal(res.body.updated_on, new Date());
          assert.equal(res.body.issue_text, 'Optional text');
          assert.equal(res.body.assigned_to, 'Michael');
          assert.equal(res.body.status_text, 'Fixed');
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
          open: false
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'open');
          assert.equal(res.body[0].open, false);
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: true,
          status_text: 'In progress',
          issue_text: 'Multiple fields present',
          assigned_to: 'William'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'assigned_to');
          assert.equal(res.body[0].open, true);
          assert.equal(res.body[0].status_text, 'In progress');
          assert.equal(res.body[0].issue_text, 'Multiple fields present');
          assert.equal(res.body[0].assigned_to, 'William');
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
          _id: '32dAxmWn4G'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.success, 'deleted 2dAxmWn4G');
          done();
        });
      });
      
    });

});
