const express = require("express");
const fs = require("fs");
const NodeRSA = require("node-rsa");
const app = express();
app.use(express.json());

const publicKey = fs.readFileSync("public_key.txt").toString();
const privateKey = fs.readFileSync("private_key.txt").toString();

app.post("/decrypt", (req, res) => {
  const key = new NodeRSA(privateKey, { b: 1024 });
  const { file } = req.body.message;
  const plain = req.body.message;
  const result = Buffer.from(key.decrypt(plain), "base64").toString();
  res.status(200).json({
    response: result,
  });
});

app.post("/encrypt", (req, res) => {
  const key = new NodeRSA(publicKey, { b: 1024 });
  const cipher = Buffer.from(req.body.message);
  const result = key.encrypt(cipher, "base64");
  res.status(200).json({
    response: result.toString("base64"),
  });
});

app.listen(3000, () => {
  console.log("App listening to port 3000");
});
