//a circular button
class HoverButton {
	constructor(origin,buttonRadius,hitboxRadius,baseImage,baseColor,clickCallback,hoverImage=null,hoverColor=null) {
		this.origin = origin;
		this.buttonRadius = buttonRadius;
		this.hitboxRadius = hitboxRadius;
		this.baseImage = baseImage;
		this.baseColor = baseColor;
		this.callback = clickCallback;
		this.hoverImage = hoverImage == null ? this.baseImage : hoverImage;
		this.hoverColor = hoverColor == null ? this.baseColor : hoverColor;
	}
	checkHover() {
		let dist = (this.origin[0]-mouseX)*(this.origin[0]-mouseX)+(this.origin[1]-mouseY)*(this.origin[1]-mouseY);
		return dist <= this.hitboxRadius*this.hitboxRadius;
	}
	handleClick() {
		if(this.checkHover()) {
			this.callback();
			return true;
		}
		return false;
	}
	render() {
		let hovered = this.checkHover();
		push();
		colorMode(HSL);
		fill(hovered ? this.hoverColor : this.baseColor);
		let padding = this.buttonRadius * .1;
		let buttonCorner = [this.origin[0]-this.buttonRadius+padding,this.origin[1]-this.buttonRadius+padding];
		circle(this.origin[0],this.origin[1],this.buttonRadius*2);
        imageMode(CENTER);
        if(this.hoverImage !== null) {
		    image((hovered ? this.baseImage : this.hoverImage),this.origin[0],this.origin[1],this.buttonRadius-padding,this.buttonRadius-padding);
        }
		pop();
	}
}

class SoundButton extends HoverButton {
	constructor(origin,buttonRadius,hitboxRadius,baseImage,baseColor,clickCallback,hoverImage=null,hoverColor=null) {
        super(origin,buttonRadius,hitboxRadius,baseImage,baseColor,clickCallback,hoverImage,hoverColor);
    }
    render() {
        let hovered = this.checkHover();
        let padding = this.buttonRadius * .1;
        push();
        let img = sessionStorage.getItem('isMuted') == 'false' ? this.baseImage : this.hoverImage;
        colorMode(HSL);
        fill(hovered ? this.hoverColor : this.baseColor);
        circle(this.origin[0],this.origin[1],this.buttonRadius*2);
        imageMode(CENTER);
        image(img,this.origin[0],this.origin[1],this.buttonRadius-padding,this.buttonRadius-padding);
        pop();
    }
}