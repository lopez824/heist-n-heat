var inPursuit;
var direction;

export default class Cop extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture) {
        super (scene.matter.world, x, y, texture);
        scene.add.existing(this);
    }

    // sets MatterJS properties
    initialize() {
        inPursuit = false;
        direction = "Up";
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

    update(player) {
        this.thrust(0.042);
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
        if (inPursuit) {
            const theta = Math.atan2((player.y - this.y), (player.x - this.x));
            this.angle = theta*(180/Math.PI);
        }
    }

    getDirection() {
        return direction;
    }
}