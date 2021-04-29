import { StateMachine } from "../../lib/StateMachine.js";
import { RunningState, JumpingState, AttackingState, HurtState, AttackingInAirState } from "../prefabs/Player.js";
import game from "../main.js";
import Enemy from "../prefabs/Enemy.js";
import Player from "../prefabs/Player.js";
import PlayerAttackHitbox from "../prefabs/PlayerAttackHitbox.js";

export default class Play extends Phaser.Scene{
    scrollSpeed;

    // enemy control
    enemySpawnRate; // the time between an enemy becoming inactive and another enemy can be spawned
    enemyCount;     // the amount of currently active enemies
    maxEnemyCount;  // the maximum number of active enemies there can be
    // NOTE: At the moment, an enemy becomes inactive when they are half way accross the screen
    // TODO: Have 'spawn sectors' control the time between enemy spawns independantly

    // the coordinates for the player spawn
    playerSpawnX;
    playerSpawnY;

    constructor(){
        super("playScene");
    }

    init(){
        this.scrollSpeed = 5;
        this.enemyCount = 0;
        this.maxEnemyCount = 2;

        this.playerSpawnX = 120;
        this.playerSpawnY = this.scale.height / 2;
    }

    preload(){
        console.log('play loaded');
    }

    create(){

        // add cursor buttons
        // TODO: Instead of using cursors, use space to jump and ASDF for other things
        this.cursors = this.input.keyboard.createCursorKeys();

        // create background
        //this.background = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'background').setOrigin(0);
        this.sky = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'sky').setOrigin(0);
        // this.sun = this.add.tileSprite(this.scale.width * 0.25, -80 , this.scale.width, this.scale.height, 'sun').setOrigin(0);
        this.evening_sun = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'evening_sun').setOrigin(0);
        this.background03 = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'background03').setOrigin(0);
        this.haze = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'haze').setOrigin(0);
        this.background02 = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'background02').setOrigin(0);
        this.background01 = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'background01').setOrigin(0);
        this.add.rectangle(800, 20, 420, 80, 0xBBBBBB).setOrigin(0, 0);
        this.add.rectangle(810, 30, 420, 60, 0x888888).setOrigin(0, 0);
        this.heart = this.add.image(820, 40, 'heart').setOrigin(0, 0);
        this.heart = this.add.image(890, 40, 'heart').setOrigin(0, 0);

        // play the bgm
        this.bgm = this.sound.add('bgm', {volume: 0.1, loop: true});
        this.bgm.play();

        // create the ground tiles
        let tileSize = 32;
        this.ground = this.add.group();
        for (let i = 0; i < this.scale.width; i += tileSize){
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'groundTile').setScale(1).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        this.groundScroll = this.add.tileSprite(0, this.scale.height - tileSize, this.scale.width, tileSize, 'groundTile').setOrigin(0);

        // create the player and their state machine
        this.player = new Player(this, this.playerSpawnX, this.playerSpawnY, 'ninja');
        this.playerFSM = new StateMachine('running', {
            running: new RunningState(),
            jumping: new JumpingState(),
            attacking: new AttackingState(),
            attackingInAir: new AttackingInAirState(),
            hurt: new HurtState(),
        }, [this, this.player]);

        // create player attack hitbox
        this.playerAttackHitbox = new PlayerAttackHitbox(this);

        // add collision between player and the ground
        this.physics.add.collider(this.player, this.ground);

        // make sure that update is run on the group of enemy's
        // this actually makes it so we don't have to call the enemies' update() in this scene's update()
        this.enemyGroup = this.add.group({
            runChildUpdate: true
        })

        /** @type {Phaser.Math.Vector2} */
        let testVec2 = new Phaser.Math.Vector2(1,2);
    }

    update(time, delta){
        let deltaMultiplier = (delta/(16 + 2/3));

        // this.background.tilePositionX += ( this.scrollSpeed / 4) * deltaMultiplier;
        this.background01.tilePositionX += (this.scrollSpeed * 0.9) * deltaMultiplier;
        this.background02.tilePositionX += (this.scrollSpeed * 0.6) * deltaMultiplier;
        this.background03.tilePositionX += (this.scrollSpeed * 0.3) * deltaMultiplier;
        this.groundScroll.tilePositionX += (this.scrollSpeed)       * deltaMultiplier;

        this.playerFSM.step();

        // update playerAttackHitbox
        this.playerAttackHitbox.update();

        // check for down arrow press for attack
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)){
            this.playerAttackHitbox.setActive();
        }
        // check enemy and player attack hitbox overlap while the hitbox is in an attack
        if (this.playerAttackHitbox.getAttacking()){
            this.physics.overlap(this.playerAttackHitbox, this.enemyGroup, this.destroyEnemy, null, this);
        }

        // run enemy spawn
        if (this.enemyCount < this.maxEnemyCount){
            this.addEnemy();
        }

        // player enemy collision
        this.physics.overlap(this.player, this.enemyGroup, this.hurtPlayer, () => {return !this.player.invicible}, this);
    }

    hurtPlayer(player, enemy){
        // console.log(this.playerFSM);
        if (!enemy.alreadyOverlapping){
            this.playerFSM.transition('hurt');
            enemy.alreadyOverlapping = true;
        }
    }

    /**Create a new enemy and add it to the enemyGroup() */
    addEnemy(){
        let enemy = new Enemy(this, 'enemy', 'idle');
        enemy.FSM = new StateMachine('arriving', {

        }, [this, enemy]);
        this.enemyGroup.add(enemy);
    }

    /**
     * Destroy the enemy that overlaped with the hitbox
     * @param {Phaser.Physics.Arcade.Sprite} hitbox
     * @param {Phaser.Physics.Arcade.Sprite} enemy
     */
    destroyEnemy(hitbox, enemy){
        enemy.destroy();
    }
}