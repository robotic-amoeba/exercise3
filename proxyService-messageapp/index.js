const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 9001;
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
const DBservice = require('./database-service/DBservice');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(limiter);

const messaging = require('./routes/messaging');
app.use('/message', messaging);

app.use(function (err, req, res, next) {
  if(err instanceof SyntaxError) {
    console.log("Error catched in middleware: ", err)
    res.status(400).send("Error. Check the request format. (Sytax error)");
  } else {
    res.status(500).send("Server error");
  }
})

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);