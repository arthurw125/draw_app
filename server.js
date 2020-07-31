//INCLUDE MODULES
//=====================

//web framework
var express = require("express");
var app = express();
//http protocol
var http = require("http").Server(app);
//socket server
var io = require("socket.io")(http);
//handling file paths
var path = require("path");
//log http requests to the console
var morgan = require('morgan');
//get parameters from request body
var bodyParser = require('body-parser');
//====================================

app.get('/', function(req,res){
	res.sendFile(__dirname + "/main.html");
});

app.get('/whiteboard', function(req,res){
	res.sendFile(__dirname + "/paperjs.html");
});
/*
app.get('/paperjs', function(req,res){
	res.sendFile(__dirname + "/paperjs.html");
});
*/
app.use(express.static(path.join(__dirname, '/public')));

var users = [{id: 0, fname: "Arthur", lname: "Williams"},
		 {id: 1, fname: "Alberta", lname: "Williams"},
		 {id: 2, fname: "Linda", lname: "Mitchell"}];

var guests = [];

var rooms = [
	{name: "Room1", users: [], size: 0},
	{name: "Room2", users: [], size: 0},
	{name: "Room3", users: [], size: 0},
	{name: "Room4", users: [], size: 0}
	];


//DEFINE MIDDLEWARE
//==============================
//serve static files from the /public directory
//app.use(express.static(path.join(__dirname, '/public')));
//log every request to the console
app.use(morgan('dev'));
//parse json
app.use(bodyParser.json());
//parse urlencoded bodies like "fname=Jane&lname="Doe"
app.use(bodyParser.urlencoded({'extended':'true'}));

//DEFINE ROUTES
//=============================
//ROUTE EXAMPLES

//GET all users
//curl http://localhost:3000/api/users
app.get('/api/users', function (req, res){
	res.json(users);
});

//GET user by id
//curl http://localhost:3000/api/users/1
app.get('/api/users/:id', function (req, res){
	if (!users[req.params.id]) res.sendStatus(404);
	else res.json(users[req.params.id]);
});

//UPDATE user by id
//curl -X PUT curl http://localhost:3000/api/users/1 -d "fname=Jane&lname=Doe" 
app.put('/api/users/:id', function (req, res){
	users[req.params.id] = req.body;
	res.json(users);
});

//CREATE a user
//curl -X POST http://localhost:3000/api/users -d "id=2&fname=Alberta&lname=Williams&email=alberta@example.com"
app.post('/api/users', function (req, res){
	users.push(req.body);
	res.json(users);
});

//DELETE user by id
//curl -X DELETE http://localhost:3000/api/users/1
app.delete('/api/users/:id', function (req, res){
	users.splice(req.params.id, 1);
	res.json(users);
});
//===================================
//REAL ROUTES

app.post('/guest/login', function (req, res){
	guests.push(req.body);
	console.log(req.body);
	console.log("post request");
	res.json(req.body);
});

app.get('/load/rooms', function (req, res){
	res.json(rooms);
});

app.put('/roomsize/increase/:id', function (req, res){
	rooms[req.params.id] = req.body;
	res.json(rooms);
});

app.put('/roomsize/decrease/', function (req, res){
	for(i=0;i<rooms.length;i++){
			
			if(rooms[i].name == req.body.name)
			{
				rooms[i].size--;
				console.log("room size decreased");
				break;
			}
		}
	res.json(rooms);
});
//END ROUTES
//===================================

//listens for connections from users
io.on('connection', function (socket){
	console.log("User Connected!");
	//socket.nickname = "MEME";
	
	socket.on('login', function (nickname){
		console.log(nickname);
		socket.nickname = nickname;
	});

	socket.on('enterRoom', function (roomName, nickname){
		console.log(roomName);
		
		socket.roomName = roomName;
		socket.nickname = nickname;
		console.log(socket.roomName);
		for(i=0;i<rooms.length;i++){
			console.log('in loop');
			if(rooms[i].name == roomName)
			{
				/*
				rooms[i].size++;
				io.emit('enterRoom', rooms[i], i);
				console.log("room size increased");
				console.log(rooms[i].size);
				break;
				*/
				rooms[i].users.push(nickname);
				rooms[i].size = rooms[i].users.length;
				io.emit('enterRoom', rooms[i], i);
			}
		}	
		
	});

	socket.on('loadRoom', function (roomName, nickname){
		socket.roomName = roomName;
		socket.nickname = nickname;
		socket.join(roomName);
		console.log(socket.roomName);
		io.in(socket.roomName).emit('serverMessage', socket.nickname+" joined the session");
	});

	socket.on('leaveRoom', function (roomName){
		console.log(roomName);
		socket.leave(roomName);
		for(i=0;i<rooms.length;i++){
			console.log('in loop');
			if(rooms[i].name == roomName)
			{
				rooms[i].size--;
				io.emit('enterRoom', rooms[i], i);
				console.log("room size decreased");
				console.log(rooms[i].size);
				break;
			}
		}
		socket.roomName = null;
	});
	

	//PaperJs//=================================
	
	socket.on('MouseDown', function (strokeColor, strokeWidth, point, nickname){
		console.log(socket.roomName);
		console.log(point);
		socket.broadcast.in(socket.roomName).emit('MouseDown', strokeColor, strokeWidth, point, nickname);
		//socket.broadcast.emit('MouseDown', strokeColor, strokeWidth, point, nickname);
		console.log('Im working in MouseDown');
		console.log(strokeColor,strokeWidth);
		console.log(socket.nickname);
	});

	socket.on('MouseDrag', function (point){
		socket.broadcast.in(socket.roomName).emit('MouseDrag',point);
		//socket.broadcast.emit('MouseDrag', blank);
		console.log('Im working in MouseDrag');
		console.log(point);
		console.log(socket.roomName);
	});

	socket.on('MouseUp', function (blank){
		socket.broadcast.in(socket.roomName).emit('MouseUp',blank);
		//socket.broadcast.emit('MouseUp', blank);
		console.log('Im working in MouseUp');
		console.log(blank);
		console.log(socket.roomName);
	});

});

//server listens on port 3000
http.listen(process.env.PORT || 3000, function(){
	console.log("listening on *:3000");
});