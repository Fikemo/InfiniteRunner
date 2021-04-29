import { State } from "../../lib/StateMachine.js";

export default class Player extends Phaser.Physics.Arcade.Sprite{
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     */
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.anims.play('ninja', true);
        this.isGrounded = false;
        this.health = 5;
        this.invicible = false;
        this.jumpsRemaining = 0;
        this.fsm = scene.playerFSM;
    }
}

class RunningState extends State {
    enter(scene, player){
        player.anims.play('ninja', true);
        // console.log(player.invicible);
        if (player.invicible){
            // TODO: No magic numbers
            this.invicibleTimer = scene.time.delayedCall(1000, () => {player.invicible = false;});
        }
    }

    execute(scene, player){
        const { left, right, up, down, space, shift } = scene.cursors;

        // trasition to jump
        if (Phaser.Input.Keyboard.JustDown(space)){
            // console.log('jump initiated');
            // TODO: No magic numbers
            player.jumpsRemaining = 1;
            this.stateMachine.transition('jumping');
            return;
        }
    }
}

class JumpingState extends State {
    enter(scene, player){
        player.anims.stop();
    }

    execute(scene, player){
        const { left, right, up, down, space, shift } = scene.cursors;

        let jumping = true;

        // TODO: No magic numbers
        if (player.jumpsRemaining > 0 && Phaser.Input.Keyboard.DownDuration(space, 200)){
            player.body.velocity.y = -600;
        }

        if (Phaser.Input.Keyboard.UpDuration(space)){
            player.jumpsRemaining--;
        }

        if (player.body.velocity.y < 0){
            jumping = true;
        } else {
            jumping = false;
        }

        if (player.body.touching.down && jumping == false) {
            // console.log("landed");
            this.stateMachine.transition('running');
        }
    }
}

class AttackingState extends State {
    enter(scene, player){

    }

    execute(scene, player){
        
    }
}

class AttackingInAirState extends State {
    enter(scene, player){

    }

    execute(scene, player){
        
    }
}

class HurtState extends State {
    enter(scene, player){
        // TODO: reduce player health
        console.log('hurt');
        player.invicible = true;
        this.recovered = false;
        this.touchedDown = player.body.touching.down;
        this.timerStarted = false;
    }

    execute(scene, player){
        this.touchedDown = player.body.touching.down;
        if (this.touchedDown && !this.timerStarted){
            // TODO: No magic numbers
            // TODO: Maybe make the recover based on the end of a recovery animation rather than a timer
            this.timer = scene.time.delayedCall(500, () => {this.recovered = true;});
            this.timerStarted = true;
        }

        if (this.touchedDown && this.recovered == true) { this.stateMachine.transition('running')};
    }
}

export { RunningState, JumpingState, AttackingState, HurtState, AttackingInAirState }
