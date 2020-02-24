class AssetManager {
	constructor() {
		this.images = [];
		this.sounds = [];
		this.loadCount = 0;
        userStartAudio();
	}
    startLoad() {
        this.loadImages();
        this.loadSounds();
    }
	isLoading() {
		return this.loadCount > 0;
	}
	queueImage(imgUrl) {
		if(imgUrl != "" && imgUrl !== undefined) {
			this.images.push(loadImage(imgUrl, () => this.finishLoad()));
			this.loadCount = this.loadCount + 1;
		}
		else {
			this.images.push(null);
		}
	}
	queueSound(soundUrl) {
		if(soundUrl != "" && soundUrl !== undefined) {
			this.sounds.push(loadSound(soundUrl,() => this.finishLoad()));
			this.loadCount += 1;
		}
		else {
			this.sounds.push(null);
		}
	}
	finishLoad() {
		this.loadCount = this.loadCount - 1;
	}
	loadImages() {
		let VCC = Koji.config.gameScene;
		this.queueImage(VCC.pageBackground.backgroundImage);
		this.queueImage(VCC.levelBackground.backgroundImage);
		this.queueImage(VCC.entrance);
		this.queueImage(VCC.exit);
		this.queueImage(VCC.wall);
		this.queueImage(VCC.coin);
		this.queueImage(VCC.singleLine.buttonImage);
		this.queueImage(VCC.doubleLine.buttonImage);
		this.queueImage(VCC.trippleLine.buttonImage);
		this.queueImage(VCC.backButton.buttonImage);
		this.queueImage(VCC.soundButton.onImage);
		this.queueImage(VCC.soundButton.offImage);
	}
	loadSounds() {
		let VCC = Koji.config.sounds;
		this.queueSound(VCC.music);
		this.queueSound(VCC.addLine);
		this.queueSound(VCC.getCoin);
		this.queueSound(VCC.levelFail);
		this.queueSound(VCC.levelClear);
	}
	toggleMute() {
		if(localStorage.getItem('isMuted') == 'true') {
			localStorage.setItem('isMuted',false);
			if(this.sounds[0] != null) {
				this.playMusic();
			}
		}
		else {
			localStorage.setItem('isMuted',true);
			for(var i=0;i<this.sounds.length;i++) {
				if(this.sounds[i] != null) {
					this.sounds[i].stop();
				}
			}
		}
	}
	stopMusic() {
		if(this.sounds[0] != null) {
			this.sounds[0].stop();
		}
	}
	playMusic() {
        if(localStorage.getItem('isMuted') != 'true' && this.sounds[0] != null) {
			this.sounds[0].stop();
		    this.sounds[0].setVolume(0.25);
		    this.sounds[0].loop();	
        }
	}
	playSound(index) {
		if(localStorage.getItem('isMuted') != 'true' && this.sounds[index] != null) {
			this.sounds[index].play();
		}
	}
}