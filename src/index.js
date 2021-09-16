import Phaser from "phaser";
import mapJSON from "./assets/map.json";
import tileImg from "./assets/TileSet.png"
import playerImg from "./assets/Car_Placeholder.png";
import copBWImg from "./assets/CopBW.png";
import DftImg from './assets/drift_trail.png';
import cashImg from './assets/Cash.png';
import "./index.css";

var player;
var Dtrail;
var copBW;
var cursors;
var keyA;
var keyD;
var text;
var score;
var fuel
var debugText;

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
    
    const cash1 = this.matter.add.sprite(230, 210,'cash').setStatic(true).setSensor(true);
    const cash2 = this.matter.add.sprite(552, 175,'cash').setStatic(true).setSensor(true);
    const cash3 = this.matter.add.sprite(430, 450,'cash').setStatic(true).setSensor(true);

    //initialize player
    player = this.matter.add.sprite(400,320,"player");
    player.setBody({    // adjust player hitbox size
      type: 'rectangle',
      width: 90,
      height: 50
    });

    copBW = this.matter.add.sprite(200,320, "copBW");
    copBW.setBody({    
      type: 'rectangle',
      width: 22,
      height: 32
    });

    // matterJS properties
    player.setScale(0.5);
    player.setMass(30);
    player.setFrictionAir(0.1);
    player.setFixedRotation();
    
    copBW.setScale(1.25);
    copBW.setMass(30);
    copBW.setFrictionAir(0.1);
    copBW.setFixedRotation();
    
    // initialize User Interface
    text = this.add.text(10,0,'', {font: '16px Courier', fill: '#ffffff'}).setScrollFactor(0);
    score = 0;
    var graphics = new Phaser.Geom.Rectangle(0, 30, 150, 25);
    fuel = this.add.graphics({ fillStyle: { color: 0x00ff00 } }).setScrollFactor(0);
    fuel.fillRectShape(graphics);
    debugText = this.add.text(10,20,'', {font: '16px Courier', fill: '#ffffff'});

    // set up inputs
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

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

    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update() {
    this.cameras.main.centerOn(player.x,player.y);
    
    player.thrust(0.04);

    if (cursors.up.isDown) {
      this.cameras.main.zoom -= .01;
    }
    if (cursors.left.isDown || keyA.isDown)
    {
      player.angle -= 4;
      Dtrail = this.add.sprite(player.x, player.y, "dft");
    }
    else if (cursors.right.isDown || keyD.isDown)
    {
      player.angle += 4;
      Dtrail = this.add.sprite(player.x, player.y, "dft");
    }

    text.setText('Score: $' + score);
  }
}

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

