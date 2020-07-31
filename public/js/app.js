var app = angular.module("myApp", ['ngRoute']);

app.config(function ($routeProvider){
	$routeProvider
	.when('/rooms',{
		controller: 'RoomController',
		templateUrl: 'js/views/rooms.html'
	})
	.when('/login',{
		controller: 'Login',
		templateUrl: 'js/views/login.html'
	})
	.when('/',{
		controller: 'Home',
		templateUrl: 'js/views/index.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.factory('socket',function ($rootScope){
	var socket = io();

	return {
		on: function(eventName, callback){
			socket.on(eventName, callback);
		},
		emit: function(eventName, callback){
			socket.emit(eventName, callback);
		}
	};
});