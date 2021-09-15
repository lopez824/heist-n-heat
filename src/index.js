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
    this.cameras.main.setBounds(0, 0, 2150, 2525);
    const map = this.add.image(850, 1000,"map");
    map.scale = map.scale*3;

    const cash1 = this.matter.add.sprite(230, 210,'cash').setStatic(true).setSensor(true);
    const cash2 = this.matter.add.sprite(552, 175,'cash').setStatic(true).setSensor(true);
    const cash3 = this.matter.add.sprite(430, 450,'cash').setStatic(true).setSensor(true);

    player = this.matter.add.sprite(400,320,"player");
    player.body.gameObject.name = "Player";
    player.setBody({
      type: 'rectangle',
      width: 90,
      height: 50
    });
    player.setScale(0.5);
    player.setMass(30);
    player.setFrictionAir(0.1);
    player.setFixedRotation();
    
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    debugText = this.add.text(10,20,'', {font: '16px Courier', fill: '#ffffff'});
    text = this.add.text(10,0,'', {font: '16px Courier', fill: '#ffffff'});

    score = 0;

    this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
        if (bodyA.gameObject.texture.key == "cash" && bodyB.gameObject.texture.key == "player") {
          score += 100;
          bodyA.gameObject.destroy();
        }
    });

    this.matter.world.setBounds(0, 0, 2150, 2525);
  }

  update() {
    this.cameras.main.centerOn(player.x,player.y);
    player.thrust(0.03);
    
    if (cursors.up.isDown) {
      //player.body.acceleration.setToPolar(player.rotation, 300);
    } 
    else if (cursors.down.isDown) {
      //player.setDrag(0.25);
    } 
    else {
      //player.setDrag(0.25);
    }

    if (cursors.left.isDown || keyA.isDown)
    {
      player.angle -= 2.5;
      //player.thrust(0.005);
      //player.setVelocityY(100);
      //this.time.addEvent({ delay: 100, callback: () => player.setDrag(.01)});
    }
    else if (cursors.right.isDown || keyD.isDown)
    {
      player.angle += 2.5;
      //player.thrust(0.005);
      //player.setVelocityY(100);
      //this.time.addEvent({ delay: 100, callback: () => player.setDrag(.01)});
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

