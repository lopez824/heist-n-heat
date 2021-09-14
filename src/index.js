import Phaser from "phaser";
import mapImg from "./assets/mapExample.png";
import playerImg from "./assets/Car_Placeholder.png";
import flagImg from './assets/SpecialFlag.png';
import "./index.css"

var player;
var flags;
var cursors;
var text;
var score;

class MyGame extends Phaser.Scene {

  constructor() {
    super();
  }
  
  preload() {
    this.load.image("map", mapImg);
    this.load.image("player", playerImg);
    this.load.image("flag", flagImg);
  }

  create() {
    const map = this.add.image(400, 320,"map");
    map.scale = map.scale*1.75;

    const flag1 = this.physics.add.image(248, 210,'flag');
    flag1.scale = flag1.scale/4;
    const flag2 = this.physics.add.image(552, 310,'flag');
    flag2.scale = flag2.scale/4;
    const flag3 = this.physics.add.image(430, 420,'flag');
    flag3.scale = flag3.scale/4;

    player = this.physics.add.image(400,320,"player");
    player.scale = player.scale/2;
    player.setDamping(true);
    //player.setCollideWorldBounds(true);
    player.setMaxVelocity(300);
    cursors = this.input.keyboard.createCursorKeys();
    text = this.add.text(10,10,'', {font: '16px Courier', fill: '#ffffff'});
    score = 0;

    this.physics.add.collider(player, flag1, function (player,flag1) {
        score += 100;
        flag1.destroy();
    }); 
    this.physics.add.collider(player, flag2, function (player,flag2) {
      score += 100;
      flag2.destroy();
    }); 
    this.physics.add.collider(player, flag3, function (player,flag3) {
      score += 100;
      flag3.destroy();
    }); 
  }

  update() {
    player.setVelocity(200,200);
    //player.setAcceleration(0);
    //player.setDrag(0);
    player.body.angularVelocity = 0;

    if (cursors.up.isDown) {
      //player.body.acceleration.setToPolar(player.rotation, 300);
    } 
    else if (cursors.down.isDown) {
      //player.setDrag(0.25);
    } 
    else {
      //player.setDrag(0.25);
    }

    if (cursors.left.isDown)
    {
      player.rotation -= .03;
      player.setVelocityY(100);
      this.time.addEvent({ delay: 100, callback: () => player.setDrag(.01)});
    }
    else if (cursors.right.isDown)
    {
      player.rotation += .03;
      player.setVelocityY(100);
      this.time.addEvent({ delay: 100, callback: () => player.setDrag(.01)});
    }

    this.physics.velocityFromRotation(player.rotation, player.body.speed, player.body.velocity);

    /* if (!cursors.up.isDown && player.body.speed < 3) {
      // Come to a full stop.
      // This also stops rotation.
      player.body.stop();
    } */

    text.setText('Score: ' + score);
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

