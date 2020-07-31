WhiteboardRoom = function(numUsers, WhiteboardObj, UserObjArr, ChatSystemObj){
	this.numUsers = numUsers;
	this.whiteboard = WhiteboardObj;
	this.users = UserObjArr;
	this.chatBox = ChatSystemObj;
};

WhiteboardRoom.prototype = {
	displayUsers : function(){
		//code goes here
	}
};