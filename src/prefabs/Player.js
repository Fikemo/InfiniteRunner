import { State, StateMachine } from "../../lib/StateMachine.js";

/**@type {number} Time in milliseconds for the player to be invincible when in the Running State after being hurt*/
const INVINCIBILITY_TIME = 1000;
/**@type {number} Time in milliseconds for the player to remain in the hurt state when on the ground*/
const HURT_TIME = 1000;
/**@type {number} The velocity applied to the player when they jump*/
const JUMP_VELOCITY = -600;
/**@type {number} Time in milliseconds for how long the jump key can be held*/
const JUMP_TIMER = 200;

export default class Player extends Phaser.Physics.Arcade.Sprite{

    // Special getting and setting functions for current health and max health
    // #cH and #mH are private vairables to the Player class
    // use player.currentHealth and player.maxHealth outside of this class to get and set the values
    // For example, simply use player.maxHealth = 2 or player.currentHealth--
    // whenever you get currentHealth, it will return #cH, same with maxHealth and #mH
    // whenever you set currentHealth, it will set #cH to the new value and set UINeedsUpdate to true since the UI will need to be updated due to this change
    /**@type {number} */
    #cH;
    get currentHealth() {return this.#cH};
    set currentHealth(value) {
        this.#cH = value;
        this.UINeedsUpdate = true;
    }
    /**@type {number} */
    #mH;
    get maxHealth() {return this.#mH};
    set maxHealth(value) {
        this.#mH = value;
        this.UINeedsUpdate = true;
    }

    #s;
    get score() {return this.#s};
    set score(value) {
        this.#s = value;
        this.UINeedsUpdate = true;
    }

    /**@type {bool} if the player's stats have changed and the UI needs to be updated*/
    UINeedsUpdate;
    /**@type {StateMachine} finite state machine for the player*/
    FSM;
    /**@type {PlayerSecondaryHitbox} a collider for where the player's attacks hit*/
    attackHitbox;

    /**@type {bool} if the player is invincible */
    invincible;
    /**@type {bool} if the player is touching the ground */
    grounded;
    /**@type {integer} the number of times the player can jump before landing*/
    maxJumps;
    /**@type {integer} the number jumps left that the player can do before landing*/
    jumpsRemaining;
    
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.currentHealth = 3;
        this.maxHealth = 3;
        this.UINeedsUpdate = true;

        this.FSM = new StateMachine('running', {
            running: new RunningState(),
            jumping: new JumpingState(),
            attacking: new AttackingState(),
            attackingInAir: new AttackingInAirState(),
            hurt: new HurtState(),
            dead: new DeadState(),
        },[scene, this]);

        this.sfx_attack = scene.sound.add('sfx_attack', {volume: 0.1});
        this.sfx_hurt = scene.sound.add('sfx_injured', {volume: 0.2});

        // this.attackHitbox = new PlayerAttackHitbox(scene, x + this.width, y + this.height);
        this.attackHitbox = new PlayerSecondaryHitbox(scene, this, x + this.width, y + this.height, 40, 84, this.body.width,this.body.height - (this.body.halfHeight + 84 / 2), undefined, 'slash');
        this.attackHitbox.attacking = false;
        this.attackHitbox.successfulHit = false;
        this.attackHitbox.alpha = 0;
        this.damageHitbox = new PlayerSecondaryHitbox(scene, this, x, y, 40, 60, this.body.halfWidth - 8, this.body.halfHeight - 30, 0x0000FF);

        this.grounded = false;
        this.invincible = false;
        this.maxJumps = 1;
        this.jumpsRemaining = this.maxJumps;
        this.score = 0;
        this.setOrigin(0,0);

        this.body.overlapX = 32;
    }

    update(time, delta){
        this.FSM.step();

        // update the attack hitbox
        this.attackHitbox.update();

        // update damage hitbox
        this.damageHitbox.update();
    }

    takeDamage(damage){
        if (!this.invincible && !this.attackHitbox.attacking){
            this.currentHealth -= damage;
            this.FSM.transition('hurt');
        }
    }
}

class PlayerSecondaryHitbox extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, player, x, y, width, height, xOffset, yOffset, debugBodyColor = 0xFF0000, texture){
        super(scene, x, y, texture);
        this.player = player;
        this.xOffset = xOffset;
        this.yOffset = yOffset;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(width, height, false);
        this.body.setAllowGravity(false);
        this.setOrigin(0);
        this.setDebugBodyColor(debugBodyColor);
    }
    update(){
        this.body.x = this.player.body.x + this.xOffset;
        this.body.y = this.player.body.y + this.yOffset;
    }
}

