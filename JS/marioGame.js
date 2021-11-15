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
    let direction;
  
    //instances
    let mario;
    let element;
    let gameSound;
    let score;
  
    let goombas=[];
    let joombas=[];
    let powerUps=[];
    let bullets=[];
    let bullets2=[];
    let bulletFlag = false;
    let bullet2Flag = false;
    let joomba_bullets = [];
    let jb_ints = [];
    // let joomba_bulletsFlag = false;
    let keys=[];
  
    let currentLevel;

    let animationID, timeOutId;
    let tickCounter = 0; //for animating mario
    let maxTick = 25; //max number for ticks to show mario sprite
    let instructionTick = 0; //showing instructions counter
    let btick = 0;

    // preserving scope
    let that = this;


    this.init = function(levelMaps, level) {
        // height = (window.innerHeight*0.8); 
        height = 480;
        maxWidth = 0;
        viewPort = 1280;
        tileSize = 32;
        translatedDist = 0;
        goombas = [];
        joombas = [];
        powerUps = [];
        bullets = [];
        bullets2 = [];
        joomba_bullets = [];
    
        gameCanvas.setWidth(viewPort);
        gameCanvas.setHeight(height);
        gameCanvas.show();
    
        currentLevel = level;
        unparsedMaps = levelMaps;
        map = JSON.parse(levelMaps[currentLevel]);
    
        // score
        if (!score) {
            //so that when level changes, it uses the same instance
            score = new Score();
            score.init();
        }
        score.displayScore();
        score.updateLevelNum(currentLevel);
        
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

        // more components
        element = new Element();
        gameSound = new GameSound();
        gameSound.init();

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


    this.shootJoombaBullets = function(joomba){
      let bullet3 = new Bullet3();
      bullet3.init(joomba.x, joomba.y);
      joomba_bullets.push(bullet3);
    }

    // MAIN GAME LOOP
    this.startGame = function() {
        // causes the canvas to be redrawn at intervals to update the game screen !!!!!
        animationID = window.requestAnimationFrame(that.startGame);

        gameCanvas.clear(0, 0, maxWidth, height);

        if (instructionTick < 1000) {
            that.showInstructions(); //showing control instructions for few secs after game starts
            instructionTick++;
        }

        btick++;
        btick = btick%10;

        // DISPLAY MAPS
        that.renderMap();

        // DISPLAY ELEMENTS
        for (let i = 0; i < powerUps.length; i++) {
            powerUps[i].draw();
            powerUps[i].update();
        }

        for (let i = 0; i < bullets.length; i++) {
            bullets[i].draw();
            bullets[i].update();
        }

        for (let i = 0; i < bullets2.length; i++) {
            bullets2[i].draw();
            bullets2[i].update();
        }

        for (let i = 0; i < joomba_bullets.length; i++) {
            joomba_bullets[i].draw();
            joomba_bullets[i].update(); 
        }

        for (let i = 0; i < goombas.length; i++) {
            goombas[i].draw();
            goombas[i].update();
        }

        for (let i = 0; i < joombas.length; i++) {
            joombas[i].draw();
            joombas[i].update();
            
            if(animationID%100==0){
              that.shootJoombaBullets(joombas[i]);
            }
            
        }
      

        // COLLISION CHECKS
        that.checkPowerUpMarioCollision();
        that.checkBulletEnemyCollision();
        that.checkEnemyMarioCollision();
        that.checkEnemyBulletMarioCollision();

    
        mario.draw();
        that.updateMario();
        that.wallCollision();
        marioInGround = mario.grounded; //for use with flag sliding
    };


    this.showInstructions = function() {
        gameCanvas.writeText('Controls: Arrow keys for movement, space for jump, ctrl for bullets', 30, 30);
        // gameCanvas.writeText('Tip: Jumping while running makes you jump higher', 30, 60);
    };


    // event listeners for key press
    that.addKeyPressEvents = function() {
        //adds key to list of pressed keys when keydown event happens
        document.body.addEventListener('keydown', function(e) {
            keys[e.keyCode] = true;
        });
    
        document.body.addEventListener('keyup', function(e) {
            keys[e.keyCode] = false;
        });
    };


    // RENDER MAPS
    this.renderMap = function() {
        mario.grounded = false;

        for (let i = 0; i < powerUps.length; i++) {
            powerUps[i].grounded = false;
        }
        for (let i = 0; i < goombas.length; i++) {
            goombas[i].grounded = false;
        }
        for (let i = 0; i < joombas.length; i++) {
            joombas[i].grounded = false;
        }

        for (let row = 0; row < map.length; row++) {
            for (let column = 0; column < map[row].length; column++) {
                switch (map[row][column]) {
                    case 1: //platform
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.platform();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        that.checkElementPowerUpCollision(element);
                        that.checkElementEnemyCollision(element);
                        that.checkElementBulletCollision(element);
                        break;

                    case 2: //coinBox
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.coinBox();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        that.checkElementPowerUpCollision(element);
                        that.checkElementEnemyCollision(element);
                        that.checkElementBulletCollision(element);
                        break;

                    case 3: //powerUpBox
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.powerUpBox();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        that.checkElementPowerUpCollision(element);
                        that.checkElementEnemyCollision(element);
                        that.checkElementBulletCollision(element);
                        break;

                    case 4: //uselessBox
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.uselessBox();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        that.checkElementPowerUpCollision(element);
                        that.checkElementEnemyCollision(element);
                        that.checkElementBulletCollision(element);
                        break;

                    case 5: //flagPole
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.flagPole();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        break;

                    case 6: //flag
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.flag();
                        element.draw();
                        break;

                    case 7: //pipeLeft
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.pipeLeft();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        that.checkElementPowerUpCollision(element);
                        that.checkElementEnemyCollision(element);
                        that.checkElementBulletCollision(element);
                        break;

                    case 8: //pipeRight
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.pipeRight();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        that.checkElementPowerUpCollision(element);
                        that.checkElementEnemyCollision(element);
                        that.checkElementBulletCollision(element);
                        break;

                    case 9: //pipeTopLeft
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.pipeTopLeft();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        that.checkElementPowerUpCollision(element);
                        that.checkElementEnemyCollision(element);
                        that.checkElementBulletCollision(element);
                        break;

                    case 10: //pipeTopRight
                        element.x = column * tileSize;
                        element.y = row * tileSize;
                        element.pipeTopRight();
                        element.draw();

                        that.checkElementMarioCollision(element, row, column);
                        that.checkElementPowerUpCollision(element);
                        that.checkElementEnemyCollision(element);
                        that.checkElementBulletCollision(element);
                        break;

                    case 20: //goomba
                        let enemy = new Enemy();
                        enemy.x = column * tileSize;
                        enemy.y = row * tileSize;
                        enemy.goomba();
                        enemy.draw();

                        goombas.push(enemy);
                        map[row][column] = 0;
                        break;

                    case 21: 
                        let enemy2 = new Enemy2();
                        enemy2.x = column * tileSize;
                        enemy2.y = row * tileSize;
                        // enemy2.joomba();
                        enemy2.draw();

                        joombas.push(enemy2);
                        map[row][column] = 0;
                        break;
                }

                /// add one more enemy
            }
        }
    };


    // COLLISION CHECKS
    this.collisionCheck = function(objA, objB) {
        // aayush
        // get the vectors to check against
        let vX = objA.x + objA.width / 2 - (objB.x + objB.width / 2);
        let vY = objA.y + objA.height / 2 - (objB.y + objB.height / 2);

        // add the half widths and half heights of the objects
        let hWidths = objA.width / 2 + objB.width / 2;
        let hHeights = objA.height / 2 + objB.height / 2;
        let collisionDirection = null;

        // if the x and y vector are less than the half width or half height, then we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            // figures out on which side we are colliding (top, bottom, left, or right)
            let offsetX = hWidths - Math.abs(vX);
            let offsetY = hHeights - Math.abs(vY);

            if (offsetX >= offsetY) {
                if (vY > 0 && vY < 37) {
                collisionDirection = 't';
                    if (objB.type != 5) {
                        //if flagpole then pass through it
                        objA.y += offsetY;
                    }
                } 
                else if (vY < 0) {
                collisionDirection = 'b';
                    if (objB.type != 5) {
                        //if flagpole then pass through it
                        objA.y -= offsetY;
                    }
                }
            } 
            else {
                if (vX > 0) {
                    collisionDirection = 'l';
                    objA.x += offsetX;
                } 
                else {
                    collisionDirection = 'r';
                    objA.x -= offsetX;
                }
            }
        }
        return collisionDirection;
    }
   
    this.checkElementMarioCollision = function(element, row, column) {
        let collisionDirection = that.collisionCheck(mario, element);
    
        if (collisionDirection == 'l' || collisionDirection == 'r') {
          mario.velX = 0;
          mario.jumping = false;
    
          if (element.type == 5) {
            //flag pole
            that.levelFinish(collisionDirection);
          }
        } else if (collisionDirection == 'b') {
          if (element.type != 5) {
            //only if not flag pole
            mario.grounded = true;
            mario.jumping = false;
          }
        } else if (collisionDirection == 't') {
          if (element.type != 5) {
            mario.velY *= -1;
          }
    
          if (element.type == 3) {
            //PowerUp Box
            let powerUp = new PowerUp();
    
            //gives mushroom if mario is small, otherwise gives flower
            if (mario.type == 'small') {
              powerUp.mushroom(element.x, element.y);
              powerUps.push(powerUp);
            } else {
              powerUp.flower(element.x, element.y);
              powerUps.push(powerUp);
            }
    
            map[row][column] = 4; //sets to useless box after powerUp appears
    
            //sound when mushroom appears
            gameSound.play('powerUpAppear');
          }
    
          if (element.type == 11) {
            //Flower Box
            let powerUp = new PowerUp();
            powerUp.flower(element.x, element.y);
            powerUps.push(powerUp);
    
            map[row][column] = 4; //sets to useless box after powerUp appears
    
            //sound when flower appears
            gameSound.play('powerUpAppear');
          }
    
          if (element.type == 2) {
            //Coin Box
            score.coinScore++;
            score.totalScore += 100;
    
            score.updateCoinScore();
            score.updateTotalScore();
            map[row][column] = 4; //sets to useless box after coin appears
    
            //sound when coin block is hit
            gameSound.play('coin');
          }
        }
    };
    
    this.checkElementPowerUpCollision = function(element) {
        for (let i = 0; i < powerUps.length; i++) {
          let collisionDirection = that.collisionCheck(powerUps[i], element);
    
          if (collisionDirection == 'l' || collisionDirection == 'r') {
            powerUps[i].velX *= -1; //change direction if collision with any element from the sidr
          } else if (collisionDirection == 'b') {
            powerUps[i].grounded = true;
          }
        }
    };
    
    this.checkElementEnemyCollision = function(element) {
        for (let i = 0; i < goombas.length; i++) {
          if (goombas[i].state != 'deadFromBullet') {
            //so that goombas fall from the map when dead from bullet
            let collisionDirection = that.collisionCheck(goombas[i], element);
    
            if (collisionDirection == 'l' || collisionDirection == 'r') {
              goombas[i].velX *= -1;
            } else if (collisionDirection == 'b') {
              goombas[i].grounded = true;
            }
          }
        }
        // similarly for joombas
        for (let i = 0; i < joombas.length; i++) {
          if (joombas[i].state != 'deadFromBullet') {
            let collisionDirection = that.collisionCheck(joombas[i], element);
    
            if (collisionDirection == 'l' || collisionDirection == 'r') {
              joombas[i].velX *= -1;
            } else if (collisionDirection == 'b') {
              joombas[i].grounded = true;
            }
          }
        }
    };
    
    this.checkElementBulletCollision = function(element) {
        for (let i = 0; i < bullets.length; i++) {
          let collisionDirection = that.collisionCheck(bullets[i], element);
    
          if (collisionDirection == 'b') {
            //if collision is from bottom of the bullet, it is grounded, so that it can be bounced
            bullets[i].grounded = true;
          } else if (collisionDirection == 't' || collisionDirection == 'l' || collisionDirection == 'r') {
            bullets.splice(i, 1);
          }
        }
        for (let i = 0; i < bullets2.length; i++) {
          let collisionDirection = that.collisionCheck(bullets2[i], element);
    
          if (collisionDirection == 'b') {
            bullets2[i].grounded = true;
          } else if (collisionDirection == 't' || collisionDirection == 'l' || collisionDirection == 'r') {
            bullets2.splice(i, 1);
          }
        }
    };
    
    this.checkPowerUpMarioCollision = function() {
        for (let i = 0; i < powerUps.length; i++) {
          let collWithMario = that.collisionCheck(powerUps[i], mario);
          if (collWithMario) {
            if (powerUps[i].type == 30 && mario.type == 'small') {
              //mushroom
              mario.type = 'big';
            } else if (powerUps[i].type == 31) {
              //flower
              mario.type = 'fire';
            }
            powerUps.splice(i, 1);
    
            score.totalScore += 1000;
            score.updateTotalScore();
    
            //sound when mushroom appears
            gameSound.play('powerUp');
          }
        }
    };
    
    this.checkEnemyMarioCollision = function() {
        let collWithMario;
        for (let i = 0; i < goombas.length; i++) {
          if (!mario.invulnerable && goombas[i].state != 'dead' && goombas[i].state != 'deadFromBullet') {
            //if mario is invulnerable or goombas state is dead, collision doesnt occur
            collWithMario = that.collisionCheck(goombas[i], mario);
    
            if (collWithMario == 't') {
              //kill goombas if collision is from top
              goombas[i].state = 'dead';
    
              mario.velY = -mario.speed;
    
              score.totalScore += 1000;
              score.updateTotalScore();
    
              //sound when enemy dies
              gameSound.play('killEnemy');
            } else if (collWithMario == 'r' || collWithMario == 'l' || collWithMario == 'b') {
              goombas[i].velX *= -1;
    
              if (mario.type == 'big') {
                mario.type = 'small';
                mario.invulnerable = true;
                collWithMario = undefined;
    
                //sound when mario powerDowns
                gameSound.play('powerDown');
    
                setTimeout(function() {
                  mario.invulnerable = false;
                }, 1000);
              } else if (mario.type == 'fire') {
                mario.type = 'big';
                mario.invulnerable = true;
    
                collWithMario = undefined;
    
                //sound when mario powerDowns
                gameSound.play('powerDown');
    
                setTimeout(function() {
                  mario.invulnerable = false;
                }, 1000);
              } else if (mario.type == 'small') {
                //kill mario if collision occurs when he is small
                that.pauseGame();
    
                mario.frame = 13;
                collWithMario = undefined;
    
                score.lifeCount--;
                score.updateLifeCount();
    
                //sound when mario dies
                gameSound.play('marioDie');
    
                timeOutId = setTimeout(function() {
                  if (score.lifeCount == 0) {
                    that.gameOver();
                  } else {
                    that.resetGame();
                  }
                }, 3000);
                break;
              }
            }
          }
        }
    };

    this.checkEnemyBulletMarioCollision = function() {
      let collWithMario;
      for (let i = 0; i < joomba_bullets.length; i++) {
        if (!mario.invulnerable) {
          //if mario is invulnerable or goombas state is dead, collision doesnt occur
          collWithMario = that.collisionCheck(joomba_bullets[i], mario);
  
          if (collWithMario == 'r' || collWithMario == 'l' || collWithMario == 'b') {  
            if (mario.type == 'big') {
              mario.type = 'small';
              mario.invulnerable = true;
              collWithMario = undefined;
  
              //sound when mario powerDowns
              gameSound.play('powerDown');
  
              setTimeout(function() {
                mario.invulnerable = false;
              }, 1000);
            } 
            else if (mario.type == 'fire') {
              mario.type = 'big';
              mario.invulnerable = true;
  
              collWithMario = undefined;
  
              //sound when mario powerDowns
              gameSound.play('powerDown');
  
              setTimeout(function() {
                mario.invulnerable = false;
              }, 1000);
            } 
            else if (mario.type == 'small') {
              //kill mario if collision occurs when he is small
              that.pauseGame();
  
              mario.frame = 13;
              collWithMario = undefined;
  
              score.lifeCount--;
              score.updateLifeCount();
  
              //sound when mario dies
              gameSound.play('marioDie');
  
              timeOutId = setTimeout(function() {
                if (score.lifeCount == 0) {
                  that.gameOver();
                } else {
                  that.resetGame();
                }
              }, 3000);
              break;
            }
          }
        }
      }
  };
    
    this.bulletCollisionCheck = function(enemies, bullets){
        let collWithBullet;
        for (let i = 0; i < enemies.length; i++) {
          for (let j = 0; j < bullets.length; j++) {
            if (enemies[i] && enemies[i].state != 'dead') {
              collWithBullet = that.collisionCheck(enemies[i], bullets[j]);
            }
    
            if (collWithBullet) {
              bullets[j] = null;
              bullets.splice(j, 1);
    
              enemies[i].state = 'deadFromBullet';
    
              score.totalScore += 1000;
              score.updateTotalScore();
    
              //sound when enemy dies
              gameSound.play('killEnemy');
            }
          }
        }
    };

    this.checkBulletEnemyCollision = function() {
        that.bulletCollisionCheck(goombas, bullets);
        that.bulletCollisionCheck(goombas, bullets2);
        that.bulletCollisionCheck(joombas, bullets);
        that.bulletCollisionCheck(joombas, bullets2);
        // let collWithBullet;
        // for (let i = 0; i < goombas.length; i++) {
        //   for (let j = 0; j < bullets.length; j++) {
        //     if (goombas[i] && goombas[i].state != 'dead') {
        //       //check for collision only if goombas exist and is not dead
        //       collWithBullet = that.collisionCheck(goombas[i], bullets[j]);
        //     }
    
        //     if (collWithBullet) {
        //       bullets[j] = null;
        //       bullets.splice(j, 1);
    
        //       goombas[i].state = 'deadFromBullet';
    
        //       score.totalScore += 1000;
        //       score.updateTotalScore();
    
        //       //sound when enemy dies
        //       gameSound.play('killEnemy');
        //     }
        //   }
        // }
    };
    
    this.wallCollision = function() {
        //for walls (vieport walls)
        if (mario.x >= maxWidth - mario.width) {
          mario.x = maxWidth - mario.width;
        } else if (mario.x <= translatedDist) {
          mario.x = translatedDist + 1;
        }
    
        //for ground (viewport ground)
        if (mario.y >= height) {
          that.pauseGame();
    
          //sound when mario dies
          gameSound.play('marioDie');
    
          score.lifeCount--;
          score.updateLifeCount();
    
          timeOutId = setTimeout(function() {
            if (score.lifeCount == 0) {
              that.gameOver();
            } else {
              that.resetGame();
            }
          }, 3000);
        }
    };
    
    // MARIO MOVEMENT with key events
    this.updateMario = function() {
        let friction = 0.9;
        let gravity = 0.2;
    
        mario.checkMarioType();

        if(keys[32]){
          // jump from space bar
          if (!mario.jumping && mario.grounded) {
            mario.jumping = true;
            mario.grounded = false;
            mario.velY = -(mario.speed / 2 + 5.5);
    
            // mario sprite position
            if (mario.frame == 0 || mario.frame == 1) {
              mario.frame = 3; //right jump
            } else if (mario.frame == 8 || mario.frame == 9) {
              mario.frame = 2; //left jump
            }
    
            //sound when mario jumps
            gameSound.play('jump');
          }
        }
    
        if (keys[38]) {
          //up arrow
          // fire upward bullet

          ////// check!
          if (!bullet2Flag) {
            bullet2Flag = true;
            var bullet2 = new Bullet2();

            bullet2.init(mario.x, mario.y);
            bullets2.push(bullet2);

            //bullet sound
            gameSound.play('bullet');

            setTimeout(function() {
              bullet2Flag = false; //only lets mario fire bullet after 500ms
            }, 500);
          }
        }
    
        if (keys[39]) {
          //right arrow
          that.checkMarioPos(); //if mario goes to the center of the screen, sidescroll the map
    
          if (mario.velX < mario.speed) {
            mario.velX++;
          }
    
          //mario sprite position
          if (!mario.jumping) {
            tickCounter += 1;
    
            if (tickCounter > maxTick / mario.speed) {
              tickCounter = 0;
    
              if (mario.frame != 1) {
                mario.frame = 1;
              } else {
                mario.frame = 0;
              }
            }
          }
        }
    
        if (keys[37]) {
          //left arrow
          that.checkMarioPos2();

          if (mario.velX > -mario.speed) {
            mario.velX--;
          }
    
          //mario sprite position
          if (!mario.jumping) {
            tickCounter += 1;
    
            if (tickCounter > maxTick / mario.speed) {
              tickCounter = 0;
    
              if (mario.frame != 9) {
                mario.frame = 9;
              } else {
                mario.frame = 8;
              }
            }
          }
        }
    
        if (keys[16]) {
          //shift key
          mario.speed = 4.5;
        } else {
          mario.speed = 3;
        }
    
        if (keys[17] && mario.type == 'fire') {
          //ctrl key
          if (!bulletFlag) {
            bulletFlag = true;
            let bullet = new Bullet();
            if (mario.frame == 9 || mario.frame == 8 || mario.frame == 2) {
                direction = -1;
            } else {
                direction = 1;
            }
            bullet.init(mario.x, mario.y, direction);
            bullets.push(bullet);
    
            //bullet sound
            gameSound.play('bullet');
    
            setTimeout(function() {
              bulletFlag = false; //only lets mario fire bullet after 500ms
            }, 500);
          }
        }
    
        //velocity 0 sprite position
        if (mario.velX > 0 && mario.velX < 1 && !mario.jumping) {
          mario.frame = 0;
        } else if (mario.velX > -1 && mario.velX < 0 && !mario.jumping) {
          mario.frame = 8;
        }
    
        if (mario.grounded) {
          mario.velY = 0;
    
          //grounded sprite position
          if (mario.frame == 3) {
            mario.frame = 0; //looking right
          } else if (mario.frame == 2) {
            mario.frame = 8; //looking left
          }
        }
    
        //change mario position
        mario.velX *= friction;
        mario.velY += gravity;
    
        mario.x += mario.velX;
        mario.y += mario.velY;
    };
    
    this.checkMarioPos = function() {
        centerPos = translatedDist + viewPort / 2;
    
        //side scrolling as mario reaches center of the viewPort
        if (mario.x > centerPos && centerPos + viewPort / 2 < maxWidth) {
          gameCanvas.scrollWindow(-mario.speed, 0);
          translatedDist += mario.speed;
        }
    };
    this.checkMarioPos2 = function() {
        centerPos = translatedDist + viewPort / 2;

        console.log(mario.speed);
        if (mario.x < centerPos && centerPos - viewPort / 2 > 0) {
            gameCanvas.scrollWindow(mario.speed, 0);
            translatedDist -= mario.speed;
        }
    }
    

    // interrupt/ end game fns
    this.pauseGame = function() {
        window.cancelAnimationFrame(animationID);
    };
    
    // game over, level complete functions
    this.levelFinish = function(collisionDirection) {
      //game finishes when mario slides the flagPole and collides with the ground
      if (collisionDirection == 'r') {
        mario.x += 10;
        mario.velY = 2;
        mario.frame = 11;
      } 
      else if (collisionDirection == 'l') {
        mario.x -= 32;
        mario.velY = 2;
        mario.frame = 10;
      }
  
      if (marioInGround) {
        mario.x += 20;
        mario.frame = 10;
        tickCounter += 1;
        if (tickCounter > maxTick) {
          that.pauseGame();
  
          mario.x += 10;
          tickCounter = 0;
          mario.frame = 12;
  
          //sound when stage clears
          gameSound.play('stageClear');
  
          timeOutId = setTimeout(function() {
            currentLevel++;
            if (unparsedMaps[currentLevel]) {
              that.init(unparsedMaps, currentLevel);
              score.updateLevelNum(currentLevel);
            } else {
              that.gameOver();
            }
          }, 5000);
        }
      }
    };

    this.gameOver = function() {
      score.gameOverView();
      gameCanvas.makeBox(0, 0, maxWidth, height);
      gameCanvas.writeText('Game Over :)', centerPos - 80, height - 300);
      gameCanvas.writeText('Thanks For playing ...', centerPos - 122, height / 2);
    };
    
    this.resetGame = function() {
        that.clearInstances();
        that.init(unparsedMaps, currentLevel);
    };
    
    this.clearInstances = function() {
        mario = null;
        element = null;
        gameSound = null;
    
        goombas = [];
        joombas = [];
        bullets = [];
        joomba_bullets = [];
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
  