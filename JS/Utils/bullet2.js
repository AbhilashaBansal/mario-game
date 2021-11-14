function Bullet2() {
	var gameCanvas = GameCanvas.getInstance();
  
	var element = new Image();
	element.src = 'images/bullet.png';
  
	this.x;
	this.y;
	this.velX;
	this.velY;
	this.grounded = false;
	this.sX = 0;
	this.sY = 0;
	this.width = 16;
	this.height = 16;
  
	let that = this;
  
	this.init = function(x, y) {
	  that.velY = -16;
	  that.x = x + that.width;
	  that.y = y + 30;
	  that.type = 30;
	};
  
	this.draw = function() {
	  gameCanvas.draw(element, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
	};
  
	this.update = function() {
	  that.y += that.velY;
	  
	};
  }
  