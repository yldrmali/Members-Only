//populate.js adds user to db

var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var User = require('./models/User');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];

function userCreate(
  firstname,
  lastname,
  username,
  password,
  member,
  admin,
  cb
) {
  userDetail = {
    firstname: firstname,
    lastname: lastname,
    username: username,
    password: password,
    member: member,
    admin: admin,
  };

  var user = new User(userDetail);
  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
  });
}


function createUsers(cb) {
  async.parallel(
    [
      function (callback) {
        userCreate('John', 'Adams', 'jadams', 'jadams123', true, false, callback);
      },
      function (callback) {
        userCreate(
          'Thomas',
          'Jefferson',
          'tjefferson',
          'Tjefferson123',
          true,
          false,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createUsers],
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('results: ' + results);
    }
    mongoose.connection.close();
  }
);
