var turning;
var direction;

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y) {
        super (scene.matter.world, x, y);
        scene.add.existing(this);
    }

    // sets MatterJS properties
    initialize() {
        direction = "Up";
        turning = false;
        this.setBody({    
            type: 'rectangle',
            width: 86,
            height: 46
          });

        this.setScale(0.5);
        this.setMass(30);
        this.setFrictionAir(0.1);
        this.setFixedRotation();
    }

    // Sets player direction for cop AI and speed
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

    isTurning() {
        return turning;
    }

    // returns player direction
    getDirection() {
        return direction;
    }
}