"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/DynamoDB_Methods");

exports.handler = async (event) => {
  console.log("event", event);

  const reimbursements = await Dynamo.getReimbursements().catch((err) => {
    console.log("error in Dynamo Get", err);
    return Responses._500({
      message: "An error has occured. The request was not processed.",
    });
  });

  if (!reimbursements) {
    return Responses._204({
      message: "There are no reimbursements currently.",
    });
  }

  return Responses._200({ reimbursements });
};
