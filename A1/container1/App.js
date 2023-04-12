const axios = require("axios");
const express = require("express");
var fs = require('fs');
const app = express();

app.use(express.json());

app.post("/checksum", (req, res) => {
  const { file } = req.body;
  const path = "../src/"+ file;

  if(file == null || file == ""){
    res.send(
      {
        "file" : null ,
        "error": "Invalid JSON input."
      }
    );
  }
  else if(fs.existsSync(path)){
    axios.post('http://container2:5001/checksumcal', {
      "file" : file
    })
    .then(function (response) {
      res.send(
        {
          "file" : file ,
          "checksum": response.data
        }
      );
    })
  }
  else if(!fs.existsSync(path)){
    res.send(
      {
        "file" : file ,
        "error": "File not found."
      }
    );
  }

});


app.listen(5000, () => {
  console.log("Container 1 running on container port 5000");
});