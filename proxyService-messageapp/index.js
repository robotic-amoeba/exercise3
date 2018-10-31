// Constants
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = 9001;
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//Midlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(limiter);
//error middleware should be the last one
app.use(function (err, req, res, next) {
  if(err instanceof SyntaxError) {
    console.log("Error catched in middleware: ", err)
    res.status(500).send("Server error. Check the request format. (Sytax error)");
  } else {
    res.send("Server error")
  }
})


app.post('/message', function (req, res) {
  const { destination, body } = req.body;

  if (!validateRequestParams(destination, body)) {
    res.status(500).send("Bad format: destination and message should be strings")
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

//this function should return true or false
function validateRequestParams(destination, body) {
  if (!destination || !body) {
    return false
  } else if (typeof destination !== "string" || typeof body !== "string") {
    return false
  }
  return true
}

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);