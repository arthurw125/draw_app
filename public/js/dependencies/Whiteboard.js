Whiteboard = function(boardSize, MarkerObj){
	this.boardSize = boardSize;
	this.Marker = MarkerObj;
};

Whiteboard.prototype = {
	draw : function(){
		//code goes here
		ctx.strokeStyle = "#df4b26";
		ctx.lineJoin = "round";
		ctx.lineWidth = 5;

		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x,y);
	}
};

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//ctx.fillStyle = "#FF0000";
//ctx.fillRect(0,0,150,75);