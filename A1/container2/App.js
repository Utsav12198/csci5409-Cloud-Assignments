const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
});

app.post("/checksumcal", (req, res) => {
  const  f = req.body.file;
  const path = "../src/"+ f;
  const filedata = fs.readFileSync(path, 'utf8');
  const hash = crypto.createHash('md5').update(filedata, 'utf8').digest('hex')

  res.send(
    hash
  );
});

app.listen(5001, () => {
  console.log("Container 2 running on container port 5001");
});