function Loader() {
    let view = View.getInstance();
  
    let loadingPercentage;
  
    let imageSources;
    let soundSources;
  
    let that = this;
  
    this.init = function() {
      loadingPercentage = view.create('div');
  
      view.addClass(loadingPercentage, 'loading-percentage');
      view.setHTML(loadingPercentage, '0%');
      view.appendToBody(loadingPercentage);
  
      imageSources = {
        1: 'images/back-btn.png',
        2: 'images/bg.png',
        3: 'images/bullet.png',
        4: 'images/coin.png', //5
        5: 'images/elements.png', //8
        6: 'images/enemies.png', //9
        7: 'images/flag-pole.png', //10
        8: 'images/flag.png', //11
        9: 'images/start-screen.png', //12
        10: 'images/mario-head.png', //18
        11: 'images/mario-sprites.png', //19
        12: 'images/powerups.png', //20
        13: 'images/start-btn.png' //25
      };
  
      that.loadImages(imageSources);
    };
  
    this.loadImages = function(imageSources) {
        let images = {};
        let loadedImages = 0;
        let totalImages = 0;
    
        for (let key in imageSources) {
        totalImages++;
        }
  
        for (let key in imageSources) {
            images[key] = new Image();
            images[key].src = imageSources[key];
    
            images[key].onload = function() {
                loadedImages++;
                percentage = Math.floor(loadedImages * 100 / totalImages);
                console.log(percentage);
        
                view.setHTML(loadingPercentage, percentage + '%'); //displaying percentage
        
                if (loadedImages >= totalImages) {
                    setTimeout(() => {
                        view.removeFromBody(loadingPercentage);
                        that.initMainGame();
                    }, 1000);
                }
            };
        }
    };
  
    this.initMainGame = function() {
        let marioInitInstance = MarioInit.getInstance();
        marioInitInstance.init();
        // console.log("here");
    };
}
  
window.onload = function(){
    let loader = new Loader();
    loader.init(); 
}

