/* This program will allow for:
	The creation of windows
	The modification of content of these windows
	A few things:
		Window, which acts as a container div for other elements
		Data, which acts as draggable data content
		Data drop, which acts as place to put data/origin of data
			and ways of generating data.
*/
// UTIL
function isInArray(object, array){
	for (let i = 0; i<array.length; ++i){
		if (array[i] == object) return true;
	}
	return false;
}


class OSWindow{
	static windowIDs = [];
	static zIndexes = [];
	constructor(id, x=0, y=0, width=50, height=50, keepRatio=false){
		if (isInArray(id, OSWindow.windowIDs) || document.getElementById(id) != null){
			throw "Error: created window shares id with existing window or element";
		}
		else{
			this._id = id;
			OSWindow.windowIDs.push(this._id);
			this._idx = OSWindow.zIndexes.length;
			OSWindow.zIndexes.push(OSWindow.zIndexes.length);
			this._width = width;
			this._height = height;
			this._x = x;
			this._y = y;
			this._created = false;
			this._opened = false;
			this._keepRatio = keepRatio;
			this._ratio = width/height;
		}
		
	}

	get element(){
		if (this._created) return document.getElementById(this._id);
		throw "Error: window not created. Use createWindow() to create window element"
	}

	set x(val){
		this._x = val;
		if (this.created) this.updateWindow();
	}
	get x(){
		return this._x;
	}
	set y(val){
		this._y = val;
		if (this.created) this.updateWindow();
	}
	get y(){
		return this._y;
	}
	set width(val){
		this._width = val;
		if (this.created) this.updateWindow();
	}
	get width(){
		return this._width;
	}
	set height(val){
		this._height = val;
		if (this.created) this.updateWindow();
	}
	get height(){
		return this._height;
	}
	set created(val){
		throw "Error: this value cannot be modified";
	}
	get created(){
		return this._created;
	}
	set opened(val){
		throw "Error: this value cannot be modified";
	}
	get opened(){
		return this._opened;
	}
	get id(){
		return this._id;
	}

	createWindow(parent){
		let ref = this;

		if (this._created) throw "Error: window already created.";
		// Create window frame
		let newWindow = document.createElement('div');
		parent.appendChild(newWindow);
		newWindow.id = this._id;
		this._created = true;
		this.element.classList.add("window");
		
		newWindow.onmousedown = function() {ref.updateZ(ref)};
		this.updateWindow();

		// Add window base content
		let topBar = document.createElement('div');
		topBar.classList.add('topBar');
		newWindow.appendChild(topBar);

		let dragBar = document.createElement('div');
		dragBar.classList.add('dragBar');
		topBar.appendChild(dragBar);

		let closeButton = document.createElement('div');
		closeButton.classList.add('closeButton');
		topBar.appendChild(closeButton);

		let closeX = document.createElement('h1');
		closeX.innerText = "X";
		closeX.onclick = function(){
			ref.closeWindow(ref);
		};
		closeX.classList.add('closeX');
		closeButton.appendChild(closeX);

		let windowContent = document.createElement('div');
		windowContent.classList.add('windowContent');
		windowContent.id = this.id + "_content";
		newWindow.appendChild(windowContent);

		let windowResize = document.createElement('div');
		windowResize.classList.add('windowResize');
		newWindow.appendChild(windowResize);

		// Add drag support
		this.enableDrag();

		// Add resize support
		this.enableResize();

		// Reset window position/size if document is resized
		window.addEventListener('resize', function(){
			repositionWindow(ref);
		});

		this._opened = true;
		return windowContent;
		
	}

	close(){
		this.closeWindow(this);
	}

	closeWindow(obj){
		if (!obj.opened) throw "Error: window already closed";
		if (obj.created){
			
			obj.element.style.transform = "scale(0%, 0%)";
			obj.element.getElementsByClassName('closeButton')[0].style.display = "none";
			obj._opened = false;
		}
		else{
			throw "Error: window not created. Use createWindow() to create window element";
		}
	}

	open(){
		if (this.opened) throw "Error: window already open";
		if (this.created){
			this.element.style.transform = "scale(100%, 100%)";
			this.element.getElementsByClassName('closeButton')[0].style.display = "";
			this._opened = true;
			
		}
		else{
			throw "Error: window not created. Use createWindow() to create window element";
		}
	}

	// Drag support adapted from w3schools.com
	enableDrag(){
		this.pos1 = 0, this.pos2 = 0, this.pos3 = 0, this.pos4 = 0;

		let ref = this;
		this.element.querySelector('.dragBar').onmousedown = function(e){
			dragMouseDown(e, ref);
		};
	}

	// Resize support adapted from w3schools.com
	enableResize(){
		this.pos1 = 0, this.pos2 = 0, this.pos3 = 0, this.pos4 = 0;

		let ref = this;
		this.element.querySelector('.windowResize').onmousedown = function(e){
			resizeMouseDown(e, ref);
		}
	}

	updateWindow(){
		let _window = this.element;
		_window.style.top = this.y + "px";
		_window.style.left = this.x + "px";
		_window.style.width = this.width + "px";
		_window.style.height = this.height + "px";
		
	}

