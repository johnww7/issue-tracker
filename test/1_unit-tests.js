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

    suite.skip('Function issueController.checkUpdatedIssue(data)', function() {
        test('No body fields sent', function(done) {
            let updatedData = {
                _id: '5871dda29'
            };
            assert.equal(issueController.checkUpdatedIssue(updatedData), 'no updated field sent');
            assert.lengthOf(issueController.checkUpdatedIssue(updatedData), 1, 'Only 1 key');
            
            done();
        });

        test('Atleast 1 or multiple fields updated', function(done) {
            let updatedData = {
                _id: '5871dda29',
                issue_text: 'Optional text',
                assigned_to: 'Michael'
            };

            assert.include(issueController.checkUpdatedIssue(updatedData), {_id: '5871dda29'});
            assert.include(issueController.checkUpdatedIssue(updatedData), {issue_text: 'Optional text'});
            assert.include(issueController.checkUpdatedIssue(updatedData), {assigned_to: 'Michael'});
            assert.lengthOf(issueController.checkUpdatedIssue(updatedData), 3, 'Only 3 keys');
            done();
        });

    });

});
