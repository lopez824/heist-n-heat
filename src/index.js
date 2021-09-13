import Phaser from 'phaser';
import logoImg from './assets/logo.png';

<<<<<<< Updated upstream
class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
=======
var player;
var cursors;
var text;
var isDrifting;

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
    
    player.setCollideWorldBounds(true);
    player.setMaxVelocity(400);
    

    cursors = this.input.keyboard.createCursorKeys();
    text = this.add.text(10,10,'', {font: '16px Courier', fill: '#ffffff'});
  }

  update() {
    player.setAcceleration(0);
    player.setDrag(0);
    player.body.angularVelocity = 0;

    if (cursors.up.isDown) {
      isDrifting = false;
      player.body.acceleration.setToPolar(player.rotation, 200);
    } 
    else if (cursors.down.isDown) {
      isDrifting = false;
      player.setDrag(0.25);
    } 
    else {
      player.setDrag(0.5);
>>>>>>> Stashed changes
    }

    preload ()
    {
<<<<<<< Updated upstream
        this.load.image('logo', logoImg);
=======

      isDrifting = true;
      player.setAngularVelocity(-300);
>>>>>>> Stashed changes
    }
      
    create ()
    {
<<<<<<< Updated upstream
        const logo = this.add.image(400, 150, 'logo');
      
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });
=======
      isDrifting = true;
      player.setAngularVelocity(300);
    }

    if (isDrifting) {
      player.setDrag(0.1);
      player.setAcceleration(200);
      this.physics.velocityFromRotation(player.rotation, player.body.speed, player.body.velocity);
    }

    if (!cursors.up.isDown && player.body.speed < 3) {
      // Come to a full stop.
      // This also stops rotation.
      player.body.stop();
>>>>>>> Stashed changes
    }
}

const config = {
<<<<<<< Updated upstream
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
=======
  type: Phaser.AUTO,
  parent: "gameContainer",
  width: 800,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      fps: 60,
      gravity: {y:0}
    }
  },
  scene: MyGame
>>>>>>> Stashed changes
};

const game = new Phaser.Game(config);
