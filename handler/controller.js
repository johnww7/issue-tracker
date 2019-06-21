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
                created_on: new Date(),
                updated_on: new Date(),
                created_by: data.created_by,
                assigned_to: data.assigned_to,
                open: true,
                status_text: data.status_text,
            };
        }

        //return issue;
    };

    this.checkUpdatedIssue = function(entryData, data) {
        let updated_on = {updated_on: new Date()};
        let open = {open: (data.open || true)};
        let updatedData;
        console.log('Update data from issue: ' + JSON.stringify(data));
        console.log('Data from db: ' + JSON.stringify(entryData));

        let issueDataValues = Object.values(data);
        const filterEmptyFields = issueDataValues.filter(entry => entry !== '');
        console.log('Length of field: ' + filterEmptyFields);
        if(Object.keys(filterEmptyFields).length == 1 && data._id !== undefined) {
            console.log('Cannot update');
            return updatedData = {
                update: 'no updated field sent'
            };
        }
        else {
            console.log('Can make an update');
            let filterUpdateData = Object.keys(data).filter(function(key) {
                return data[key] !== '';
            }).map(function(key) {
                return { [key]: data[key]};
            }).reduce(function(acc, curr) {
                let fieldKey = Object.keys(curr)[0];
                acc[fieldKey] = curr[fieldKey];
                return acc;
            }, {});

            //let parseUpdateData = JSON.parse(filterUpdateData);
            console.log('filtered fields: ' + JSON.stringify(filterUpdateData));
            let mergeDbAndEntryData = Object.assign({}, entryData, filterUpdateData);
            return updatedData = Object.assign({}, mergeDbAndEntryData, updated_on, open);
        } 
    };
}

module.exports = IssueController;