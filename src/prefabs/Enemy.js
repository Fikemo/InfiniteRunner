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

        switch (difficutly){
            case 'easy':
                this.acceleration = -3000;
                this.maxSpeed = 700;
                this.minIdleTime = 1000;
                this.maxIdleTime = 3000;
                this.health = 1;
                this.damage = 1;
                this.pointValue = 100;
                this.hurtStateVelocity = -200;
            break;
            case 'medium':
                this.acceleration = -4000;
                this.maxSpeed = 900;
                this.minIdleTime = 500;
                this.maxIdleTime = 3000;
                this.health = 2;
                this.damage = 1;
                this.pointValue = 150;
                this.hurtStateVelocity = -200;
            break;
            case 'hard':
                this.acceleration = -4000;
                this.maxSpeed = 1100;
                this.minIdleTime = 500;
                this.maxIdleTime = 1500;
                this.health = 3;
                this.damage = 1;
                this.pointValue = 200;
                this.hurtStateVelocity = -200;
            break;
        }
        
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
        scene.time.delayedCall(Phaser.Math.Between(enemy.minIdleTime, enemy.maxIdleTime), () => {enemy.FSM.transition('charging')});
    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}

class ChargingState extends State{
    enter(scene, enemy){
        enemy.setAccelerationX(enemy.acceleration);
        enemy.setMaxVelocity(enemy.maxSpeed);
    }

    execute(scene, enemy){
        if (enemy.x < - enemy.width){
            enemy.FSM.transition('dead', false);
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
        this.setAccelerationX(0);
        this.setVelocityX(enemy.hurtStateVelocity);
    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}

class DeadState extends State{
    enter(scene, enemy, killByPlayer){
        enemy.spawner.deactivate();
        if (killByPlayer) scene.player.score += enemy.pointValue;
        enemy.destroy();
    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}