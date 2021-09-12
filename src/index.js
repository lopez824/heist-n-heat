import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import mapImg from "./assets/mapExample.png";
import "./index.css"

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("logo", logoImg);
    //this.load.image("map", mapImg);
  }

  create() {
    //this.add.image(800, 600, "map");

    const logo = this.add.image(400, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
    }); 
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "gameContainer",
  width: 800,
  height: 600,
  scene: MyGame
};

const game = new Phaser.Game(config);
