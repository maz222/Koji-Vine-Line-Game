function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0)
    h = 0;
    else if (cmax == r)
    h = ((g - b) / delta) % 6;
    else if (cmax == g)
    h = (b - r) / delta + 2;
    else
    h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
    h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return [h,s,l];
}

class GameBaseState {
	constructor(bridge,grid) {
		this.bridge = bridge;
		this.grid = grid;
		this.failed = false;
		this.won = false;
		const VCC = Koji.config.gameScene;
    	let buttonColor = color(100);
    	let buttonHoverColor = color(120);
    	let singleCallback = () => {this.bridge.addLines(1)};
    	let doubleCallback = () => {this.bridge.addLines(2)};
    	let trippleCallback = () => {this.bridge.addLines(3)};
    	let buttonY = height -  (height*.2/2);
    	let buttonX = width > 800 ? (width-800)/2 : 0;
    	let colWidth = Math.min(800,width);

    	let singleColor = hexToHSL(VCC.singleLine.backgroundColor);
    	let singleHover = hexToHSL(VCC.singleLine.backgroundColor);
    	singleHover[2] = Math.max(0,singleHover[2]-20);
    	let singleImage = assets.images[6];
		this.singleButton = new HoverButton([buttonX+(colWidth/4),buttonY],30,50,singleImage,singleColor,singleCallback,singleImage,singleHover);

		let doubleColor = hexToHSL(VCC.doubleLine.backgroundColor);
		let doubleHover = hexToHSL(VCC.doubleLine.backgroundColor);
		doubleHover[2] = Math.max(0,doubleHover[2]-20);
		let doubleImage = assets.images[7];
		this.doubleButton = new HoverButton([buttonX+(colWidth/4*2),buttonY],30,50,doubleImage,doubleColor,doubleCallback,doubleImage,doubleHover);

		let trippleColor = hexToHSL(VCC.trippleLine.backgroundColor);
		let trippleHover = hexToHSL(VCC.trippleLine.backgroundColor);
		trippleHover[2] = Math.max(0,trippleHover[2]-20);
		let trippleImage = assets.images[8];
		this.trippleButton = new HoverButton([buttonX+(colWidth/4*3),buttonY],30,50,trippleImage,trippleColor,trippleCallback,trippleImage,trippleHover);
	}
	update() {
		this.bridge.update(5);
		this.grid.update();

		//check rotating line
		let segment = [this.bridge.points[this.bridge.points.length-1],this.bridge.getCursorPosition()];
		this.grid.checkCoinHitbox(segment);
		if(this.grid.checkGoalHitbox(segment)) {
			return new GameWinState(this.bridge,this.grid,.5);
		}
		
		if(this.failed || 
			(this.checkFailState([this.bridge.points[this.bridge.points.length-1],this.bridge.getCursorPosition()])) && this.bridge.points.length > 1) {
			return new GameFailState(this.bridge,this.grid,.5);
		}
		return this;
	}
	handleClick() {
		if(this.singleButton.handleClick() || this.doubleButton.handleClick() || this.trippleButton.handleClick()) {
			this.failed = this.checkFailState(this.bridge.recentPoints);
			this.checkCoins();
			this.won = this.checkWinState();
		}
	}
	checkFailState(recentPoints) {
		//check if out of bounds
		if(this.bridge.points.length > 1) {
			for(var i in recentPoints) {
				let p = recentPoints[i];
				if(p[0] < 0 || p[0] > this.grid.getWidth()) {
					console.log(this.grid.origin);
					console.log(p);
					return true;
				}
				if(p[1] > this.grid.getHeight() || p[1] < 0) {
					console.log(this.grid.origin);
					console.log(p);
					return true;
				}
			}
		}
		//check walls
		for(var i=0; i<recentPoints.length-1; i++) {
			let segment = [recentPoints[i],recentPoints[i+1]];
			if(this.grid.checkWallHitbox(segment)) {
				return true;
			}
		}
		//check spawn
		//don't check first line - will already be in spawn
			//only game over if future lines hit spawn
		if(this.bridge.points.length > 2) {
			for(var i=0; i<recentPoints.length-1; i++) {
				let segment = [recentPoints[i],recentPoints[i+1]];
				if(this.grid.checkSpawnHitbox(segment)) {
					return true;
				}
			}
		}
		//check line bridge overlap
		return false;
	}
	checkWinState() {
		let recentPoints = this.bridge.recentPoints;
		for(var i=0; i<recentPoints.length-1; i++) {
			let segment = [recentPoints[i],recentPoints[i+1]];
			let goalHit = this.grid.checkGoalHitbox(segment);
			console.log(goalHit);
			if(goalHit) {
				return true;
			}
		}
		return false;
	}
	checkCoins() {
		//check coins
		let recentPoints = this.bridge.recentPoints;
		for(var i=0; i<recentPoints.length-1; i++) {
			let segment = [recentPoints[i],recentPoints[i+1]];
			if(this.grid.checkCoinHitbox(segment)) {
				return true;
			}
		}
		return false;
	}
	checkWinState() {
		//check goal
        let recentPoints = this.bridge.recentPoints;
        for(var i=0; i<recentPoints.length-1; i++) {
            let segment = [recentPoints[i],recentPoints[i+1]];
            if(this.grid.checkGoalHitbox(segment)) {
                return true;
            }
        }
		return false;
	}
	render() {
		let VCC = Koji.config.gameScene;
		let griddArr = this.grid.grid;
	    push();
	    //draw level
	    //offset/center level
	    translate((width-gridArr.length*this.grid.cellSize)/2,(height-gridArr[0].length*this.grid.cellSize)/2);
	    //background
	    push();
	    fill(VCC.levelBackground.backgroundColor);
	    rect(0,0,griddArr.length*this.grid.cellSize,griddArr[0].length*this.grid.cellSize);
	    if(assets.images[1] !== null) {
	    	image(assets.images[1],0,0,griddArr.length*this.grid.cellSize,griddArr[0].length*this.grid.cellSize);
	    }
	    pop();
	    grid.render();
	    bridge.render();
	    pop();	
	}
	renderButtons() {
		this.singleButton.render();
	    this.doubleButton.render();
	    this.trippleButton.render();	
	}
}

