function IssueController() {
    this.sendIssue = function(data) {
        console.log("contents of issue: " + JSON.stringify(data));

        let created_on = new Date();
        let updated_on = new Date();
        let open = true;
        let returnData;

        if(data.issue_title === '') {
            return 'Please fill out title field';
        }
        else if(data.issue_text === '') {
            return 'Please fill out text field';
        }
        else if(data.created_by === '') {
            return 'Please fill out created by field';
        }
        else {
            return returnData = {
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
}

module.exports = IssueController;