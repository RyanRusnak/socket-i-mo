var handler = function(req, res) {
	fs.readFile('./index.html', function (err, data) {
    if(err) throw err;
	res.writeHead(200);
	res.end(data);
	});
}

// Pre- Heoku mongoose stuff
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   // yay!
// });

// //Post heroku mongoose stuff
// var http = require ('http');             // For serving a basic web page.
// var mongoose = require ("mongoose"); // The reason for this demo.

// // Here we find an appropriate database to connect to, defaulting to
// // localhost if we don't find one.
// var uristring =
// process.env.MONGOLAB_URI ||
// process.env.MONGOHQ_URL ||
// 'mongodb://localhost/test';

// // The http server will listen to an appropriate port, or default to
// // port 5000.
// var theport = process.env.PORT || 5000;

// // Makes connection asynchronously.  Mongoose will queue up database
// // operations and release them when the connection is complete.
// mongoose.connect(uristring, function (err, res) {
//   if (err) {
//   console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//   } else {
//   console.log ('Succeeded connected to: ' + uristring);
//   }
// });

// var userSchema = mongoose.Schema({
//     name: String
// });

// var User = mongoose.model('User', userSchema);

// User.find(function (err, users) {
//   if (err) return console.error(err);
//   console.log('users!!!!!');
//   console.log(users.length);
// });


var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
// var Moniker = require('moniker');
var port = process.env.PORT || 3000;

app.listen(port);

// socket.io
io.sockets.on('connection', function (socket) {
	var user = addUser();
	var data = {'currentUser' : user, 'users':users};
	socket.emit("welcome", data);
	socket.on('disconnect', function () {
		removeUser(user);
	});

	socket.on("canvasMouseDown", function(l) {
			for(var i=0; i<users.length; i++) {
				if(user.name === users[i].name) {
					//if mouse x is right then animate right
					if (l.x > users[i].location.x){
						users[i].location.x +=5;
						//if mouse down is higher then animate higher
						if(l.y < users[i].location.y){
							users[i].location.y -=5;
						//else animate lower
						}else{
							users[i].location.y +=5;
						}
					//else animate left
					}else{
						users[i].location.x -=5;
						if(l.y < users[i].location.y){
							users[i].location.y -=5;
						//else animate lower
						}else{
							users[i].location.y +=5;
						}
					}
					break;
				}
			}
		io.sockets.emit("updateLocation", users);
	});
		socket.on("UpdateUserName", function(n) {;
			for(var i=0; i<users.length; i++) {
				if(user.id === users[i].id) {
					users[i].name = n;
					// var dbUser = new User({ name: n });
					// dbUser.save(function(err, thor) {
					// 	if (err) return console.error(err);
					// 	console.dir(thor);
					// });
					break;
				}
			}
			io.sockets.emit("users", userNames(users));
	});

});

var users = [];

function userNames(users){
	var str = '';
	for(var i=0; i<users.length; i++) {
		var user = users[i];
		str += user.name + '<br />';
	}
	return str;
}

var addUser = function() {
	var user = {
		id: users.length,
		name: "New User"+(users.length+1),
		location: {x:(Math.random()*200)+1, y:(Math.random()*200)+1}
	}
	users.push(user);
	updateUsers();
	return user;
}
var removeUser = function(user) {
	for(var i=0; i<users.length; i++) {
		if(user.name === users[i].name) {
			users.splice(i, 1);
			updateUsers();
			return;
		}
	}
}
var updateUsers = function() {
	io.sockets.emit("users", userNames(users));
}