const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Reimbursements";

const Dynamo = {
  async getReimbursements() {
    const params = {
      TableName: TABLE_NAME,
      ProjectionExpression:
        "id, amount, description, receipt, timeSubmitted, #S, #T, author, timeResolved, resolver",
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
};
module.exports = Dynamo;
