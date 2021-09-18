var direction;

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y) {
        super (scene.matter.world, x, y);
        scene.add.existing(this);
    }

    // sets MatterJS properties
    initialize() {
        direction = "Up";
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
        if (this.angle >= -20 && this.angle <= 20) {
            direction = "Right";
        }
        else if (this.angle >= 70 && this.angle <= 110) {
            direction = "Down";
        }
        else if (this.angle >= 160 || this.angle <= -160) {
            direction = "Left";
        }
        else if (this.angle >= -110 && this.angle <= -70) {
            direction = "Up";
        }
    }

    getDirection() {
        return direction;
    }
}