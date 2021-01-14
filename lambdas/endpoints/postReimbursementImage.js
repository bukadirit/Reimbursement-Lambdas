"use strict";
const Responses = require("../common/API_Responses");
const Dynamo = require("../common/DynamoDB_Methods");
const S3 = require("../common/S3_Methods");

exports.handler = async (event) => {
  const item = JSON.parse(event.body);
  const itemId = event.pathParameters.id;

  if (!item || !itemId) {
    return Responses._400({
      message: "There was no content submitted. BAD REQUEST!",
    });
  }

  const imageUrl = await S3.uploadImage(item.image.base64).catch((err) => {
    console.log("error in S3 write", err);
    return Responses._500({
      message: "An error has occured. The request was not processed.",
    });
  });

  await Dynamo.postReimbursementImage(
    itemId,
    item.timeSubmitted,
    imageUrl
  ).catch((err) => {
    console.log("error in Dynamo Get", err);
    return Responses._500({
      message: "An error has occured. The request was not processed.",
    });
  });

  return Responses._201({
    message: "Your receipt was successfully submitted.",
  });
};
