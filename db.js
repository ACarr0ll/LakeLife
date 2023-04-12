const mongoose = require('mongoose');
const username = 'lakelife';
const password = 'lakelifedb';

mongoose.connect('mongodb+srv://' + username + ':' + password + '@' +'lakelife.8dltymf.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error(err);
});

module.exports = mongoose.connection;