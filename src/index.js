import "./index.css";
import Phaser from "phaser";
import Player from "./Player.js"
import Cop from './Cop.js';
import mapJSON from "./assets/map.json";
import tileImg from "./assets/Tilesheet.png";
import playerImg from "./assets/Car_Placeholder.png";
import copBWImg from "./assets/copBW.png";
import copBlueImg from './assets/copBlue.png';
import DftImg from './assets/drift_trail.png';
import SpeedImg from './assets/spd.png';
import cashImg from './assets/Cash.png';
import sensorImg from './assets/Sensor.png';
import fireImg from './assets/explosion.png';
import dashImg from "./assets/dash.png";
import CarAImg from "./assets/Car_ani.png";
import musicMP3 from './assets/Retro_Synthwave.wav';
import engineWAV from './assets/Engine.wav';
import crashWAV from './assets/Explosion.wav';
import moneyMP3 from './assets/cashRegister.mp3';
import fuelWAV from './assets/slurp.wav';
import sirenMP3 from './assets/sirens.mp3';
import ftankImg from './assets/GAS_TANK.png';
import titleImg from './assets/StartScreen.png';
import keyImg from './assets/keyignition.png';
import bustedImg from './assets/Busted.png';

var player;
var Dtrail;
var speedAnim;
var scoreText;
var score;
var dash;
var arrowKeys;
var Akey;
var Dkey;
var engineSfx;
var crashSfx;
var moneySfx;
var fuelSfx;
var playerDeath;
var gameScene;
var backgroundLayer;
const cashArray = [];
const copArray = [];
const copCount = 3;
const copSpeed = [.0405,.0404,.0403];
const copAngles = [0,-90,90]
const copPos = {
  X: [300,1600,1600],
  Y: [1650,2975,225]
};
//var debugText;
//var debugText2;

// Represents Title Screen
class StartScreen extends Phaser.Scene {

  constructor() {
    super({ key: 'startScreen' });
  }

  preload() {
      this.load.spritesheet('Title', titleImg, { frameWidth: 200, frameHeight: 160 });
      this.load.image("Key", keyImg);

  }
  create() {
    this.anims.create({
      key: "title",
      frames: this.anims.generateFrameNumbers('Title', {frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64]}),
        frameRate: 12,
        repeat:-1
    });

    const titleScreen = this.add.sprite(400,320)
    titleScreen.setScale(3);
    titleScreen.play('title');

    // temporary button

    const startKey = this.add.image(180, 560, 'Key');
    const startButton = this.add.text(130, 600, 'Ignition!', { fill: '#0f0' });
    startKey.setInteractive();
    startKey.on('pointerdown', () => { this.scene.start('myGame') });    // listens for mouse click
  }
}

// Represents Game Scene
class MyGame extends Phaser.Scene {

  constructor() {
    super({ key: 'myGame' });
  }
  
