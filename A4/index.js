const AWS = require("aws-sdk");
const sqs = new AWS.SQS({ region: "us-east-1" });

exports.handler = async (event) => {
  let sqsUrl = "";

  if (event.type === "CONNECT") {
    sqsUrl = "https://sqs.us-east-1.amazonaws.com/458991758553/Connect";
  }
  if (event.type === "SUBSCRIBE") {
    sqsUrl = "https://sqs.us-east-1.amazonaws.com/458991758553/Subscribe";
  }
  if (event.type === "PUBLISH") {
    sqsUrl = "https://sqs.us-east-1.amazonaws.com/458991758553/Publish";
  }

  const receiveParams = {
    MaxNumberOfMessages: 10,
    QueueUrl: sqsUrl,
    VisibilityTimeout: 60,
  };

  const result = await sqs.receiveMessage(receiveParams).promise();

  const requestBody = JSON.parse(result.Messages[0].Body);

  const deleteParams = {
    QueueUrl: sqsUrl,
    ReceiptHandle: result.Messages[0].ReceiptHandle,
  };

  if (result.Messages && result.Messages.length > 0) {
    if (event.type === "CONNECT") {
      console.log(requestBody);
      console.log(result.Messages[0]);
      const response = {
        type: "CONNACK",
        returnCode: 0,
        username: requestBody.username,
        password: requestBody.password,
      };

      try {
        await sqs.deleteMessage(deleteParams).promise();

        console.log("Message deleted successfully");
        return response;
      } catch (error) {
        console.error(error);
      }
    }
    if (event.type === "SUBSCRIBE") {
      console.log(requestBody);
      const response = {
        type: "SUBACK",
        returnCode: 0,
      };
      try {
        await sqs.deleteMessage(deleteParams).promise();

        console.log("Message deleted successfully");
        return response;
      } catch (error) {
        console.error(error);
      }
    }
    if (event.type === "PUBLISH") {
      console.log(requestBody);
      const response = {
        type: "PUBACK",
        returnCode: 0,
        payload: requestBody.payload,
      };
      try {
        await sqs.deleteMessage(deleteParams).promise();

        console.log("Message deleted successfully");
        return response;
      } catch (error) {
        console.error(error);
      }
    }
  } else {
    const response = {
      message: "No messages found",
    };
    return response;
  }
};
