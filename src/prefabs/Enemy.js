import { State, StateMachine } from "../../lib/StateMachine.js";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, spawner, difficutly){
        super (
            scene,
            scene.scale.width + 32,
            spawner.y,
            texture
        )

        this.FSM = new StateMachine('arriving',{
            arriving: new ArrivingState(),
            idle: new IdleState(),
            charging: new ChargingState(),
            dead: new DeadState(),
        },[scene, this]);
        this.spawner = spawner;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setCircle((this.width / 2) - 2, 2, 2);
        // this.setOrigin(0.5);

        this.acceleration = -2000;
        this.maxSpeed = 500;
        
    }

    update(time, delta){
        this.FSM.step();
    }
}

class ArrivingState extends State{
    enter(scene, enemy){

        // moving in tween
        scene.tweens.add({
            targets: enemy,
            x: enemy.spawner.x,
            ease: 'Quad.easeOut',
            duration: 1000,
            onComplete: () => { enemy.FSM.transition('idle') },
            onCompleteScope: enemy,
        })

        // bob up and down tween
        scene.tweens.add({
            targets: enemy,
            y: enemy.spawner.y + 5,
            ease: 'Quad.easeInOut',
            yoyo: true,
            repeat: -1,
            duration: 500,
        })
    }

    execute(scene, enemy){
        
    }

    exit(scene, enemy){

    }
}

class IdleState extends State{
    enter(scene, enemy){
        // console.log('entered idle');
        scene.time.delayedCall(Phaser.Math.Between(500, 2500), () => {enemy.FSM.transition('charging')});
    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}

class ChargingState extends State{
    enter(scene, enemy){
        console.log('charge');
        enemy.setAccelerationX(enemy.acceleration);
        enemy.setMaxVelocity(enemy.maxSpeed);
    }

    execute(scene, enemy){
        if (enemy.x < - enemy.width){
            enemy.FSM.transition('dead');
        }
    }

    exit(scene, enemy){

    }
}

class ShootingState extends State{
    enter(scene, enemy){

    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}

class HurtState extends State{
    enter(scene, enemy){

    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}

class DeadState extends State{
    enter(scene, enemy){
        enemy.spawner.deactivate();
        enemy.destroy();
    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}