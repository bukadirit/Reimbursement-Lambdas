"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/DynamoDB_Methods");
const S3 = require("../common/S3_Methods");

const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {
  console.log("event", event);
  const item = JSON.parse(event.body);

  if (!item) {
    return Responses._400({
      message: "There was no content submitted. BAD REQUEST!",
    });
  }

  if (item.receipt != null || item.receipt != undefined) {
    item.receipt = await S3.uploadImage(item.receipt.base64).catch((err) => {
      console.log("error in S3 write", err);
      return Responses._500({
        message: "An error has occured. The request was not processed.",
      });
    });
  }

  item.id = uuidv4();
  const reimbursement = await Dynamo.postReimbursement(item).catch((err) => {
    console.log("error in Dynamo Get", err);
    return Responses._500({
      message: "An error has occured. The request was not processed.",
    });
  });

  return Responses._201({ reimbursement });
};
