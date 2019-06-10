const shortid = require('shortid');

function IssueController() {
    this.sendIssue = function(data) {
        console.log("contents of issue: " + JSON.stringify(data));

        let created_on = new Date();
        let updated_on = new Date();
        let open = true;
        let returnData;

        if(data.issue_title === '') {
            return returnData = {
                issue_title: 'Please fill out title field'
            };
        }
        else if(data.issue_text === '') {
            return returnData = {
                issue_text:'Please fill out text field'
            };
        }
        else if(data.created_by === '') {
            return returnData = {
                created_by:'Please fill out created by field'
            };
        }
        else {
            return returnData = {
                _id: shortid.generate(),
                issue_title: data.issue_title,
                issue_text: data.issue_text,
                created_on,
                updated_on,
                created_by: data.created_by,
                assigned_to: data.assigned_to,
                open,
                status_text: data.status_text,
            };
        }

        //return issue;
    };

    this.checkUpdatedIssue = function(data) {
        let updated_on = new Date();
        let open = data.open;
        let updatedData;

        if(Object.keys(data).length == 1 && data._id !== undefined) {
            return updatedData = {
                update: 'no updated field sent'
            };
        }
        else {
            return updatedData = Object.assign(data, updated_on, open);
        } 
    };
}

module.exports = IssueController;