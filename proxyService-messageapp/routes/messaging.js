const express = require('express');
const router = express.Router();
const timeout = require('connect-timeout')
const DBservice = require('../database-service/DBservice');
const axios = require('axios');
const messageAPP = axios.create({
  baseURL: 'http://messageapp:3000',
  timeout: 3000
});


router.post('/', (req, res) => {
  const { destination, body } = req.body;

  if (!validateRequestParams(destination, body)) {
    res.status(400).send("Bad format: destination and message should be strings");
    return;
  }

  messageAPP.post('/message', {
    destination,
    body
  })
    .then((response) => {
      res.send(`${response.data}`);
      DBservice.saveMessage(destination, body, response.data);
    })
    .catch((error) => {
      let customError;
      if (error.response || error.request) {
        customError = "Error in messageapp"
        if (error.code && error.code === 'ECONNABORTED') {
          customError = "Error in messageapp. Timeout"
        }
      } else {
        customError = "Server error"
      }
      console.log(customError);
      res.status(500).send(customError);
      DBservice.saveMessage(destination, body, customError);
    });
});

router.get('/', (req, res, next) => {
  DBservice.getMessages()
    .then((messages) => {
      res.status(200).send(messages)
    })
    .catch(next)
})

/* function handleTimeout(req, res, next) {
  req.timedout ? res.status(500).send("Server timeout") : next(); 
} */

function validateRequestParams(destination, body) {
  if (!destination || !body) {
    return false;
  } else if (typeof destination !== "string" || typeof body !== "string") {
    return false;
  }
  return true;
}


module.exports = router;


