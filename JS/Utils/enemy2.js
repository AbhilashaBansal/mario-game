function Enemy2() {
    var gameCanvas = GameCanvas.getInstance();
  
    var element = new Image();
    element.src = 'images/enemy2.png';
  
    this.x;
    this.y;
    this.velX = 1;
    this.velY = 0;
    this.grounded = false;
    this.state;
  
    this.sX=0;
    this.sY=0;
    this.width = 32;
    this.height = 32;
  
    this.frame = 0;
  
    var that = this;
  
    this.draw = function() {
      that.sX = that.width * that.frame;
      gameCanvas.draw(element, that.sX, that.sY, that.width, that.height, that.x, that.y, that.width, that.height);
    };
  
    this.update = function() {
      var gravity = 0.2;
  
      if (that.grounded) {
        that.velY = 0;
      }
  
      if (that.state == 'dead') {
        that.frame = 2; //squashed goomba, after mario jumps on it
  
        tickCounter++;
        if (tickCounter >= 60) {
          that.frame = 4;
        }
      } 
      else if (that.state == 'deadFromBullet') {
        //falling goomba
        that.frame = 3;
        that.velY += gravity;
        that.y += that.velY;
      } 
      else {
        //only animate when not dead
        that.velY += gravity;
        that.x += that.velX;
        that.y += that.velY;
  
        //for animating
        tickCounter += 1;
  
        if (tickCounter > maxTick) {
          tickCounter = 0;
          if (that.frame == 0) {
            that.frame = 1;
          } else {
            that.frame = 0;
          }
        }
      }
    };
  }
  