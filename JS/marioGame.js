// Main Class of Mario Game

function MarioGame() {
    let gameCanvas = GameCanvas.getInstance();
  
    let maxWidth; //width of the game level
    let height;
    let viewPort; //width of canvas, viewPort that can be seen
    let tileSize;
    let map, unparsedMaps;
  
    let translatedDist; //distance translated (side scrolled) as mario moves to the right
    let centerPos; //center position of the viewPort, viewable screen
    let marioInGround;
  
    //instances
    let mario;
    let element;
    let gameSound;
    let score;
  
    let goombas=[];
    let powerUps=[];
    let bullets=[];
    let bulletFlag = false;
    let keys=[];
  
    let currentLevel;

    let animationID;
    let instructionTick = 0; //showing instructions counter

    // preserving scope
    let that = this;


    this.init = function(levelMaps, level) {
        // CHECK
        height = 480; 
        maxWidth = 0;
        viewPort = 1280;
        tileSize = 32;
        translatedDist = 0;
        goombas = [];
        powerUps = [];
        bullets = [];
    
        gameCanvas.setWidth(viewPort);
        gameCanvas.setHeight(height);
        gameCanvas.show();
    
        currentLevel = level;
        unparsedMaps = levelMaps;
        map = JSON.parse(levelMaps[currentLevel]);
    
        // ADD SCORE
        
    
        // mario instance
        if (!mario) {
          //so that when level changes, it uses the same instance to run the game
          mario = new Mario();
          mario.init();
        } 
        else {
          mario.x = 10;
          mario.frame = 0;
        }

        // add more components
    
        ////

        that.calculateMaxWidth();
        that.addKeyPressEvents();
        that.startGame();
    };

    that.calculateMaxWidth = function() {
        //calculates the max width of the game according to map size
        for (let row = 0; row < map.length; row++) {
          for (let column = 0; column < map[row].length; column++) {
            if (maxWidth < map[row].length * 32) {
              maxWidth = map[column].length * 32;
            }
          }
        }
    };


    // Main Game Loop
    this.startGame = function() {
        animationID = window.requestAnimationFrame(that.startGame);

        gameCanvas.clear(0, 0, maxWidth, height);

        if (instructionTick < 1000) {
            that.showInstructions(); //showing control instructions for few secs after game starts
            instructionTick++;
        }

        // DISPLAY MAPS

        // DISPLAY ELEMENTS

    

        mario.draw();
        // that.updateMario();
        // that.wallCollision();
        marioInGround = mario.grounded; //for use with flag sliding
    };


    // display instructions at top
    this.showInstructions = function() {
        gameCanvas.writeText('Controls: Arrow keys for movement, space for jump, ctrl for bullets', 30, 30);
        // gameCanvas.writeText('Tip: Jumping while running makes you jump higher', 30, 60);
    };


    // event listeners for key press
    that.addKeyPressEvents = function() {
        

        /// complete
    };


    // render maps
    this.renderMap = function() {


        /// complete
    };



    this.pauseGame = function() {
        window.cancelAnimationFrame(animationID);
    };
    
    // game over fns
    
    this.resetGame = function() {
        that.clearInstances();
        that.init(originalMaps, currentLevel);
    };
    
    this.clearInstances = function() {
        mario = null;
        element = null;
        gameSound = null;
    
        goombas = [];
        bullets = [];
        powerUps = [];
    };
    
    this.clearTimeOut = function() {
        clearTimeout(timeOutId);
    };
    
    this.removeGameScreen = function() {
        gameCanvas.hide();
    
        if (score) {
          score.hideScore();
        }
    };
    
    this.showGameScreen = function() {
        gameCanvas.show();
    };

}
  