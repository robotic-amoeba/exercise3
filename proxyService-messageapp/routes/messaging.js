const express = require('express');
const axios = require('axios');
const router = express.Router();
const DBservice = require('../database-service/DBservice');

router.post('/', (req, res) => {
  const { destination, body } = req.body;

  if (!validateRequestParams(destination, body)) {
    res.status(400).send("Bad format: destination and message should be strings");
    return;
  }

  axios.post('http://messageapp:3000/message', {
    destination,  
    body
  })
    .then((response) => {
      res.send(`${response.data}`);
      DBservice.saveMessage(destination, body, response.data);
    })
    .catch((e) => {
      console.log("error in axios request");
      res.status(500).send("Server error when requesting the message service");
      DBservice.saveMessage(destination, body, "Error when trying to send the message");
    });
});

router.get('/', (req, res, next) => {
  DBservice.getMessages()
  .then((messages)=>{
    res.status(200).send(messages)
  })
  .catch(next)
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


