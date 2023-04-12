require("dotenv").config();
const express = require("express");
const axios = require("axios");
const amazonS3Uri = require("amazon-s3-uri");
const AWS = require("aws-sdk");
var temp = require("tmp");
var fs = require("fs");
const BUCKET_NAME = "5409a2bucket";
const AWS_REGION = "us-east-1";
const app = express();
app.use(express.json());
var dataToAppend = "";
var prevData = "";

AWS.config.update({
  aws_access_key_id: process.env.aws_access_key_id,
  aws_secret_access_key: process.env.aws_secret_access_key,
  aws_session_token: process.env.aws_session_token,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token,
});

app.post("/storedata", (req, res) => {
  const data = req.body.data;

  const params = {
    Bucket: BUCKET_NAME,
    Key: "a2.txt",
    Body: data,
    ACL: "public-read",
    ContentType: "text/plain",
  };
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
    res.status(200).json({
      s3uri: data.Location,
    });
  });
});

app.post("/appenddata", (req, res) => {
  dataToAppend = req.body.data;

  var params = { Bucket: BUCKET_NAME, Key: "a2.txt" };

  s3.getObject(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      prevData = data.Body.toString();
      dataToAppend = prevData.concat(dataToAppend);

      const params = {
        Bucket: BUCKET_NAME,
        Key: "a2.txt", // File name you want to save as in S3
        Body: dataToAppend,
        ACL: "public-read",
        ContentType: "text/plain",
      };
      s3.upload(params, function (err, data) {
        if (err) {
          throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        return res.sendStatus(200);
      });
    }
  });
});

app.post("/deletefile", (req, res) => {
  const uri = req.body.s3uri;
  console.log(req.body.s3uri);
  const { region, bucket, key } = amazonS3Uri(uri);

  const params = {
    Key: key,
    Bucket: bucket,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) {
      throw err;
    }
    return res.sendStatus(200);
  });
});

app.listen(3000, () => {
  console.log("App listening to port 3000");
});
