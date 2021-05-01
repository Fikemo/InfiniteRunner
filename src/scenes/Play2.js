import { StateMachine } from "../../lib/StateMachine.js";
import { Player, RunningState, JumpingState, AttackingState, HurtState, AttackingInAirState } from "../prefabs/Player.js";
import game from "../main.js";
import Enemy from "../prefabs/Enemy.js";
import PlayerAttackHitbox from "../prefabs/PlayerAttackHitbox.js";

export default class Play2 extends Phaser.Scene{
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
        super("playScene2");
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
        // creat dat gui
        this.gui = new dat.GUI();

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
        // this.add.rectangle(800, 20, 420, 80, 0xBBBBBB).setOrigin(0, 0);
        // this.add.rectangle(810, 30, 420, 60, 0x888888).setOrigin(0, 0);
        // this.heart = this.add.image(820, 40, 'heart').setOrigin(0, 0);
        // this.heart2 = this.add.image(890, 40, 'heart').setOrigin(0, 0);

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
        this.player = new Player(this, this.playerSpawnX, this.playerSpawnY, 'ninja_run');
        this.player.body.setSize(this.player.width * 0.56, this.player.height * 0.76);
        this.player.body.setOffset(this.player.width * 0.46, this.player.height * (1 - 0.76))
        this.player.damageBody = 
        this.playerFSM = new StateMachine('running', {
            running: new RunningState(),
            jumping: new JumpingState(),
            attacking: new AttackingState(),
            attackingInAir: new AttackingInAirState(),
            hurt: new HurtState(),
        }, [this, this.player]);
        this.playerMaxHealthDebug = 10;
        let playerFolder = this.gui.addFolder('Player Parameters');
        playerFolder.add(this.player.stats, 'currentHealth', 0, this.playerMaxHealthDebug, 1);
        playerFolder.add(this.player.stats, 'maxHealth', 0, this.playerMaxHealthDebug, 1);
        playerFolder.open();

        // create player attack hitbox
        this.playerAttackHitbox = new PlayerAttackHitbox(this);
        // this.player.addChild(this.playerAttackHitbox);
        
        // health bar
        let healthbarCoords = new Phaser.Math.Vector2(32,32);
        let healthbarSegmentWidth = 40;
        this.maxHealthDisplay = [];
        for (let i = 0; i < this.playerMaxHealthDebug; i++){
            this.maxHealthDisplay.push(this.add.image(healthbarCoords.x + healthbarSegmentWidth * i, healthbarCoords.y, 'health_background').setOrigin(0));
        }

        this.emptyHealthDisplay = [];
        for (let i = 0; i < this.playerMaxHealthDebug; i++){
            this.emptyHealthDisplay.push(this.add.image(healthbarCoords.x + healthbarSegmentWidth * i + 8, healthbarCoords.y + 4, 'health_empty').setOrigin(0));
        }

        this.filledHealthDisplay = [];
        for (let i = 0; i < this.playerMaxHealthDebug; i++){
            this.filledHealthDisplay.push(this.add.image(healthbarCoords.x + healthbarSegmentWidth * i + 8, healthbarCoords.y + 4, 'health_filled').setOrigin(0));
        }

        // add collision between player and the ground
        this.physics.add.collider(this.player, this.ground);

        // make sure that update is run on the group of enemy's
        // this actually makes it so we don't have to call the enemies' update() in this scene's update()
        this.enemyGroup = this.add.group({
            runChildUpdate: true
        })
    }

    update(time, delta){
        let deltaMultiplier = (delta/(16 + 2/3));

        // this.background.tilePositionX += ( this.scrollSpeed / 4) * deltaMultiplier;
        this.background01.tilePositionX += (this.scrollSpeed * 0.9) * deltaMultiplier;
        this.background02.tilePositionX += (this.scrollSpeed * 0.6) * deltaMultiplier;
        this.background03.tilePositionX += (this.scrollSpeed * 0.3) * deltaMultiplier;
        this.groundScroll.tilePositionX += (this.scrollSpeed)       * deltaMultiplier;

        this.playerFSM.step();
        // if the player's stats (health, score) have been changed, update the ui
        if (this.player.UINeedsUpdate) {
            // console.log("UI needs update");
            // if (this.player.stats.currentHealth > this.player.stats.maxHealth) {this.player.stats.maxHealth = this.player.stats.currentHealth;}

            for (let i = 0; i < this.maxHealthDisplay.length; i++){
                if (i > this.player.stats.maxHealth - 1){
                    this.maxHealthDisplay[i].alpha = 0;
                    this.emptyHealthDisplay[i].alpha = 0;
                } else {
                    this.maxHealthDisplay[i].alpha = 1;
                    this.emptyHealthDisplay[i].alpha = 1;
                }

                if (i > this.player.stats.currentHealth - 1){
                    this.filledHealthDisplay[i].alpha = 0;
                } else {
                    this.filledHealthDisplay[i].alpha = 1;
                }
            }

            this.player.UINeedsUpdate = false;
        }

        // update playerAttackHitbox
        // this.playerAttackHitbox.update();

        // check for down arrow press for attack
        // if (Phaser.Input.Keyboard.JustDown(this.cursors.down)){
        //     this.playerAttackHitbox.setActive();
        // }
        // check enemy and player attack hitbox overlap while the hitbox is in an attack
        // if (this.playerAttackHitbox.getAttacking()){
        //     this.physics.overlap(this.playerAttackHitbox, this.enemyGroup, this.destroyEnemy, null, this);
        // }

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