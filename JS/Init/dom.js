// interface to do basic DOM operations
let View = (function() {
    let instance;
  
    function View() {
        this.getMainWrapper = function() {
            let element = document.getElementsByClassName('main-wrapper')[0];
            return element;
        };

        this.create = function(elementName) {
            let element = document.createElement(elementName);
    
            return element;
        };

        this.addClass = function(element, className) {
            element.className = className;
        };
  
        this.append = function(parentElement, childElement) {
            //appends everything before the back button, score wrapper in top and everything else in between
            if (childElement.className == 'score-wrapper') {
            parentElement.insertBefore(childElement, parentElement.firstChild);
            } else if (parentElement.lastChild && parentElement.lastChild.className == 'btn-wrapper') {
            parentElement.insertBefore(childElement, parentElement.lastChild);
            } else {
            parentElement.appendChild(childElement);
            }
        };
  
        this.appendToBody = function(childElement) {
            document.body.appendChild(childElement);
        };
    
        this.remove = function(parentElement, childElement) {
            parentElement.removeChild(childElement);
        };
    
        this.removeFromBody = function(childElement) {
            document.body.removeChild(childElement);
        };
  
        //style = {display: 'block', position: 'absolute', ...}
        // fn to apply styles
        this.style = function(element, styles) {
            for (let property in styles) {
            element.style[property] = styles[property];
            }
        };

        this.setHTML = function(element, content) {
            element.innerHTML = content;
        };
    }
  
    return {
        getInstance: function() {
            if (instance == null) {
            instance = new View();
            }
            return instance;
        }
    };
})();


// interface to do canvas operations, so we don't have to get ctx again & again
let GameCanvas = (function() {
    let instance;
  
    function GameCanvas() {
        let canvas = document.getElementsByClassName('game-screen')[0];
        let ctx = canvas.getContext('2d');
    
        let that = this;
    
        this.setWidth = function(width) {
            canvas.width = width;
        };
    
        this.setHeight = function(height) {
            canvas.height = height;
        };
    
        this.getWidth = function() {
            return canvas.width;
        };
    
        this.getHeight = function() {
            return canvas.height;
        };
    
        this.getCanvas = function() {
            return canvas;
        };
  
        this.show = function() {
            canvas.style.display = 'block';
        };
    
        this.hide = function() {
            canvas.style.display = 'none';
        };
    
        this.clear = function(x, y, width, height) {
            ctx.clearRect(x, y, width, height);
        };
    
        // moving the game window
        this.scrollWindow = function(x, y) {
            ctx.translate(x, y);
        };
  
        // sx -> Sprite x coord
        // sy -> Sprite y coord
        this.draw = function(image, sx, sy, width, height, x, y, width, height) {
            ctx.drawImage(image, sx, sy, width, height, x, y, width, height);
        };
        
        // creates a black box on screen
        this.makeBox = function(x, y, width, height) {
            ctx.rect(x, y, width, height);
            ctx.fillStyle = 'black';
            ctx.fill();
        };
  
        this.writeText = function(text, x, y) {
            ctx.font = '20px SuperMario256';
            ctx.fillStyle = 'white';
            ctx.fillText(text, x, y);
        };
    }
  
    return {
        getInstance: function() {
            if (instance == null) {
            instance = new GameCanvas();
            }
            return instance;
        }
    };
})();
  
  