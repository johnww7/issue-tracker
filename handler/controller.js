const shortid = require("shortid");

function IssueController() {

  //Tests fields from post route(submit) to see if all mandatory fields are
  //filled in and formats fields to be submitted to issue tracker
  this.sendIssue = function(data) {
    let created_on = new Date();
    let updated_on = new Date();
    let open = true;
    let returnData;

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
  };

  //Takes fields submitted through put route(update) and filters out all empty fields and id field
  //Then tests to see if no fields were filled in or formats fields to be submitted for update
  this.updateIssue = function(entryData) {
    let updated_on = { updated_on: new Date() };
    let checkClose = entryData.open == "false" ? false : true;
    let open = { open: checkClose };

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

    if (Object.keys(filterUpdateData).length == 0) {
      return { fail: "no fields" };
    } else {
      let updateData = Object.assign({}, filterUpdateData, updated_on, open);
      return updateData;
    }
  };

  //Formats the query search parameters for get route based on query parameters submiited.
  this.queryIssues = function(queryFilter) {
    if (Object.keys(queryFilter).length == 0) {
      return {};
    } else {
      let queryObject = {};
      for (const key in queryFilter) {
        if (key === "open") {
          queryObject[key] = queryFilter[key] == "true" ? true : false;
        } else {
          queryObject[key] = queryFilter[key];
        }
      }
      return queryObject;
    }
  };
}

module.exports = IssueController;