	updateZ(obj){
		let oldZ = OSWindow.zIndexes[obj._idx];
		OSWindow.zIndexes[obj._idx] = OSWindow.zIndexes.length - 1;
		OSWindow.zIndexes.forEach((element, index) => {
			if (element > oldZ && index != obj._idx) OSWindow.zIndexes[index] --;
			document.getElementById(OSWindow.windowIDs[index]).style.zIndex = OSWindow.zIndexes[index];
		});
	}
	
	
}

function dragMouseDown(event, obj){
	event = event || window.event;
	event.preventDefault();
	obj.pos3 = event.clientX;
	obj.pos4 = event.clientY;

	document.documentElement.style.cursor = "none";
	obj.element.querySelector('.dragBar').style.cursor = "none";
	obj.element.querySelector('.closeButton').style.cursor = "none";
	obj.element.querySelector('.windowResize').style.cursor = "none";

	document.onmouseup = function(){
		dragMouseUp(obj);
	};
	
	document.onmousemove = function(e){
		dragMouseMove(e, obj);
	};
}

function dragMouseMove(event, obj){
	event = event || window.event;
	event.preventDefault();

	obj.pos1 = obj.pos3 - event.clientX;
	obj.pos2 = obj.pos4 - event.clientY;
	obj.pos3 = event.clientX;
	obj.pos4 = event.clientY;

	obj.x = obj.element.offsetLeft - obj.pos1;
	obj.y = obj.element.offsetTop - obj.pos2;
	if (obj.x + obj.width > window.innerWidth) obj.x = window.innerWidth - obj.width;
	if (obj.y + obj.height > window.innerHeight) obj.y = window.innerHeight - obj.height;
	if (obj.x < 0) obj.x = 0;
	if (obj.y < 0) obj.y = 0;

	obj.updateWindow();
}

function dragMouseUp(obj){
	document.onmouseup = null;
	document.onmousemove = null;

	document.documentElement.style.cursor = "";
	obj.element.querySelector('.dragBar').style.cursor = "";
	obj.element.querySelector('.closeButton').style.cursor = "";
	obj.element.querySelector('.windowResize').style.cursor = "";
}

function resizeMouseDown(event, obj){
	event = event || window.event;
	event.preventDefault;
	obj.pos3 = event.clientX;
	obj.pos4 = event.clientY;

	document.documentElement.style.cursor = "none";
	obj.element.querySelector('.dragBar').style.cursor = "none";
	obj.element.querySelector('.closeButton').style.cursor = "none";
	obj.element.querySelector('.windowResize').style.cursor = "none";

	document.onmousemove = function(e){
		resizeMouseMove(e, obj);
	}
	document.onmouseup = function(){
		resizeMouseUp(obj);
	}
}

function resizeMouseMove(event, obj){
	event = event || window.event;
	event.preventDefault();

	obj.pos1 = obj.pos3 - event.clientX;
	obj.pos2 = obj.pos4 - event.clientY;

	if (obj._keepRatio && Math.abs(obj.pos1) > Math.abs(obj.pos2)) obj.pos2 = obj.pos1;
	else if (obj._keepRatio && Math.abs(obj.pos2) > Math.abs(obj.pos1)) obj.pos1 = obj.pos2;
	obj.pos3 = event.clientX;
	obj.pos4 = event.clientY;

	obj.width = obj.width - obj.pos1;
	obj.height = obj.height - obj.pos2;

	if (obj.width * obj._ratio != obj.height) obj.height = obj.width * obj._ratio;

	if (obj.width + obj.x > window.innerWidth){
		obj.width = window.innerWidth - obj.x;
		if (obj._keepRatio){
			obj.height = (window.innerWidth-obj.x) * obj._ratio;
		}
	}
	if (obj.height + obj.y > window.innerHeight){
		obj.height = window.innerHeight - obj.y;
		if (obj._keepRatio){
			obj.width = (window.innerHeight - obj.y) * obj._ratio;
		}
	}

	if (obj.width < 80) {
		obj.width = 80;
		if (obj._keepRatio){
			obj.height = 80 * obj._ratio;
		}
	}
	if (obj.height < 60){
		obj.height = 60;
		if (obj._keepRatio){
			obj.width = 60 * obj._ratio;
		}
	}

	obj.updateWindow();
}

function resizeMouseUp(obj){
	document.onmousemove = null;
	document.onmouseup = null;

	document.documentElement.style.cursor = "";
	obj.element.querySelector('.dragBar').style.cursor = "";
	obj.element.querySelector('.closeButton').style.cursor = "";
	obj.element.querySelector('.windowResize').style.cursor = "";
}

function repositionWindow(obj){
	if (obj.created){
		if (obj.width > window.innerWidth) obj.width = window.innerWidth;
		if (obj.height > window.innerHeight) obj.height = window.innerHeight;

		if (obj.width + obj.x > window.innerWidth) obj.x = window.innerWidth - obj.width;
		if (obj.height + obj.y > window.innerHeight) obj.y = window.innerHeight - obj.height;

		obj.updateWindow();
	}
}