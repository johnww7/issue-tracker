/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
var controller = require('../handler/controller.js');

var issueController = new controller(); 

suite('Unit Tests', function() {

//none required
    suite('Function issueController.sendIssue(data)', function(){
        
        test('All fields filled input', function(done) {
            let inputData = {
                issue_title: 'test',
                issue_text: 'test data',
                created_by: 'john',
                assigned_to: 'joe',
                status_text: 'In QA'
            }
            assert.isObject(issueController.sendIssue(inputData), 'Return value is an object');
            done();
        });
        
        test('Blank for optional input fields', function(done) {
            let inputData = {
                issue_title: 'test',
                issue_text: 'test data',
                created_by: 'john',
                assigned_to: '',
                status_text: ''
            }
            let message = "field is blank";

            assert.isObject(issueController.sendIssue(inputData), 'Return value is an object');
            assert.include(issueController.sendIssue(inputData), {assigned_to: ''}, message);
            assert.include(issueController.sendIssue(inputData), {status_text: ''}, message);

            done();
        });
    });

});