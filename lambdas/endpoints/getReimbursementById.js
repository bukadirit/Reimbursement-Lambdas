"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/DynamoDB_Methods");

exports.handler = async (event) => {
  const itemId = event.pathParameters.id;
  console.log(itemId);

  if (!itemId) {
    return Responses._400({
      message: "There was no reimbursement ID in the path paramaters.",
    });
  }

  let reimbursement = await Dynamo.getReimbursementById(itemId).catch((err) => {
    console.log("error in Dynamo Get", err);
    return Responses._500({
      message: "An error has occured. The request was not processed.",
    });
  });

  if (!reimbursement) {
    return Responses._204({
      message: "There are no reimbursements currently.",
    });
  }

  return Responses._200(reimbursement);
};
