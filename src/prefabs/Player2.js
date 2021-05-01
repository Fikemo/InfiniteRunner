import { State } from "../../lib/StateMachine.js";
import PlayerAttackHitbox from "./PlayerAttackHitbox.js";

class Player extends Phaser.Physics.Arcade.Sprite{
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     * @param {PlayerAttackHitbox} attackHitbox
     */
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.anims.play('ninja', true);
        this.isGrounded = false;
        this.maxHealth = 2;
        this.currentHealth = 2;
        this.UINeedsUpdate = true;

        this.stats = {
            player: null,

            cH: 2,
            get currentHealth() { return this.cH; },
            set currentHealth(value) {
                this.cH = value;
                if (this.player){ this.player.UINeedsUpdate = true; }
            },

            mH: 2,
            get maxHealth() { return this.mH; },
            set maxHealth(value) {
                this.mH = value;
                if (this.player){ this.player.UINeedsUpdate = true; }
            },
        }
        this.stats.player = this;

        this.invicible = false;
        this.jumpsRemaining = 0;
        this.fsm = scene.playerFSM;
    }

    update(){

    }
}

class RunningState extends State {
    enter(scene, player){
        player.anims.play('ninja_run', true);
        // console.log(player.invicible);
        if (player.invicible){
            // TODO: No magic numbers
            this.invicibleTimer = scene.time.delayedCall(1000, () => {player.invicible = false;});
        }
    }

    execute(scene, player){
        const { left, right, up, down, space, shift } = scene.cursors;
        player.alpha = player.invicible ? 0.5 : 1;

        // trasition to jump
        if (Phaser.Input.Keyboard.JustDown(space)){
            // console.log('jump initiated');
            // TODO: No magic numbers
            player.jumpsRemaining = 1;
            this.stateMachine.transition('jumping');
            return;
        }

        player.update();
    }
}

class JumpingState extends State {
    enter(scene, player){
        player.anims.play('ninja_jump');
    }
    /**
     * @param {Phaser.Scene} scene
     * @param {Player} player
    */
    execute(scene, player){
        const { left, right, up, down, space, shift } = scene.cursors;

        let jumping = true;

        // TODO: No magic numbers
        if (player.jumpsRemaining > 0 && Phaser.Input.Keyboard.DownDuration(space, 200)){
            player.body.velocity.y = -600;
            // player.hitboxes.getChildren().forEach(h => {h.body.velocity.y = -600});
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

        player.update();
    }
}

class AttackingState extends State {
    enter(scene, player){
        // player.attackHitbox.attacking = true;
    }

    execute(scene, player){
        

        player.update();
    }

    exit(scene, player){
        // player.attackHitbox.attacking = false;
    }
}

class AttackingInAirState extends State {
    enter(scene, player){

    }

    execute(scene, player){
        

        player.update();
    }
}

class HurtState extends State {
    enter(scene, player){
        // TODO: reduce player health
        // console.log('hurt');
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

        player.update();
    }
}

export { Player, RunningState, JumpingState, AttackingState, HurtState, AttackingInAirState }