  preload() {
    this.load.audio('music', musicMP3);
    this.load.audio('engine', engineWAV);
    this.load.audio('crash', crashWAV);
    this.load.audio('money', moneyMP3);
    this.load.audio('fuelSfx', fuelWAV);
    this.load.audio('siren', sirenMP3);
    this.load.image("player", playerImg);
    this.load.image("copBW", copBWImg);
    this.load.image("copBlue", copBlueImg);
    this.load.image("cash", cashImg);
    this.load.image("dash", dashImg);
    this.load.image("dft", DftImg);
    this.load.image('speed', SpeedImg);
    this.load.image('sensor', sensorImg);
    this.load.image('busted', bustedImg);
    this.load.image("tiles", tileImg);
    this.load.spritesheet('SpeedD', SpeedImg, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('CarAni', CarAImg, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('explosion', fireImg, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('fuelTank', ftankImg, { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapTiledJSON('map', mapJSON);
  }

  create() {
    // reference to scene for global use
    gameScene = this;
    // create music
    var music = this.sound.add('music', {loop: true});
    music.play();
    engineSfx = this.sound.add('engine', {loop: true});
    moneySfx = this.sound.add('money');
    crashSfx = this.sound.add('crash');
    fuelSfx = this.sound.add('fuelSfx');
    var sirens = this.sound.add('siren', {loop: true});

    // initialize map
    var map = this.make.tilemap({key:'map'});
    const tileset = map.addTilesetImage('Tilesheet','tiles');
    map.createLayer('Background', tileset,0,0); 
    map.createLayer('Roads', tileset,0,0); 
    const buildings = map.createLayer('Buildings', tileset,0,0); 
    map.createLayer('Props', tileset,0,0); 

    // sets Collisions from tileset data
    buildings.setCollisionFromCollisionGroup();
    this.matter.world.convertTilemapLayer(buildings);
    backgroundLayer = this.add.layer();
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
    // create collectibles and AI sensors
    createMapObjects(this);

    // create player car animations
    this.anims.create({
      key: "slow",
      frames: this.anims.generateFrameNumbers('CarAni', { frames: [0] }),
      frameRate: 20
    });
    this.anims.create({
        key: "fast",
        frames: this.anims.generateFrameNumbers('CarAni', { frames: [1, 2, 3] }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers('CarAni', { frames: [4,5,6] }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers('CarAni', { frames: [7,8,9] }),
      frameRate: 20,
      repeat: -1
    });

    //create player car
    player = new Player(this, 600, 1650);
    player.initialize();
    player.body.label = "player";
    engineSfx.play();

    // create cops
    
    for (let i = 0; i < copCount; i++) {
      const cop = null;
      if (i == copCount-1) {
        cop = new Cop(this, copPos.X[i], copPos.Y[i], 'copBlue')
      }
      else {
        cop = new Cop(this, copPos.X[i], copPos.Y[i], 'copBW')
      }
      cop.initialize(copSpeed[i]);
      cop.body.label = "cop";
      cop.angle = copAngles[i];
      copArray.push(cop);
    }

    sirens.play();
    
    // create user interface
    dash = this.add.sprite(400, 370, 'dash').setScrollFactor(0);
    dash.setScale(0.9)
    scoreText = this.add.text(207,580,'', {font: '30px Courier', fill: '#ffffff'}).setScrollFactor(0);
    score = 0;
    scoreText.setText('Score: $' + score);
    var graphics = new Phaser.Geom.Rectangle(282, 525, 138, 18);
    var fuel = this.add.graphics().setScrollFactor(0);
    fuel.fillGradientStyle(0xFFFF00, 0x00FF00, 1);
    fuel.fillRectShape(graphics);

    // create speedomemter
    this.anims.create({
      key: "start",
      frames: this.anims.generateFrameNumbers('SpeedD', {frames: [2,4,6,8,10,12,14,16,18]}),
      frameRate: 20
    });
    speedAnim = this.add.sprite(505, 576).setScrollFactor(0);
    speedAnim.setScale(.9);
    speedAnim.play('start');
     
    // fuel animation
     const fuelGadget = this.tweens.add({
      targets: fuel,
      scaleX: 0,
      x: 282,
      ease: 'Linear',
      duration: 30000
    });

    // set up inputs
    arrowKeys = this.input.keyboard.createCursorKeys();
    Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.cameras.main.once('camerafadeoutcomplete', function (camera) {
      music.stop();
      gameScene.add.image(400,320,'busted')
      //location.reload();
    });

    // create explosion animation
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers('explosion', { frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18] }),
      frameRate: 16
    });

    // collision listeners
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
      //debugText.setText("Hit: " + bodyA.label);
      if (bodyA.label == "Rectangle Body") {    
        if (bodyA.gameObject != null) {
          // checks if colliding with Tilemap sprite
        } 
      }
      else {
        if (bodyA.label == "sensor" && bodyB.label == "cop") {    // manage cop AI
          console.log("AI sensor triggered");
          bodyB.gameObject.setTurning(true);
        }
        if (bodyA.label == "cop" && bodyB.label == "cop") {   // destroy cops
          if (!bodyA.isSensor && !bodyB.isSensor) {
            crashSfx.play();
            console.log("hit");
            const explode = gameScene.add.sprite((bodyA.gameObject.x + bodyB.gameObject.x)/2,(bodyA.gameObject.y + bodyB.gameObject.y)/2);
            bodyA.gameObject.visible = false;
            bodyB.gameObject.visible = false;
            bodyA.gameObject.setStatic(true).setSensor(true);
            bodyB.gameObject.setStatic(true).setSensor(true);
            explode.play('explode');
            score += 1;
            scoreText.setText('Score: $' + score);

            gameScene.time.addEvent({delay: 10000,callback: ()=>{respawnCops();}});
          }
        }
        if (bodyA.label == "cash" && bodyB.label == "player") {   // collect cash
          score += 100;
          scoreText.setText('Score: $' + score);
          moneySfx.play();
          bodyA.gameObject.destroy();
        }

        if (bodyA.label == "fuel" && bodyB.label == "player") {   // collect fuel
          fuelSfx.play();
            fuelGadget.restart();
            bodyA.gameObject.destroy();
        }

        if (bodyA.label == "player" && bodyB.label == "cop") {
          if (!bodyB.isSensor) {
            engineSfx.stop();
            crashSfx.play();

            const explode = gameScene.add.sprite((bodyA.gameObject.x + bodyB.gameObject.x)/2,(bodyA.gameObject.y + bodyB.gameObject.y)/2);
            bodyA.gameObject.visible = false;
            bodyB.gameObject.visible = false;
            explode.play('explode');
            playerDeath = true;
            player.body.destroy();
            gameScene.cameras.main.fadeOut(2500);
          }
          //debugText.setText("Hit: " + bodyB.label); 
        }
      }
    });

    //debugText = this.add.text(10,10,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);
    //debugText2 = this.add.text(10,30,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);

    // world bounds
    this.matter.world.setBounds(124, 124, map.widthInPixels - 248, map.heightInPixels - 248);   
  }

  update() {
    this.cameras.main.centerOn(player.x,player.y);
    if (!playerDeath) {
      player.update();
    }
    for (let i = 0; i < copArray.length; i++) {
      copArray[i].update(player);
    }

    // player turning
    if (arrowKeys.left.isDown || Akey.isDown && !playerDeath)
    {
      player.angle -= 3;
      Dtrail = this.add.sprite(player.x, player.y, "dft");
      backgroundLayer.add(Dtrail);
      gameScene.cameras.main.cull(Dtrail);
    }
    else if (arrowKeys.right.isDown || Dkey.isDown && !playerDeath)
    {
      player.angle += 3;
      Dtrail = this.add.sprite(player.x, player.y, "dft");
      backgroundLayer.add(Dtrail);
      gameScene.cameras.main.cull(Dtrail);
    }

    // animates speedometer
    if (player.body.speed > 3.6 && player.body.speed < 3.7) {
      speedAnim.setFrame(18);
    }
    if (player.body.speed > 3.5 && player.body.speed < 3.6) {
      speedAnim.setFrame(16);
    }
    if (player.body.speed > 3.4 && player.body.speed < 3.5) {
      speedAnim.setFrame(14);
    } 
    if (player.body.speed > 3.3 && player.body.speed < 3.4) {
      speedAnim.setFrame(12);
    } 
    if (player.body.speed > 3.2 && player.body.speed < 3.3) {
      speedAnim.setFrame(10);
    }
    if (player.body.speed > 3.1 && player.body.speed < 3.2)
    {
      speedAnim.setFrame(8);
    }
    if (player.body.speed > 3.0 && player.body.speed < 3.1)
    {
      speedAnim.setFrame(6);
    }
    if (player.body.speed > 2.9 && player.body.speed < 3.0) {
      speedAnim.setFrame(4);
    }
    if (player.body.speed < 2.7)
    {
      speedAnim.setFrame(2);
    }

    // animates exhaust
    if (player.body.speed > 3.4 && player.body.speed < 3.8 && !arrowKeys.right.isDown && !Dkey.isDown) {
      player.play('fast',true);
    }
    if (player.body.speed <= 3.4 && !arrowKeys.left.isDown && !Akey.isDown &&  !arrowKeys.right.isDown && !Dkey.isDown) {
      player.play('slow');
    }
    if ( arrowKeys.left.isDown || Akey.isDown) {
      player.play('left',true);
    }
    if (arrowKeys.right.isDown || Dkey.isDown) {
      player.play('right',true);
    }

    /* var pointer = this.input.activePointer;
    debugText2.setText([
      'x: ' + pointer.worldX,
      'y: ' + pointer.worldY
    ]); */
  }
}

function respawnCops() {
  for(let i = 0; i < copArray.length; i++) {
    if (copArray[i].isSensor()) {
      copArray[i].setChase(false);
      copArray[i].x = copPos.X[i];
      copArray[i].y = copPos.Y[i];
      copArray[i].angle = copAngles[i];
      copArray[i].visible = true;
      copArray[i].setStatic(false);
      gameScene.time.addEvent({delay: 1000,callback: ()=>{copArray[i].setSensor(false);}});
    }
  }
}

function createMapObjects(scene) {
  const majorObj = {
    X: [225,1600,3000,2975,1600,1600,1250,225,225,1600,1600,2975],
    Y: [225,225,225,1630,795,1630,1630,1630,2975,2975,2300,2975]
  }

  //fuel tank pos
  const FtankObj = {
      X: [225, 1600, 3000, 2975, 1600, 1600, 1250, 225, 225, 1600, 1600, 2975],
      Y: [225, 225, 225, 1630, 795, 1630, 1630, 1630, 2975, 2975, 2300, 2975]
  }

  const minorObj = {
    X: [500,2300,2975,1600,2300,225,575,1225,2975,2300,575],
    Y: [225,225,1050,1180,1630,2300,2975,2975,2300,2975,1630]
  }

  const cityObj = {
    X: [2300,2300,2300,510,895,1215,575,895,1275],
    Y: [1050,1180,795,795,795,2300,2300,1180,1180]
  }

  const plazaObj = {
    X: [2160,2100,2160,2230,2320,2380,2320,2260,2420,2350,2420,2480],
    Y: [2250,2300,2370,2310,2540,2480,2420,2480,2150,2220,2280,2220]
  }

  //Fuel tank spawn
  scene.anims.create({
      key: "wiggle",
      frames: scene.anims.generateFrameNumbers('fuelTank', { frames: [0, 1, 2] }),
      frameRate: 20,
      repeat: -1
  });

  for (let i = 0; i < majorObj.X.length; i++) {
      const FTankAnim = scene.matter.add.sprite(majorObj.X[i] + 50, majorObj.Y[i] + 50).setStatic(true).setSensor(true);
      FTankAnim.setScale(1);
      FTankAnim.play('wiggle');
      FTankAnim.body.label = "fuel";
  }

  // major freeway intersections
  for (let i = 0; i < majorObj.X.length; i++) {
    const cash = scene.matter.add.image(majorObj.X[i], majorObj.Y[i], 'cash').setStatic(true).setSensor(true);
    const sensor = scene.matter.add.image(majorObj.X[i], majorObj.Y[i], 'sensor').setStatic(true).setSensor(true);
    sensor.setScale(6);
    cash.body.label = "cash";
    //cashArray.push(cash);   // TODO: use new array for respawning?
  }

  // minor freeway intersections
  for (let i = 0; i < minorObj.X.length; i++) {
    const cash = scene.matter.add.image(minorObj.X[i], minorObj.Y[i], 'cash').setStatic(true).setSensor(true);
    const sensor = scene.matter.add.image(minorObj.X[i], minorObj.Y[i], 'sensor').setStatic(true).setSensor(true);
    sensor.setScale(5);
    cash.body.label = "cash";
    //cashArray.push(cash);   
  }

  // city intersections
  for (let i = 0; i < cityObj.X.length; i++) {
    const cash = scene.matter.add.image(cityObj.X[i], cityObj.Y[i], 'cash').setStatic(true).setSensor(true);
    const sensor = scene.matter.add.image(cityObj.X[i], cityObj.Y[i], 'sensor').setStatic(true).setSensor(true);
    sensor.setScale(4);
    cash.body.label = "cash";
    //cashArray.push(cash);   
  }

  // plaza money
  for (let i = 0; i < plazaObj.X.length; i++) {
    const cash = scene.matter.add.image(plazaObj.X[i], plazaObj.Y[i], 'cash').setStatic(true).setSensor(true);
    cash.body.label = "cash";
    //cashArray.push(cash);   
  }
}

// Creates Phaser Game
const config = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  width: 800,
  height: 640,
  audio: {
    disableWebAudio: true
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      fps:60,
      gravity: {x:0,y:0}
    }
  },
  scene: [StartScreen, MyGame]
};

const game = new Phaser.Game(config);
