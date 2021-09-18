import Phaser from "phaser";
import mapJSON from "./assets/map.json";
import tileImg from "./assets/Tilesheet.png"
import playerImg from "./assets/Car_Placeholder.png";
import copBWImg from "./assets/copBW.png";
import DftImg from './assets/drift_trail.png';
import SpeedImg from './assets/spd.png';
import cashImg from './assets/Cash.png';
import Player from "./Player.js"
import Cop from './Cop.js';
import "./index.css";
import dashImg from "./assets/dash.png";
import CarAImg from "./assets/Car_ani.png"

var player;
var Dtrail;
var speedAnim;
var CarAnim;
var copBW;
var arrowKeys;
var Akey;
var Dkey;
var scoreText;
var score;
var debugText;
var debugText2;
var dash;
var key4CarAnim;

// Represents Game Scene
class MyGame extends Phaser.Scene {

  constructor() {
    super();
  }
  
  preload() {
    this.load.image("player", playerImg);
    this.load.image("dft", DftImg);
    this.load.image('speed', SpeedImg);
      this.load.spritesheet('SpeedD', SpeedImg, { frameWidth: 128, frameHeight: 128 });
      this.load.spritesheet('CarAni', CarAImg, { frameWidth: 128, frameHeight: 128 });
    this.load.image("copBW", copBWImg);
      this.load.image("cash", cashImg);
      this.load.image("dash", dashImg);
    this.load.image("tiles", tileImg);
      this.load.tilemapTiledJSON('map', mapJSON);

  }

  create() {

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
    const cash1 = this.matter.add.sprite(230, 210,'cash').setStatic(true).setSensor(true);
    cash1.body.label = 'cash';
    const cash2 = this.matter.add.sprite(552, 175,'cash').setStatic(true).setSensor(true);
    cash2.body.label = 'cash';
    const cash3 = this.matter.add.sprite(430, 450,'cash').setStatic(true).setSensor(true);
    cash3.body.label = 'cash';

    // car animations
    this.anims.create({
        key: "fast",
        frames: this.anims.generateFrameNumbers('CarAni', { frames: [1, 2, 3] }),
        frameRate: 1,
        repeat: 20

    });
    this.anims.create({
        key: "slow",
        frames: this.anims.generateFrameNumbers('CarAni', { frames: [0] }),
        frameRate: 20

    });


      this.anims.create({
          key: "right",
          frames: this.anims.generateFrameNumbers('CarAni', { frames: [5,6,7] }),
          frameRate: 20

      });

      this.anims.create({
          key: "left",
          frames: this.anims.generateFrameNumbers('CarAni', { frames: [8,9,10] }),
          frameRate: 20

      });
    //create player
    player = new Player(this, 400, 420);

    player.initialize();
    player.body.label = "player";

    // create cop
    copBW = new Cop(this, 200,420,"copBW");
    copBW.initialize();
    copBW.body.label = "cop";
    
    // create user interface
    dash = this.add.sprite(400, 340, 'dash').setScrollFactor(0);
    scoreText = this.add.text(200,580,'', {font: '30px Courier', fill: '#ffffff'}).setScrollFactor(0);
    score = 0;
    var graphics = new Phaser.Geom.Rectangle(270, 510, 150, 20);
    var fuel = this.add.graphics({ fillStyle: { color: 0x00ff00 } }).setScrollFactor(0);
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
     
    // tween animations
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
      if (bodyA.label == "Rectangle Body") {
        if (bodyA.gameObject != null) {
          if (bodyA.gameObject.tile.properties.name == "sign") {
            debugText.setText("Hit: " + bodyA.gameObject.tile.properties.name);
          }
        }
      }
      else {
        if (bodyA.label == "cash" && bodyB.label == "player") {
          score += 100;
          bodyA.gameObject.destroy();
        }
        if (bodyA.label == "player" && bodyB.label == "cop") {
          debugText.setText("Hit: " + bodyA.label);
        }
      }
    });

    debugText = this.add.text(10,60,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);
    debugText2 = this.add.text(10,80,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);   // world bounds
  }

  update() {
    this.cameras.main.centerOn(player.x,player.y);
    
    player.update();
    copBW.update(player);

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

    scoreText.setText('Score: $' + score);

    // updates speedometer
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

      if (player.body.speed > 3.4 && player.body.speed < 3.8 && !arrowKeys.right.isDown && !Dkey.isDown) {
          player.play('fast');
      }

      if (player.body.speed <= 3.4 && !arrowKeys.left.isDown && !Akey.isDown &&  !arrowKeys.right.isDown && !Dkey.isDown) {
          player.play('slow');
      }

      if ( arrowKeys.left.isDown || Akey.isDown) {
          player.play('left');
      }

      if (arrowKeys.right.isDown || Dkey.isDown) {
          player.play('right');
      }



    var pointer = this.input.activePointer;
    debugText2.setText([
      'x: ' + pointer.worldX,
      'y: ' + pointer.worldY
  ]);
  }
}

// Creates Phaser Game
const config = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  width: 800,
  height: 640,
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

