class PlayerBridge {
	constructor(origin, baseLength, strokeSize) {
		this.points = [origin];
		this.baseLength = baseLength;
		this.strokeSize = strokeSize;
		this.cursorAngle = 0;
		this.recentPoints = [];
	}
	//rotateAmount - num of angles to rotate cursor by - per second
	update(rotateAmount) {
		this.rotate(rotateAmount);
	}
	rotate(amount) {
		if(frameRate() > 0) {
			this.cursorAngle = (this.cursorAngle + amount*1/frameRate()) % 360;
		}
	}
	addLines(lineCount=1) {
        soundController.playSound(0);
		recentPoints = [this.points[this.points.length-1]];
		let curX = Math.cos(this.cursorAngle);
		let curY = Math.sin(this.cursorAngle);
		let prevPoint = this.points[this.points.length-1];
		this.points.push([prevPoint[0]+curX*this.baseLength*lineCount, prevPoint[1]+curY*this.baseLength*lineCount]);
		recentPoints.push(this.points[this.points.length-1]);
		this.recentPoints = recentPoints;
	}
	checkLines() {
		//can't intersect with < 3 lines
		if(this.points.length < 3) {
			return false;
		}
		//last line added
		let currLine = [this.points[this.points.length-1],this.points[this.points.length-2]];
		//skip the second newest line - can't intsersect by definition
		for(var i=this.points.length-3;i>0;i--) {
			let nextLine = [this.points[i],this.points[i-1]];
			if(checkIntersection(currLine,nextLine)) {
				return true;
			}
		}
		return false;
	}
	getCursorPosition() {
		let curX = Math.cos(this.cursorAngle);
		let curY = Math.sin(this.cursorAngle);
		let prevPoint = this.points[this.points.length-1];
		return([prevPoint[0]+curX*this.baseLength,prevPoint[1]+curY*this.baseLength]); 
	}
	render(cropLine=false) {
		const VCC = Koji.config.gameScene;
		const STROKE_WEIGHT = this.strokeSize;
		push();
		stroke(VCC.lineColor);
		fill(VCC.lineColor);
		strokeWeight(STROKE_WEIGHT);
		//draw previous lines
		for(var i=0; i<this.points.length-1; i++) {
			let p1 = this.points[i];
			let p2 = this.points[i+1];
			line(p1[0],p1[1],p2[0],p2[1]);
			circle(p1[0],p1[1],STROKE_WEIGHT);

		}
		//draw line to cursor
		let cursorPos = this.getCursorPosition();
		let curX = Math.cos(this.cursorAngle);
		let curY = Math.sin(this.cursorAngle);
		let prevPoint = this.points[this.points.length-1];
		if(!cropLine) {
			line(prevPoint[0],prevPoint[1],cursorPos[0],cursorPos[1]); 
		}
        //draw last circle
        circle(prevPoint[0],prevPoint[1],STROKE_WEIGHT);
		pop();
	}
}