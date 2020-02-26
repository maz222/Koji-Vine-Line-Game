class AssetManager {
	constructor() {
		this.images = [];
		this.loadCount = 0;

	}
    startLoad() {
        this.loadImages();
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
}