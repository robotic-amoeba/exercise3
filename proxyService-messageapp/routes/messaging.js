const express = require('express');
const app = express();
const axios = require('axios');
const router  = express.Router();

router.post('/', function (req, res) {
  const { destination, body } = req.body;

  if (!validateRequestParams(destination, body)) {
    res.status(400).send("Bad format: destination and message should be strings")
    return;
  }

  axios.post('http://messageapp:3000/message', {
    destination,
    body
  })
    .then((response) => {
      res.send(`${response.data}`)
    })
    .catch((e) => {
      console.log("error in axios request")
      res.status(500).send("Server error when requesting the message service")
    })
})


function validateRequestParams(destination, body) {
  if (!destination || !body) {
    return false;
  } else if (typeof destination !== "string" || typeof body !== "string") {
    return false;
  }
  return true;
}


module.exports = router;


