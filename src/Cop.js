export default class Cop extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture) {
        super (scene.matter.world, x, y, texture);
        scene.add.existing(this);
    }

    // sets MatterJS properties
    initialize() {
        this.setBody({    
            type: 'rectangle',
            width: 32,
            height: 22
          });

        this.setScale(1.25);
        this.setMass(30);
        this.setFrictionAir(0.1);
        this.setFixedRotation();
    }

    update() {
        this.thrust(0.042);
    }
}