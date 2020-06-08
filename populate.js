#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var User = require('./models/User');
// var Message = require('./models/Message');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
// var messages = [];
//delete

// function messageCreate(title, message, created, user, cb) {
//   messageDetail = {
//     title: title,
//     message: message,
//     created: created,
//     user: user,
//   };

//   var message = new Message(messageDetail);
//   message.save(function (err) {
//     if (err) {
//       cb(err, null);
//       return;
//     }
//     console.log('New message: ' + message);
//     messages.push(message);
//     cb(null, message);
//   });
// }

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

// function createMessages(cb) {
//   async.series(
//     [
//       function (callback) {
//         messageCreate(
//           'TheOP',
//           'TheOP is enough for full Stack Development',
//           Date.now(),
//           'John Adams',
//           callback
//         );
//       },
//       function (callback) {
//         messageCreate(
//           'Community',
//           'Community hospital is far from home',
//           Date.now(),
//           'Patric Rufus',
//           callback
//         );
//       },
//     ],
//     // optional callback
//     cb
//   );
// }

function createUsers(cb) {
  async.parallel(
    [
      function (callback) {
        userCreate('John', 'Adams', 'jadams', 'Aadf123', true, false, callback);
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
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('BOOKInstances: ' + results);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
