let assets = null;

let gameState = null;

let bridge = null;
let grid = null;

let gridArr = [
    [0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [3,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

let score = null;

let backButton = null;
let soundButton = null;

let backgroundLayer = null;
let backgroundMask = null;

let stroke_size = 1;

let musicStarted = null;

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

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

//===This function is called before starting the game
//Load everything here
function preload() {
    assets = new AssetManager();
    assets.startLoad();
}


//This function runs once after the app is loaded
function setup() {
    musicStarted = false;
    
    //load level!
    gridArr = Koji.config.levelSelect.gameLevels[parseInt(localStorage.getItem('currentLevel'))].level;
    gridArr = transpose(gridArr);
    console.log(gridArr);
    console.log(Koji.config.levelSelect);
    console.log(localStorage.getItem('currentLevel'));

    score = 0;
    
    let VCC = Koji.config.gameScene;
    //Set our canvas size to full window size
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);

    let buttonY = (height*.2/2);
    let buttonX = width > 800 ? (width-800)/2 : 0;
    let colWidth = Math.min(800,width);
    let backColor = hexToHSL(VCC.backButton.backgroundColor);
    let backHoverColor = hexToHSL(VCC.backButton.backgroundColor);
	backHoverColor[2] = Math.max(0,backHoverColor[2]-20);
    let backCallback = () => {assets.stopMusic(); window.setAppView("intro")};
    backButton = new HoverButton([buttonX+colWidth/4,buttonY],30,50,assets.images[9],backColor,backCallback,assets.images[9],backHoverColor);

    let soundColor = hexToHSL(VCC.soundButton.backgroundColor);
    let soundHoverColor = hexToHSL(VCC.soundButton.backgroundColor);
	soundHoverColor[2] = Math.max(0,soundHoverColor[2]-20);
    let soundCallback = () => {
        //localStorage.setItem('isMuted',localStorage.getItem('isMuted') == 'false' ? 'true' : 'false');
        assets.toggleMute();
    };
    soundButton = new SoundButton([width-buttonX-colWidth/4,buttonY],30,50,assets.images[10],soundColor,soundCallback,assets.images[11],soundHoverColor)

    let gridArea = [width,height*.6];
    let cellSize = Math.min(gridArea[0]/gridArr.length, gridArea[1]/gridArr[0].length);
    //cellSize = Math.min(cellSize,40);
	let gridOrigin = [(width-gridArr.length*cellSize)/2,(height-gridArr[0].length*cellSize)/2];
    grid = new GameGrid(gridOrigin,gridArr,cellSize,.75);


    let playerSpawnCell = grid.getSpawn();
    let playerSpawnPos = [playerSpawnCell[0]*cellSize+cellSize/2,playerSpawnCell[1]*cellSize+cellSize/2];
	let stroke_size = Math.max(1,Math.round(cellSize/10));
    bridge = new PlayerBridge(playerSpawnPos,cellSize,stroke_size);

    let gridSize = [cellSize*gridArr.length,cellSize*gridArr[0].length];
    const GRID_STROKE = 10;
    //create background mask
    backgroundMask = createGraphics(width,height);
    backgroundMask.fill('rgba(0,0,0,1)');
    //top
    backgroundMask.rect(0,0,width,(height-gridSize[1])/2);
    //bottom
    backgroundMask.rect(0,height-(height-gridSize[1])/2,width,(height-gridSize[1])/2);
    //left
    backgroundMask.rect(0,0,(width-gridSize[0])/2,height);
    //right
    backgroundMask.rect(width-(width-gridSize[0])/2,0,(width-gridSize[0])/2,height);

    if(assets.images[0] !== null) {
        backgroundLayer = assets.images[0];
    }
    else {
        backgroundLayer = createGraphics(width,height);
        backgroundLayer.fill(VCC.pageBackground.backgroundColor);
        backgroundLayer.noStroke();
        backgroundLayer.rect(0,0,width,height);
        backgroundLayer = backgroundLayer.get();
    }
    backgroundLayer.mask(backgroundMask);

    gameState = new GameSpawnState(bridge,grid,.75);
}

function drawLoadingScreen() {
    push();
    background(20);
    textSize(36);
    fill(255);
    textAlign(CENTER,CENTER);
    text("Loading...",width/2,height/2);
    pop();
}

function draw() {
    if(assets.isLoading()) {
        console.log("loading");
        drawLoadingScreen();
    }
    else {
		if(!musicStarted) {
			assets.playMusic();
			musicStarted = true;
		}
        let VCC = Koji.config.gameScene;
        noStroke();
        this.gameState = this.gameState.update();
        this.gameState.render();
        //draw page
        image(backgroundLayer,0,0,width,height);
        this.gameState.renderButtons();
        backButton.render();
        soundButton.render();
    }
}


//===Handle mouse/tap input here
function touchStarted() {

}

function touchEnded() {
    if(!this.backButton.handleClick() && !this.soundButton.handleClick()) {
        this.gameState.handleClick();
    }
    return false;
}