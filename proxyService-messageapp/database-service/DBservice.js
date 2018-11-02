const mongoose = require('mongoose');
const Message = require('./models/Message');

class _DBservice {

  constructor() {
    this.conection = mongoose.connect('mongodb://mongodb:27017/messagingCabify', { useNewUrlParser: true })
      .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
      })
      .catch(err => {
        console.error('Error connecting to mongo', err);
      });
  }

  saveMessage(destination, body, status) {
    Message.create({
      destination,
      body,
      status
    })
      .then((data) => console.log(data));
  }

  getMessages() {
    return Message.find()
  }
}

const DBservice = new _DBservice();
module.exports = DBservice;


