import { State, StateMachine } from "../../lib/StateMachine.js";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, spawner, difficutly){
        super (
            scene,
            scene.scale.width + 32,
            spawner.y,
            texture
        )
        this.difficutly = difficutly;

        this.FSM = new StateMachine('arriving',{
            arriving: new ArrivingState(),
            idle: new IdleState(),
            charging: new ChargingState(),
            hurt: new HurtState(),
            dead: new DeadState(),
        },[scene, this]);
        this.spawner = spawner;

        this.sfx_destroy = scene.sound.add('sfx_destroy', {volume: 0.2});
        this.sfx_charge = scene.sound.add('sfx_charge');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setCircle((this.width / 2) - 2, 2, 2);
        this.newEnemy = true;

        switch (difficutly){
            case 'easy':
                this.acceleration = -3000;
                this.maxSpeed = 700;
                this.minIdleTime = 500;
                this.maxIdleTime = 2000;
                this.health = 1;
                this.damage = 1;
                this.pointValue = 100;
                this.hurtStateVelocity = -100;
                this.spawnerDeactivationX = -this.width;
            break;
            case 'medium':
                this.acceleration = -4000;
                this.maxSpeed = 900;
                this.minIdleTime = 500;
                this.maxIdleTime = 1000;
                this.health = 2;
                this.damage = 1;
                this.pointValue = 150;
                this.hurtStateVelocity = -100;
                this.spawnerDeactivationX = -this.width;
            break;
            case 'hard':
                this.acceleration = -4000;
                this.maxSpeed = 1100;
                this.minIdleTime = 500;
                this.maxIdleTime = 750;
                this.health = 3;
                this.damage = 1;
                this.pointValue = 200;
                this.hurtStateVelocity = -100;
                this.spawnerDeactivationX = -this.width; //this.scene.scale.width / 2;
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
        enemy.sfx_charge.play();
    }

    execute(scene, enemy){
        if (enemy.x < enemy.spawnerDeactivationX){
            if (enemy.newEnemy){
                enemy.spawner.deactivate();
                enemy.newEnemy = false;
            }
        }
        
        if (enemy.x < -enemy.width){
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
        enemy.anims.play(`${enemy.difficutly}_destroy`);
        enemy.sfx_destroy.play();
        enemy.setAccelerationX(0);
        enemy.setVelocityX(enemy.hurtStateVelocity);
        scene.player.score += enemy.pointValue;
        enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            enemy.spawner.deactivate();
            enemy.FSM.transition('dead', true);
        })
    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}

class DeadState extends State{
    enter(scene, enemy, killedByPlayer){
        if (killedByPlayer){
            // enemy.spawner.deactivate();
            // scene.player.score += enemy.pointValue;
        }
        enemy.destroy();
    }

    execute(scene, enemy){

    }

    exit(scene, enemy){

    }
}