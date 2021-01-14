const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Reimbursements";
const INDEX_NAME = "authorIndex";

const Dynamo = {
  async getReimbursements() {
    const params = {
      TableName: TABLE_NAME,
      ProjectionExpression:
        "id, amount, description, receipt, timeSubmitted, #S, #T, authorId, authorDetails, timeResolved, resolverId, resolverDetails",
      ExpressionAttributeNames: { "#S": "status", "#T": "type" },
    };

    const data = await dynamo
      .scan(params)
      .promise()
      .catch((err) => {
        throw err;
      });

    return data.Items;
  },

  async getReimbursementById(itemId) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "id = :itemId",
      ExpressionAttributeValues: {
        ":itemId": itemId,
      },
    };

    const data = await dynamo
      .query(params)
      .promise()
      .catch((err) => {
        throw err;
      });
    console.log(data);
    return data.Items;
  },

  async getReimbursementByAuthorId(itemId) {
    const params = {
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      FilterExpression: "authorId = :AuthorId",
      ExpressionAttributeValues: {
        ":AuthorId": itemId,
      },
    };

    const data = await dynamo
      .scan(params)
      .promise()
      .catch((err) => {
        throw err;
      });

    return data.Items;
  },

  async postReimbursement(item) {
    const params = {
      TableName: TABLE_NAME,
      Item: item,
    };

    await dynamo
      .put(params)
      .promise()
      .catch((err) => {
        throw err;
      });

    return item;
  },

  async postReimbursementImage(itemId, imageUrl) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: itemId,
      },
      UpdateExpression: "set receipt = :r",
      ExpressionAttributeValues: {
        ":r": imageUrl,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamo
      .update(params)
      .promise()
      .catch((err) => {
        throw err;
      });

    return;
  },

  async updateReimbursementStatus(itemId, item) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: itemId,
        timeSubmitted: item.timeSubmitted,
      },
      UpdateExpression:
        "SET #S = :s, timeResolved = :tr, resolverId = :ri, resolverDetails = :rd",
      ExpressionAttributeValues: {
        ":s": item.status,
        ":tr": item.timeResolved,
        ":ri": item.resolverId,
        ":rd": item.resolverDetails,
      },
      ExpressionAttributeNames: { "#S": "status" },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamo
      .update(params)
      .promise()
      .catch((err) => {
        throw err;
      });

    return;
  },
};
module.exports = Dynamo;
