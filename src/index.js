import Phaser from "phaser";
import logoImg from "./assets/logo.png";
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
    //this.load.image("logo", logoImg);
    this.load.image("map", mapImg);
    this.load.image("player", playerImg);
  }

  create() {
    const map = this.add.image(400, 300,"map");
    map.scale = map.scale*1.75;

    player = this.physics.add.image(400,300,"player");
    player.scale = player.scale/2
    player.setDamping(true);
    player.setBounce(1);
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(200);
    

    cursors = this.input.keyboard.createCursorKeys();
    text = this.add.text(10,10,'', {font: '16px Courier', fill: '#00ff00'});

    //map.displayWidth = this.sys.canvas.width;
    //map.displayHeight = this.sys.canvas.height;

    /* const logo = this.add.image(400, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1, 
    }); */
  }

  update() {
    player.setAcceleration(0);
    player.setDrag(0);
    player.body.angularVelocity = 0;

    if (cursors.up.isDown) {
      player.body.acceleration.setToPolar(player.rotation, 100);
    } 
    else if (cursors.down.isDown) {
      player.setDrag(0.90);
    } 
    else {
      player.setDrag(0.98);
    }

    if (cursors.left.isDown)
    {
        player.setAngularVelocity(-100);
    }
    else if (cursors.right.isDown)
    {
        player.setAngularVelocity(100);
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