class RunningState extends State {
    enter(scene, player){
        // console.log('running');
        player.anims.play('run', true);
        if (player.invincible){
            this.invincibleTimer = scene.time.delayedCall(INVINCIBILITY_TIME, () =>{ player.invincible = false; });
        }
        player.jumpsRemaining = player.maxJumps;
    }

    execute(scene, player){
        const {left, right, up, down, space, shift} = scene.cursors;
        const keySlash = scene.keySlash;
        // console.log(keySlash);

        // make the player semitransparent if they are invincible
        player.alpha = player.invincible ? 0.5 : 1;

        // transition to Jump
        if (Phaser.Input.Keyboard.JustDown(space)){
            player.FSM.transition('jumping');
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(keySlash)){
            player.FSM.transition('attacking');
            return;
        }
    }

    exit(scene, player){

    }
}

class JumpingState extends State {
    enter(scene, player){
        // console.log('jumping');
        player.anims.play('jump');
    }

    execute(scene, player){
        const {left, right, up, down, space, shift} = scene.cursors;
        const keySlash = scene.keySlash;

        if (player.jumpsRemaining > 0 && Phaser.Input.Keyboard.DownDuration(space, JUMP_TIMER)){
            player.body.velocity.y = JUMP_VELOCITY;
        }

        if (Phaser.Input.Keyboard.UpDuration(space)){
            player.jumpsRemaining--;
        }

        if (Phaser.Input.Keyboard.JustDown(keySlash)){
            player.FSM.transition('attackingInAir');
            return;
        }

        let jumping = player.body.velocity.y < 0;

        if (player.body.touching.down && !jumping){
            player.FSM.transition('running');
        }

    }

    exit(scene, player){
        
    }
}

class AttackingState extends State {
    enter(scene, player){
        player.attackHitbox.attacking = true;
        player.anims.play('attack_2', false);
        player.sfx_attack.play();
        player.attackHitbox.alpha = 1;
        player.attackHitbox.anims.play('slash', false);
        scene.time.delayedCall(100, () => {player.attackHitbox.attacking = false});
        player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'attack_2', () => {
            this.deactivate(scene, player);
            scene.time.delayedCall(250, () => {player.FSM.transition('running')});
        })
        player.attackHitbox.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            player.attackHitbox.alpha = 0;
        })
    }

    execute(scene, player){

    }

    exit(scene, player){
        this.deactivate(scene, player);
    }

    deactivate(scene, player){
        player.attackHitbox.attacking = false;
    }
}

class AttackingInAirState extends State {
    enter(scene, player){
        player.attackHitbox.attacking = true;
        player.anims.play('attack_2', false);
        player.sfx_attack.play();
        player.attackHitbox.alpha = 1;
        player.attackHitbox.anims.play('slash', false);
        player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.deactivate(scene, player);
            scene.time.delayedCall(250, () => {player.FSM.transition('running')});
        })
        player.attackHitbox.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            player.attackHitbox.alpha = 0;
        })
    }

    execute(scene, player){

    }

    exit(scene, player){
        
    }

    deactivate(scene, player){
        player.attackHitbox.attacking = false;
    }
}

class HurtState extends State {
    enter(scene, player){
        console.log('hurt');
        player.invincible = true;
        this.recovered = false;
        this.touchedDown = player.body.touching.down;
        this.timerStarted = false;
        player.anims.play('hurt');
        player.sfx_hurt.play();

        player.alpha = 0.5;
    }

    execute(scene, player){
        this.touchedDown = player.body.touching.down;

        if (this.touchedDown && !this.timerStarted){
            // after a certain period of time, the player recovers from being hurt
            this.timer = scene.time.delayedCall(HURT_TIME, () => { this.recovered = true; })
            this.timerStarted = true;
        }

        if (this.touchedDown && this.recovered) { player.FSM.transition('running') };
    }

    exit(scene, player){
        
    }
}

class DeadState extends State {
    enter(scene, player){
        // console.log('dead');
    }

    execute(scene, player){

    }

    exit(scene, player){
        
    }
}