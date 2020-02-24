//grid
	//0 - empty
	//1 - wall/block
	//2 - coin/star
	//3 - spawn
	//4 - exit/goal

// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutElastic (t, b, c, d) {
	var s=1.70158;var p=0;var a=c;
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (a < Math.abs(c)) { a=c; var s=p/4; }
	else var s = p/(2*Math.PI) * Math.asin (c/a);
	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
}

function easeInQuad(t, b, c, d) {
	return c*(t/=d)*t + b;
}

function easeOutQuad(t, b, c, d) {
	return -c *(t/=d)*(t-2) + b;
}

function checkLineIntersection(lineSegment,point,radius) {
	let lineA = lineSegment[0];
	let lineB = lineSegment[1];
	let segDirection = [lineB[0]-lineA[0],lineB[1]-lineA[1]];
	let segLength = Math.sqrt(segDirection[0]**2+segDirection[1]**2);
	let segNormal = [segDirection[0]/segLength,segDirection[1]/segLength];
	let lineAtoPoint = [point[0]-lineA[0],point[1]-lineA[1]];
	let toPointDist = lineAtoPoint[0]*segNormal[0]+lineAtoPoint[1]*segNormal[1];
	toPointDist = Math.min(Math.max(0,toPointDist),segLength);
	let projection = [segNormal[0]*toPointDist,segNormal[1]*toPointDist];
	let closestPoint = [lineA[0]+projection[0],lineA[1]+projection[1]];
	let collisionLength = Math.sqrt((point[0]-closestPoint[0])**2+(point[1]-closestPoint[1])**2);
	return collisionLength <= radius;
}

class GridBaseState {
	constructor(p) {
		this.grid = p;
	}
	update() {
		return this;
	}
	render() {
		let cellSize = this.grid.cellSize;
		let items = this.grid.items
		push();
		//render walls
		fill(color(10,10,10));
		for(var b in items.walls) {
			let wall = items.walls[b];
			//rect(wall[0]*cellSize,wall[1]*cellSize,cellSize,cellSize);
			image(assets.images[4],wall[0]*cellSize,wall[1]*cellSize,cellSize,cellSize);
		}
		//render coins
		fill(color(255,255,0));
		for(var b in items.coins) {
			let coin = items.coins[b];
			//circle(coin[0]*cellSize+cellSize/2,coin[1]*cellSize+cellSize/2,cellSize);
			image(assets.images[5],coin[0]*cellSize,coin[1]*cellSize,cellSize,cellSize);
		}
		//render spawn(s)
		fill(color(0,255,0));
		for(var b in items.spawn) {
			let spawn = items.spawn[b];
			//rect(spawn[0]*cellSize,spawn[1]*cellSize,cellSize,cellSize);
			image(assets.images[2],spawn[0]*cellSize,spawn[1]*cellSize,cellSize,cellSize);

		}
		//render goal(s)
		fill(color(0,0,255));
		for(var b in items.goal) {
			let goal = items.goal[b];
			//rect(goal[0]*cellSize,goal[1]*cellSize,cellSize,cellSize);
			image(assets.images[3],goal[0]*cellSize,goal[1]*cellSize,cellSize,cellSize);

		}
		pop();
	}
}

class GridSpawnState extends GridBaseState {
	constructor(p,spawnDuration) {
		super(p);
		this.duration = spawnDuration;
		this.timer = 0;
	}
	update() {
		if(frameRate() > 0) {
			this.timer += 1/frameRate();
		}
		if(this.timer >= this.duration) {
			return new GridBaseState(this.grid);
		}
		return this;
	}
	render() {
		push();
		//let yOffset = easeOutElastic(this.timer,0,height,this.duration);
		//let yOffset = easeInQuad(this.timer,0,height,this.duration);
		let yOffset = easeOutQuad(this.timer,0,height,this.duration);
		translate(0,-height+yOffset);
		super.render();
		pop();
	}
}

//grid [[...],[...],...];
//grid cells values:
	//1 - wall
	//2 - coin
	//3 - spawn point
	//4 - end point

class GameGrid {
	constructor(origin,gridArray,cellSize,spawnTime=.75) {
		this.grid = gridArray;
		this.cellSize = cellSize;
		this.items = {coins:[],walls:[],spawn:[],goal:[]};
		this.parseGrid();
		this.origin = origin;
		this.state = new GridSpawnState(this,spawnTime);
	}
	getWidth() {
		return this.cellSize*this.grid.length;
	}
	getHeight() {
		return this.cellSize*this.grid[0].length;
	}
	parseGrid() {
		for(var i=0; i<this.grid.length; i++) {
			for(var j=0; j<this.grid[0].length; j++) {
				switch(this.grid[i][j]) {
					case 3:
						this.items.walls.push([i,j]);
						break;
					case 2:
						this.items.coins.push([i,j]);
						break;
					case 1:
						this.items.spawn.push([i,j]);
						break;
					case 4:
						this.items.goal.push([i,j]);
						break;
				}
			}
		}
	}
	getSpawn() {
		return this.items.spawn[0];
	}
	getLineDistance(lineSegment,cirleCenter,circleRadius) {
		let point = lineSegment[1];
		return Math.sqrt((point[0]-cirleCenter[0])*(point[0]-cirleCenter[0])+(point[1]-cirleCenter[1])*(point[1]-cirleCenter[1]));
	}
	checkCircleHitbox(lineSegment,cirleCenter,circleRadius) {
		return this.getLineDistance(lineSegment,cirleCenter,circleRadius) <= circleRadius;
	}
	checkWallHitbox(lineSegment) {
		for(var i in this.items.walls) {
			let wall = this.items.walls[i];
			let wallCenter = [wall[0]*this.cellSize+this.cellSize/2,wall[1]*this.cellSize+this.cellSize/2];
			if(checkLineIntersection(lineSegment,wallCenter,this.cellSize/2-stroke_size)) {
				return true;
			}
		}
		return false;
	}
	checkSpawnHitbox(lineSegment) {
		for(var i in this.items.spawn) {
			let wall = this.items.spawn[i];
			let wallCenter = [wall[0]*this.cellSize+this.cellSize/2,wall[1]*this.cellSize+this.cellSize/2];
			if(checkLineIntersection(lineSegment,wallCenter,this.cellSize/2-stroke_size)) {
				return true;
			}
		}
		return false;
	}
	checkGoalHitbox(lineSegment) {
		for(var i in this.items.goal) {
			let wall = this.items.goal[i];
			let wallCenter = [wall[0]*this.cellSize+this.cellSize/2,wall[1]*this.cellSize+this.cellSize/2];
			if(checkLineIntersection(lineSegment,wallCenter,this.cellSize/2-stroke_size)) {
				return true;
			}
		}
		return false;
	}
	checkCoinHitbox(lineSegment) {
		let coinHit = false;
		let coinsCopy = [];
		for(var i in this.items.coins) {
			let coin = this.items.coins[i];
			let coinCenter = [coin[0]*this.cellSize+this.cellSize/2,coin[1]*this.cellSize+this.cellSize/2];
			if(checkLineIntersection(lineSegment,coinCenter,this.cellSize/2-stroke_size)) {
				score += 1;
				coinHit = true;
				assets.playSound(2);
			}
			else {
				coinsCopy.push(coin);
			}
		}
		this.items.coins = coinsCopy;
		return coinHit;		
	}
	update() {
		this.state = this.state.update();
	}
	render() {
		this.state.render();
	}

}