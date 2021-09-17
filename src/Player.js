export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture) {
        super (scene.matter.world, x, y, texture);
        scene.add.existing(this);
    }

    // sets MatterJS properties
    initialize() {
        this.setBody({    
            type: 'rectangle',
            width: 90,
            height: 50
          });

        this.setScale(0.5);
        this.setMass(30);
        this.setFrictionAir(0.1);
        this.setFixedRotation();
    }

    update() {
        this.thrust(0.04);
    }
}