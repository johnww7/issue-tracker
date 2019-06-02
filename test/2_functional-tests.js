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
      
      test.skip('Required fields filled in', function(done) {
        chai.request(server)
        .post("/api/issues/test")
        .send({
          issue_title: 'Required Title',
          issue_text: 'required text',
          created_by: 'Functional Test - Required fields filled in',
          assigned_to: '',
          status_text: ''
        })
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.equal(res.)
          done();  
          
        }); 
      });
      
      test.skip('Missing required fields', function(done) {
        
      });
      
    });
    
    suite.skip('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        
      });
      
      test('One field to update', function(done) {
        
      });
      
      test('Multiple fields to update', function(done) {
        
      });
      
    });
    
    suite.skip('GET /api/issues/{project} => Array of objects with issue data', function() {
      
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
        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        
      });
      
    });
    
    suite.skip('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        
      });
      
      test('Valid _id', function(done) {
        
      });
      
    });

});
