import "./index.css";
import Phaser from "phaser";
import Player from "./Player.js"
import Cop from './Cop.js';
import mapJSON from "./assets/map.json";
import tileImg from "./assets/Tilesheet.png"
import playerImg from "./assets/Car_Placeholder.png";
import copBWImg from "./assets/copBW.png";
import DftImg from './assets/drift_trail.png';
import SpeedImg from './assets/spd.png';
import cashImg from './assets/Cash.png';
import sensorImg from './assets/Sensor.png';
import dashImg from "./assets/dash.png";
import CarAImg from "./assets/Car_ani.png";
import musicMP3 from './assets/track27.mp3'

var player;
var copBW;
var Dtrail;
var speedAnim;
var scoreText;
var score;
var dash;
var arrowKeys;
var Akey;
var Dkey;
var xGridPos;
var yGridPos;
const cashArray = [];
var debugText;
var debugText2;

// Represents Game Scene
class MyGame extends Phaser.Scene {

  constructor() {
    super();
  }
  
  preload() {
    this.load.audio('music', musicMP3);
    this.load.image("player", playerImg);
    this.load.image("copBW", copBWImg);
    this.load.image("cash", cashImg);
    this.load.image("dash", dashImg);
    this.load.image("dft", DftImg);
    this.load.image('speed', SpeedImg);
    this.load.image('sensor', sensorImg);
    this.load.image("tiles", tileImg);
    this.load.spritesheet('SpeedD', SpeedImg, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('CarAni', CarAImg, { frameWidth: 128, frameHeight: 128 });
    this.load.tilemapTiledJSON('map', mapJSON);
  }

  create() {
    // play background music
    var music = this.sound.add('music');
    music.play();

    // initialize map
    var map = this.make.tilemap({key:'map'});
    const tileset = map.addTilesetImage('Tilesheet','tiles');
    map.createLayer('Background', tileset,0,0); 
    map.createLayer('Buildings', tileset,0,0); 
    const layer = map.createLayer('Obstacles', tileset,0,0); 

    // sets Collisions from tileset data
    layer.setCollisionFromCollisionGroup();
    this.matter.world.convertTilemapLayer(layer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
    // create collectibles
    const cashCount = 100;
    const cashColumns = 10;
    const cashColSpacing = 300;
    const cashRowSpacing = 300;
    createGridPositions(cashCount, cashColumns, cashColSpacing, cashRowSpacing, 150, 150);

    for (let i = 0; i < cashCount; i++) {
      const cash = this.matter.add.image(xGridPos[i], yGridPos[i], 'cash').setStatic(true).setSensor(true);
      cash.body.label = "cash";
      //cashArray.push(cash);   // TODO: use new array for respawning?
    }

    // create sensors for AI
    const sensorCount = 100;
    const sensorColumns = 10;
    const sensorColSpacing = 300;
    const sensorRowSpacing = 300;
    createGridPositions(sensorCount, sensorColumns, sensorColSpacing, sensorRowSpacing, 300, 300);

    for (let i = 0; i < sensorCount; i++) {
      const sensor = this.matter.add.image(xGridPos[i], yGridPos[i], 'sensor').setStatic(true).setSensor(true);
      sensor.setScale(4);
      sensor.body.label = "sensor";
    }

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
    player = new Player(this, 400, 420);
    player.initialize();
    player.body.label = "player";

    // TODO: create multiple cops
    copBW = new Cop(this, 200, 320, "copBW");
    copBW.initialize();
    copBW.body.label = "cop";
    
    // create user interface
    dash = this.add.sprite(400, 340, 'dash').setScrollFactor(0);
    scoreText = this.add.text(200,580,'', {font: '30px Courier', fill: '#ffffff'}).setScrollFactor(0);
    score = 0;
    scoreText.setText('Score: $' + score);
    var graphics = new Phaser.Geom.Rectangle(270, 510, 150, 20);
    var fuel = this.add.graphics().setScrollFactor(0);
    fuel.fillGradientStyle(0xFFFF00, 0x00FF00, 1);
    fuel.fillRectShape(graphics);

    // create speedomemter
    this.anims.create({
      key: "start",
      frames: this.anims.generateFrameNumbers('SpeedD', {frames: [2,4,6,8,10,12,14,16,18]}),
      frameRate: 20
    });
    speedAnim = this.add.sprite(520, 566).setScrollFactor(0);
    speedAnim.setScale(1);
    speedAnim.play('start');
     
    // fuel animation
    this.tweens.add({
      targets: fuel,
      scaleX: 0,
      x: 270,
      ease: 'Linear',
      duration: 30000
    });

    // set up inputs
    arrowKeys = this.input.keyboard.createCursorKeys();
    Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // collision listeners
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
      debugText.setText("Hit: " + bodyA.label);
      if (bodyA.label == "Rectangle Body") {    // checks if colliding with Tilemap sprite
        if (bodyA.gameObject != null) {
          if (bodyA.gameObject.tile.properties.name == "sign") {
            debugText.setText("Hit: " + bodyA.gameObject.tile.properties.name);
          }
        }
      }
      else {
        if (bodyA.label == "sensor" && bodyB.label == "cop") {    // manage cop AI
          console.log("AI sensor triggered");
          
        }
        if (bodyA.label == "cop" && bodyB.label == "cop") {
          console.log("Hit: " + bodyA.label);   // TODO: destroy cop
        }
        if (bodyA.label == "cash" && bodyB.label == "player") {   // collect cash
          score += 100;
          scoreText.setText('Score: $' + score);
          bodyA.gameObject.destroy();
        }
        if (bodyA.label == "player" && bodyB.label == "cop") {
          debugText.setText("Hit: " + bodyA.label);   // TODO: destroy player
        }
      }
    });

    debugText = this.add.text(10,10,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);
    debugText2 = this.add.text(10,30,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);

    // world bounds
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);   
  }

  update() {
    this.cameras.main.centerOn(player.x,player.y);
    player.update();
    copBW.update(player);

    // player turning
    if (arrowKeys.left.isDown || Akey.isDown)
    {
      player.angle -= 4;
      Dtrail = this.add.sprite(player.x, player.y, "dft");
    }
    else if (arrowKeys.right.isDown || Dkey.isDown)
    {
      player.angle += 4;
      Dtrail = this.add.sprite(player.x, player.y, "dft");
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

    var pointer = this.input.activePointer;
    debugText2.setText([
      'x: ' + pointer.worldX,
      'y: ' + pointer.worldY
  ]);
  }
}

function createGridPositions(count, columns, columnSpacing, rowSpacing, initialX, initialY) {
  var X = initialX;
  var Y = initialY;
  xGridPos = [];
  yGridPos = [];
  
  for (let i = 0; i < count; i++) {
    if (i == 0) {
      xGridPos[i] = initialX;
      yGridPos[i] = initialY;
    }
    else if (i%columns == 0) {    // iterate row
      X = initialX;
      Y += rowSpacing;
      xGridPos[i] = X;
      yGridPos[i] = Y;
    }
    else {    // iterate column
      X += columnSpacing;
      xGridPos[i] = X;
      yGridPos[i] = Y;
    }
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
      debug: true,
      fps:60,
      gravity: {x:0,y:0}
    }
  },
  scene: MyGame
};

const game = new Phaser.Game(config);

