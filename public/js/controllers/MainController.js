
app.controller('RoomController', function ($scope, $http, $routeParams, socket){
	$scope.test;
	socket.on('enterRoom', function (room, index){
		$scope.$apply(function (){
			$scope.test = room.size;
			$scope.rooms[index] = room;
		});		
	});
	
	socket.on('leaveRoom', function (room, index){
		$scope.$apply(function (){
			$scope.test = room.size;
			$scope.rooms[index] = room;
		});		
	});
	/*$scope.rooms = [{name: "Room1", size: 0},
					{name: "Room2", size: 0},
					{name: "Room3", size: 0},
					{name: "Room4", size: 0}];
	*/
	$http.get('/load/rooms')
	.then(function (response){
		$scope.rooms = response.data;
	}, function (response){
		console.log(response.statusText);
	});

	$scope.enterRoom = function(index){
		sessionStorage.currentRoom = $scope.rooms[index].name;
		/*$scope.rooms[index].size++;
		$http.put('/roomsize/increase/'+index, $scope.rooms[index])
		.then(function (response){
			$scope.rooms = response.data;
		}, function (response){
			console.log(response.statusText);
		});*/

		socket.emit("enterRoom", $scope.rooms[index].name, sessionStorage.nickname);
		window.location = "/whiteboard";
	};
	
});

app.controller('Login', function ($scope, $http, $routeParams, socket){
	$scope.nickname = "";
	$scope.user;
	$scope.login = function(){
		/*
		var data = {nickname: $scope.nickname};
		$http.post('/guest/login', data)
		.then(function (response){
			$scope.user = response.data;
			socket.emit('login', $scope.user.nickname);
			sessionStorage.nickname = $scope.user.nickname;
			console.log($scope.user.nickname);
		}, function (response){
			console.log(response.statusText);
		});
		*/
		sessionStorage.nickname = $scope.nickname;
		socket.emit("login", $scope.nickname);
		window.location = "/#/rooms";
	};

});

app.controller('Home', function ($scope, $routeParams){

});

app.controller('WhiteboardRoom', function ($scope, $routeParams, socket){
	$scope.thisRoom = sessionStorage.currentRoom;
	$scope.leaveRoom = function(){
		/*
		socket.emit('leaveRoom', sessionStorage.currentRoom);
		$http.put('/roomsize/decrease/', {name: $scope.thisRoom})
		.then(function (response){

		}, function (response){

		});*/
		socket.emit('leaveRoom', $scope.thisRoom);
		window.location = "/#/rooms";
	};

});

