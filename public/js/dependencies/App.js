var lc = LC.init(
            document.getElementsByClassName('my-drawing')[0],
            {imageURLPrefix: '/literallycanvas-0.4.14/img'}
        );

//saves drawings to localStorage =======
/*var localStorageKey = 'drawing'
if (localStorage.getItem(localStorageKey)) {
    lc.loadSnapshot(JSON.parse(localStorage.getItem(localStorageKey)));
}
lc.on('drawingChange', function() {
    localStorage.setItem(localStorageKey, JSON.stringify(lc.getSnapshot()));
});*/
//======================================
/*
var currentShape = null;
var onPointerDown = function(pt) {
    currentShape = LC.createShape('LinePath',{[], true});
    lc.setShapesInProgress([currentShape]);
    //lc.repaintLayer('main');
};

var onPointerDrag = function(pt) {
	currentShape.x = pt.x;
    currentShape.y = pt.y;
    lc.setShapesInProgress([currentShape]);
    //lc.repaintLayer('main');
};

var onPointerUp = function(pt) {
    currentShape.x = pt.x;
    currentShape.y = pt.y;
    lc.setShapesInProgress([]);
    lc.saveShape(self.currentShape);
};
*/
//============================================
var socket = io();

lc.on('lc-pointerdown', function (pt){
	var test = document.getElementById("test");
    test.innerHTML = "ptdown works";
	//socket.emit('pointerdown', pt);
});

lc.on('lc-pointerdrag', function (pt){
	
	//socket.emit('pointerdrag', pt);
});

lc.on('lc-pointerup', function (pt){
	
	//socket.emit('pointerup', pt);
});

lc.on('shapeSave', function (shapeObj){
    var test = document.getElementById("test");
    test.innerHTML = "shapeSave works";
    socket.emit('shapeSave', LC.shapeToJSON(shapeObj));
});

socket.on('shapeSave', function (shapeObj){
    //lc.drawShapeInProgress(shapeObj.shape);
    lc.saveShape(LC.JSONToShape(shapeObj), false, shapeObj.previousShapeId);
    var test = document.getElementById("test");
    test.innerHTML = "socket shapeSave works";
    console.log("hey im in");
});
/*
socket.on('pointerdown', function (pt){
	var rc = document.getElementById("test");
    rc.innerHTML = "pointerdown";
});

socket.on('pointerdrag', function (pt){

});

socket.on('pointerup', function (pt){

}); 
*/