class GameSpawnState extends GameBaseState {
	constructor(bridge,grid,spawnTime) {
		super(bridge,grid);
		this.spawnTime = spawnTime;
		this.timer = 0;
	}
	update() {
		if(frameRate() > 1) {
			this.timer += 1/frameRate();
		}
		this.grid.update();
		if(this.timer >= this.spawnTime) {
			return new GameBaseState(this.bridge,this.grid);
		}
		return this;
	}
	handleClick() {
		return;
	}
	render() {
		let VCC = Koji.config.gameScene;	
		let gridArr = this.grid.grid;
	    push();
	    //offset/center level
	    translate((width-gridArr.length*this.grid.cellSize)/2,(height-gridArr[0].length*this.grid.cellSize)/2); 
	    push();
	    fill(VCC.levelBackground.backgroundColor);
	    rect(0,0,gridArr.length*this.grid.cellSize,gridArr[0].length*this.grid.cellSize);
	    if(assets.images[1] !== null) {
	    	image(assets.images[1],0,0,gridArr.length*this.grid.cellSize,gridArr[0].length*this.grid.cellSize);
	    }
	    pop();
		let yOffset = easeOutQuad(this.timer,0,gridArr[0].length*this.grid.cellSize,this.spawnTime);
		translate(0,gridArr[0].length*this.grid.cellSize-yOffset);
	    grid.render();
	    //bridge.render();
	    pop();
	}
}

function easeOutQuad(t, b, c, d) {
	return -c *(t/=d)*(t-2) + b;
}

const FALL_DELAY = .15;
class GameFailState extends GameBaseState {
	constructor(bridge,grid,fallTime) {
		super(bridge,grid);
		this.fallTime = fallTime;
		this.timer = 0;
        let gridArr = this.grid.grid;
        this.maxHeight = gridArr[0].length*this.grid.cellSize + bridge.baseLength*3;
		soundController.playSound(2);
	}
	update() {
		if(frameRate() > 1) {
			this.timer += 1/frameRate();
		}
		this.grid.update();
		if(this.timer >= this.fallTime + FALL_DELAY) {
			soundController.mute();
			window.setAppView('gameLoss');
			return this;
		}
		else {
			return this;
		}	
	}
	render() {
		let VCC = Koji.config.gameScene;
		let griddArr = this.grid.grid;
	    push();
	    //offset/center level
	    translate((width-gridArr.length*this.grid.cellSize)/2,(height-gridArr[0].length*this.grid.cellSize)/2); 
	    push();
	    fill(VCC.failColor);
	    rect(0,0,griddArr.length*this.grid.cellSize,griddArr[0].length*this.grid.cellSize);
	    pop();
	    push();
	    let yOffset = 0;
	    if(this.timer > FALL_DELAY) {
	    	yOffset = easeOutQuad(this.timer-FALL_DELAY,0,this.maxHeight,this.fallTime);
		}
        console.log(yOffset);
		translate(0,yOffset);
	    bridge.render();
	    pop();
	    pop();
	}
}

class GameWinState extends GameBaseState {
	constructor(bridge,grid,fallTime) {
		super(bridge,grid);
		this.fallTime = fallTime;
		this.timer = 0;
        this.maxHeight = gridArr[0].length*this.grid.cellSize;

		//add score
		let scores = JSON.parse(localStorage.getItem('scores'));
        if(scores == null) {
            scores = {};
        }
		let level = localStorage.getItem('currentLevel');
        let tScore = scores[level] == undefined ? score : Math.max(score,scores[level]);
        scores[level] = tScore;
        localStorage.setItem('scores',JSON.stringify(scores));

		soundController.playSound(3);
	}
	update() {
		if(frameRate() > 1) {
			this.timer += 1/frameRate();
		}
		this.grid.update();
		if(this.timer >= this.fallTime) {
			soundController.mute();
			window.setAppView('gameWin')
			return this;
		}
		else {
			return this;
		}		
	}
	render() {
		let VCC = Koji.config.gameScene;
		let griddArr = this.grid.grid;
	    push();
	    //offset/center level
	    translate((width-gridArr.length*this.grid.cellSize)/2,(height-gridArr[0].length*this.grid.cellSize)/2);
	    push();
	    fill(VCC.winColor);
	    rect(0,0,griddArr.length*this.grid.cellSize,griddArr[0].length*this.grid.cellSize);
	    pop();
	    bridge.render(true);
	    push();
	    let yOffset = easeOutQuad(this.timer,0,this.maxHeight,this.fallTime);
		translate(0,yOffset);
	    grid.render();
	    pop();
        pop();	
	}
}