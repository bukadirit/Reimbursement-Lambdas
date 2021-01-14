"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/DynamoDB_Methods");

exports.handler = async (event) => {
  const item = JSON.parse(event.body);
  const itemId = event.pathParameters.id;

  if (!item || !itemId) {
    return Responses._400({
      message: "There was no content submitted. BAD REQUEST!",
    });
  }

  await Dynamo.updateReimbursementStatus(itemId, item).catch((err) => {
    console.log("error in Dynamo Update", err);
    return Responses._500({
      message: "An error has occured. The request was not processed.",
    });
  });

  return Responses._201({
    message: "The reimbursement was updated successfully.",
  });
};
