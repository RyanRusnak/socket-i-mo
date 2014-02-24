var handler = function(req, res) {
	fs.readFile('./index.html', function (err, data) {
    if(err) throw err;
	res.writeHead(200);
	res.end(data);
	});
}

//mongoose stuff
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   // yay!
// });

// var userSchema = mongoose.Schema({
//     name: String
// });

// var User = mongoose.model('User', userSchema);

// var me = new User({ name: 'Ryan' });
// var kirby = new User({ name: 'Kirby' });
// console.log(me.name);

// me.save(function(err, thor) {
//   if (err) return console.error(err);
//   console.dir(thor);
// });

// User.find(function (err, users) {
//   if (err) return console.error(err);
//   console.log('users!!!!!');
//   console.log(users.length);
// });








var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
// var Moniker = require('moniker');
var port = 3000;

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
					break;
				}
			}
			io.sockets.emit("users", userNames(users));
	});

});

var users = [];
function getUsers(){

}
function getCurrentUser(){

}
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
	console.log("users are");
	console.log(userNames(users));
	io.sockets.emit("users", userNames(users));
}