var inPursuit;
var isTurning;
var direction;
var speed;
var game;

export default class Cop extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture) {
        super (scene.matter.world, x, y, texture);
        game = scene;
        scene.add.existing(this);
    }

    // sets MatterJS properties
    initialize(s) {
        speed = s;
        inPursuit = false;
        direction = "Up";
        this.setBody({    
            type: 'rectangle',
            width: 28,
            height: 20
          });

        this.setScale(1.25);
        this.setMass(30);
        this.setFrictionAir(0.1);
        this.setFixedRotation();
    }

    // sets cop direction, AI state, and speed
    update(player) {
        const distance = Math.sqrt((Math.pow((player.x - this.x),2)) + (Math.pow((player.y - this.y),2)));

        if (isTurning) {
            this.thrust(speed - .001)
        }
        else {
            this.thrust(speed);
        }
        if (distance < 200) {
            game.time.addEvent({
                delay: 600,
                callback: ()=>{
                  //  inPursuit = true;
                }
            });
        }
        
        if (this.angle >= -20 && this.angle <= 20) {
            direction = "Right";
        }
        else if (this.angle >= 30 && this.angle <= 110) {
            direction = "Down";
        }
        else if (this.angle >= 160 || this.angle <= -160) {
            direction = "Left";
        }
        else if (this.angle >= -110 && this.angle <= -30) {
            direction = "Up";
        }
        if (inPursuit) {
            const theta = Math.atan2((player.y - this.y), (player.x - this.x));
            this.angle = theta*(180/Math.PI);
        }
    }

    setTurning(turning) {
        isTurning = turning;
    }

    // toggles chase state for cop
    setChase(isChasing) {
        inPursuit = isChasing;
    }

    // returns direction of cop
    getDirection() {
        return direction;
    }
}