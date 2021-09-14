import Phaser from "phaser";
import mapImg from "./assets/mapExample.png";
import playerImg from "./assets/Car_Placeholder.png"
import "./index.css"

var player;
var cursors;
var text;

class MyGame extends Phaser.Scene {

  constructor() {
    super();
  }
  
  preload() {
    this.load.image("map", mapImg);
    this.load.image("player", playerImg);
  }

  create() {
    const map = this.add.image(400, 300,"map");
    map.scale = map.scale*1.75;

    player = this.physics.add.image(400,300,"player");
    player.scale = player.scale/2;
    player.setDamping(true);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(300);
    cursors = this.input.keyboard.createCursorKeys();
    text = this.add.text(10,10,'', {font: '16px Courier', fill: '#00ff00'});
  }

  update() {
    player.setAcceleration(0);
    player.setDrag(0);
    player.body.angularVelocity = 0;

    if (cursors.up.isDown) {
      player.body.acceleration.setToPolar(player.rotation, 300);
    } 
    else if (cursors.down.isDown) {
      player.setDrag(0.25);
    } 
    else {
      player.setDrag(0.25);
    }

    if (cursors.left.isDown)
    {
      player.rotation -= .03;
      player.setVelocityY(150);
      this.time.addEvent({ delay: 100, callback: () => player.body.speed += 5});
    }
    else if (cursors.right.isDown)
    {
      player.rotation += .03;
      player.setVelocityY(150);
      this.time.addEvent({ delay: 100, callback: () => player.body.speed += 5});
    }

    this.physics.velocityFromRotation(player.rotation, player.body.speed, player.body.velocity);

    if (!cursors.up.isDown && player.body.speed < 3) {
      // Come to a full stop.
      // This also stops rotation.
      player.body.stop();
    }

    text.setText('Speed: ' + player.body.speed);
    this.physics.world.wrap(player, 32);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      fps: 60,
      gravity: {y:0}
    }
  },
  scene: MyGame
};

const game = new Phaser.Game(config);

