import Phaser from "phaser";
import mapJSON from "./assets/map.json";
import tileImg from "./assets/TileSet.png"
import playerImg from "./assets/Car_Placeholder.png";
import copBWImg from "./assets/copBW.png";
import DftImg from './assets/drift_trail.png';
import cashImg from './assets/Cash.png';
import Player from "./Player.js"
import Cop from './Cop.js';
import "./index.css";

var player;
var Dtrail;
var copBW;
var arrowKeys;
var Akey;
var Dkey;
var scoreText;
var score;
var debugText;

// Represents Game Scene
class MyGame extends Phaser.Scene {

  constructor() {
    super();
  }
  
  preload() {
    this.load.image("player", playerImg);
    this.load.image("dft", DftImg);
    this.load.image("copBW", copBWImg);
    this.load.image("cash", cashImg);
    this.load.image("tiles", tileImg);
    this.load.tilemapTiledJSON('map', mapJSON);
  }

  create() {

    // initialize map
    var map = this.make.tilemap({key:'map'});
    const tileset = map.addTilesetImage('TileSet','tiles');
    map.createLayer('Tile Layer 1', tileset,0,0); 
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
    // create collectibles
    const cash1 = this.matter.add.sprite(230, 210,'cash').setStatic(true).setSensor(true);
    const cash2 = this.matter.add.sprite(552, 175,'cash').setStatic(true).setSensor(true);
    const cash3 = this.matter.add.sprite(430, 450,'cash').setStatic(true).setSensor(true);

    //create player
    player = new Player(this,400,320,"player");
    player.initialize();

    // create cop
    copBW = new Cop(this, 200,320,"copBW");
    copBW.initialize();
    
    // create user interface
    scoreText = this.add.text(10,0,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);
    score = 0;
    var graphics = new Phaser.Geom.Rectangle(0, 30, 150, 25);
    var fuel = this.add.graphics({ fillStyle: { color: 0x00ff00 } }).setScrollFactor(0);
    fuel.fillRectShape(graphics);

    // set up inputs
    arrowKeys = this.input.keyboard.createCursorKeys();
    Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // collision listeners
    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
        if (bodyA.gameObject.texture.key == "cash" && bodyB.gameObject.texture.key == "player") {
          score += 100;
          bodyA.gameObject.destroy();
        }
    });

    // tween animations
    this.tweens.add({
      targets: fuel,
      scaleX: .01,
      ease: 'Linear',
      duration: 30000
    });

    debugText = this.add.text(10,60,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);   // world bounds
  }

  update() {
    this.cameras.main.centerOn(player.x,player.y);
    debugText.setText("Cop: " + copBW.x + ", " + copBW.y);
    
    player.update();
    copBW.update();

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

