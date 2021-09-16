import Phaser from "phaser";
import mapImg from "./assets/mapExample.png";
import playerImg from "./assets/Car_Placeholder.png";
import cashImg from './assets/Cash.png';
import "./index.css"

var player;
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
    this.load.image("map", mapImg);
    this.load.image("player", playerImg);
    this.load.image("cash", cashImg);
  }

  create() {
    
    // initialize map
    this.cameras.main.setBounds(0, 0, 2150, 2525);
    const map = this.add.image(850, 1000,"map");
    map.scale = map.scale*3;
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

    // matterJS properties
    player.setScale(0.5);
    player.setMass(30);
    player.setFrictionAir(0.1);
    player.setFixedRotation();
    
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

    this.matter.world.setBounds(0, 0, 2150, 2525);  // sets game world bounds
  }

  update() {
    this.cameras.main.centerOn(player.x,player.y);
    player.thrust(0.06);

    if (cursors.left.isDown || keyA.isDown)
    {
      player.angle -= 5;
    }
    else if (cursors.right.isDown || keyD.isDown)
    {
      player.angle += 5;
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

