const shortid = require("shortid");

function IssueController() {
  this.sendIssue = function(data) {
    console.log("contents of issue: " + JSON.stringify(data));

    let created_on = new Date();
    let updated_on = new Date();
    let open = true;
    let returnData;
    
    /*if (Object.keys(data).length === 1){
      return (returnData = {})
    }*/
    if (data.issue_title === "") {
      return (returnData = {
        issue_title: "Please fill out title field"
      });
    } else if (data.issue_text === "") {
      return (returnData = {
        issue_text: "Please fill out text field"
      });
    } else if (data.created_by === "") {
      return (returnData = {
        created_by: "Please fill out created by field"
      });
    } else {
      //_id: shortid.generate(),
      return (returnData = {
        issue_title: data.issue_title,
        issue_text: data.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: data.created_by,
        assigned_to: data.assigned_to,
        open: true,
        status_text: data.status_text
      });
    }

    //return issue;
  };

  this.updateIssue = function(entryData) {
    let updated_on = { updated_on: new Date() };
    let checkClose = (entryData.open == "false") ? false : true;
    //let open = { open: checkClose || true };
    let open = {open: checkClose};
    console.log("Update data from issue: " + JSON.stringify(entryData));

    let filterUpdateData = Object.keys(entryData)
      .filter(function(key) {
        return entryData[key] !== "" && key !== "_id";
      })
      .map(function(key) {
        return { [key]: entryData[key] };
      })
      .reduce(function(acc, curr) {
        let fieldKey = Object.keys(curr)[0];
        acc[fieldKey] = curr[fieldKey];
        return acc;
      }, {});

    console.log("filtered fields: " + JSON.stringify(filterUpdateData));
    if (Object.keys(filterUpdateData).length == 0) {
      return { fail: "no fields" };
    } else {
      let updateData = Object.assign({}, filterUpdateData, updated_on, open);
      //let updateData = {$set: update};
      console.log("Sending for update" + JSON.stringify(updateData));
      return updateData;
    }
  };

  this.queryIssues = function(queryFilter) {
    console.log('query fields: ' + JSON.stringify(queryFilter));

    if(Object.keys(queryFilter).length == 0) {
      return {};
    }
    else {
      let queryObject = {};
      for (const key in queryFilter) {
        if(key === 'open') {
          queryObject[key] = (queryFilter[key] == "true") ? true : false;
        }
        else {
          queryObject[key] = queryFilter[key];
        }
      }
      console.log('Fields in Object: ' + JSON.stringify(queryObject));
      return queryObject;
    }
  };
}

module.exports = IssueController;
