var socket = io();
var myPath;
var myPath2;
var erasePath;
var pathSelected = true;
var showName;

var sColor = document.getElementById("strokeColor");

var strokeColor = sColor.value;
var strokeWidth = 5;

window.onload = $(function(){
	$("#eraser").prop("checked", false);
	socket.emit('loadRoom', sessionStorage.currentRoom, sessionStorage.nickname);
});

$("#strokeColor").change(function(){
	strokeColor = $("#strokeColor").val();
});

$("#strokeWidth").change(function(){
	strokeWidth = $("#strokeWidth").val();
});

$("#eraser").change(function(){
	console.log($("#eraser").prop("checked"));
	if($(this).prop("checked"))
	{
		strokeColor = "white";
		pathSelected = false;
	}
	else
	{
		strokeColor = $("#strokeColor").val();
		pathSelected = true;
	}
});

function onMouseDown(event) {
	myPath = new Path();
	myPath.strokeColor = strokeColor;
	myPath.strokeWidth = strokeWidth;
	myPath.strokeCap = 'round';
	myPath.selected = pathSelected;

	socket.emit('MouseDown', myPath.strokeColor, myPath.strokeWidth, event.point, sessionStorage.nickname);
}

function onMouseDrag(event) {
	myPath.add(event.point);
	socket.emit('MouseDrag', event.point);
}

function onMouseUp(event) {
	myPath.simplify();
	myPath.selected = false;
	socket.emit('MouseUp', event.type);
}

socket.on('serverMessage', function (content) {
    $('#status').text(content).show();
        setTimeout(function(){
            $('#status').fadeOut('slow');
        }, 3500);
    });

socket.on('MouseDown', function (strokeColor, strokeWidth, pointArr, nickname){
	myPath2 = new Path();
	myPath2.strokeColor = new Color(strokeColor[1],strokeColor[2],strokeColor[3]);
	myPath2.strokeWidth = strokeWidth;
	myPath2.selected = false;
	console.log('MouseDown');
	console.log(pointArr);
	showName = new PointText(new Point(pointArr[1],pointArr[2]));
	showName.justification = 'center';
	showName.fillColor = 'black';
	showName.fontWeight = 'bold';
	showName.fontSize = 20;
	showName.content = nickname;
	console.log(showName.content);
});

socket.on('MouseDrag', function (blank){
	myPath2.add(new Point(blank[1],blank[2]));
	console.log('MouseDrag');
	console.log("x: "+blank[1]+", "+"y: "+blank[2]);

	showName.position = new Point(blank[1],blank[2]);
});

socket.on('MouseUp', function (blank){
	myPath2.simplify();
	myPath2.selected = false;
	console.log('MouseUp');

	showName.remove();
});
