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

let loaded = null;
let loadCount = 0;

let soundController = null;

let music = null;

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
    console.log("pre load");
    assets = new AssetManager();
    assets.startLoad();
    soundController = null;
}

function afterLoad() {
    let VCC = Koji.config.sounds;
    if(soundController !== null) {
        soundController.mute();
    }
    soundController = new SoundController();
    //load sounds
    //load add line
    if(VCC.addLine !== "" && VCC.addLine !== undefined) {
        soundController.data.sounds[0] = loadSound(VCC.addLine, () => {loadCount -=1;});
        loadCount += 1;
    }
    //load get coin
    if(VCC.getCoin !== "" && VCC.getCoin !== undefined) {
        soundController.data.sounds[1] = loadSound(VCC.getCoin, () => {loadCount -=1;});
        loadCount += 1;
    }
    //load fail
    if(VCC.levelFail !== "" && VCC.levelFail !== undefined) {
        soundController.data.sounds[2] = loadSound(VCC.levelFail, () => {loadCount -=1;});
        loadCount += 1;
    }
    //load pass
    if(VCC.levelClear !== "" && VCC.levelClear !== undefined) {
        soundController.data.sounds[3] = loadSound(VCC.levelClear, () => {loadCount -=1;});
        loadCount += 1;
    }
    //load music
    //VCC.music = undefined;
    if(VCC.music !== "" && VCC.music !== undefined) {
        soundController.data.music = loadSound(VCC.music, () => {loadCount -=1; soundController.playMusic();});
        //music = loadSound(VCC.music, () => {loadCount -=1;});
        loadCount += 1;
    }
    console.log("sounds pushed");

    console.log("???");
    //load level!
    gridArr = Koji.config.levelSelect.gameLevels[parseInt(localStorage.getItem('currentLevel'))].level;
    gridArr = transpose(gridArr);

    score = 0;
    
    VCC = Koji.config.gameScene;

    let buttonY = (height*.2/2);
    let buttonX = width > 800 ? (width-800)/2 : 0;
    let colWidth = Math.min(800,width);
    let backColor = hexToHSL(VCC.backButton.backgroundColor);
    let backHoverColor = hexToHSL(VCC.backButton.backgroundColor);
	backHoverColor[2] = Math.max(0,backHoverColor[2]-20);
    //let backCallback = () => {assets.stopMusic(); window.setAppView("intro")};
    let backCallback = () => {
        soundController.mute();
        window.setAppView("intro")
        console.log("???");
    };
    backButton = new HoverButton([buttonX+colWidth/4,buttonY],30,50,assets.images[9],backColor,backCallback,assets.images[9],backHoverColor);

    let soundColor = hexToHSL(VCC.soundButton.backgroundColor);
    let soundHoverColor = hexToHSL(VCC.soundButton.backgroundColor);
	soundHoverColor[2] = Math.max(0,soundHoverColor[2]-20);
    let soundCallback = () => {
        //localStorage.setItem('isMuted',localStorage.getItem('isMuted') == 'false' ? 'true' : 'false');
        //assets.toggleMute();
        soundController.toggleMute();
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
    console.log(gridSize);
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
    console.log(backgroundMask);
    backgroundLayer.mask(backgroundMask);

    gameState = new GameBaseState(bridge,grid);

    loaded = true;
}

//This function runs once after the app is loaded
function setup() {
    loaded = false;
    console.log("setup");
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    afterLoad();
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
    if(assets.isLoading() || loadCount > 0) {
        drawLoadingScreen();
    }
    else {
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