// imports
import game from "../main.js";
import Player from "../prefabs/Player.js";
import Enemy from "../prefabs/Enemy.js";

export default class Play extends Phaser.Scene{
    // world constants
    SCORLL_SPEED;
    TILE_SIZE;
    DEBUG_MAX_PLAYER_HEALTH;

    // enemy control
    enemySpawnRate;
    enemyCount;
    maxEnemyCount;

    // player control
    /**@type {Phaser.Math.Vector2} */
    playerSpawnPos;

    constructor(){
        super ("playScene");
    }

    init(){
        this.SCORLL_SPEED = 5;
        this.TILE_SIZE = 32;
        this.DEBUG_MAX_PLAYER_HEALTH = 10;
        
        this.enemyCount = 0;
        this.maxEnemyCount = 2;
        this.playerSpawnX = 120;
        this.playerSpawnY = this.scale.height / 2;
        this.playerSpawnPos = new Phaser.Math.Vector2(120, this.scale.height / 2);
    }

    preload() {
        console.log('play loaded');
        // this.load.audio('sfx_attack', 'playerAttack.wav');
    }

    create(){
        this.attackSound = this.sound.add('sfx_attack');
        this.playerInjuredSound = this.sound.add('sfx_injured');
        this.enemyMoveSound = this.sound.add('sfx_EMovement');
        this.enemyInjuredSound = this.sound.add('sfx_enemyInjured');
        this.enemyDestroySound = this.sound.add('sfx_destroy');
        // add cursor buttons
        // TODO: Instead of using cursors, use space to jump and ASDF for other things
        this.cursors = this.input.keyboard.createCursorKeys();

        // play bgm
        this.bgm = this.sound.add('bgm', {volume: 0.1, loop: true});
        this.bgm.play();

        // create the background in render order
        this.sky = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'sky').setOrigin(0);
        this.sun = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'evening_sun').setOrigin(0);
        this.background03 = this.add.tileSprite(0,0,this.scale.width, this.scale.height,'background03').setOrigin(0);
        this.haze = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'haze').setOrigin(0);
        this.background02 = this.add.tileSprite(0,0,this.scale.width, this.scale.height,'background02').setOrigin(0);
        this.background01 = this.add.tileSprite(0,0,this.scale.width, this.scale.height,'background01').setOrigin(0);

        // create the ground and tiles
        this.groundHitbox = this.physics.add.sprite(-5 * this.TILE_SIZE, this.scale.height - this.TILE_SIZE);
        this.groundHitbox.body.setImmovable(true);
        this.groundHitbox.body.setAllowGravity(false);
        this.groundHitbox.body.setSize(this.scale.width + 5 * this.TILE_SIZE, this.TILE_SIZE, false);
        this.groundHitbox.setOrigin(0);

        this.groundTiles = this.add.tileSprite(0, this.scale.height - this.TILE_SIZE, this.scale.width, this.TILE_SIZE, 'groundTile').setOrigin(0);

        // create the player 🐱‍👤
        this.player = new Player(this, this.playerSpawnPos.x, this.playerSpawnPos.y, 'ninja_run');
        console.log(this.player);

        // add collision between the player and the ground
        this.physics.add.collider(this.player, this.groundHitbox);

        // create the healthbar
        let healthbarPos = new Phaser.Math.Vector2(32,32);
        let healthBarSegmentWidth = 40;
        this.backgroundHealth = [];
        for (let i = 0; i < this.DEBUG_MAX_PLAYER_HEALTH; i++){
            this.backgroundHealth.push(this.add.image(healthbarPos.x +healthBarSegmentWidth * i, healthbarPos.y,'health_background').setOrigin(0));
        }
        this.emptyHealth = [];
        for (let i = 0; i < this.DEBUG_MAX_PLAYER_HEALTH; i++){
            this.emptyHealth.push(this.add.image(healthbarPos.x +healthBarSegmentWidth * i + 8, healthbarPos.y + 4,'health_empty').setOrigin(0));
        }
        this.filledHealth = [];
        for (let i = 0; i < this.DEBUG_MAX_PLAYER_HEALTH; i++){
            this.filledHealth.push(this.add.image(healthbarPos.x +healthBarSegmentWidth * i + 8, healthbarPos.y + 4,'health_filled').setOrigin(0));
        }

        // add the enemy group
        this.enemyGroup = this.add.group({
            runChildUpdate: true,
        })

        // add dat.gui for debugging purposes
        // FIXME: Remove for the final build of the game
        this.gui = new dat.GUI();
        let playerFolder = this.gui.addFolder('Player Parameters');
        playerFolder.add(this.player, 'currentHealth', 0, this.DEBUG_MAX_PLAYER_HEALTH, 1);
        playerFolder.add(this.player, 'maxHealth', 0, this.DEBUG_MAX_PLAYER_HEALTH, 1);
        playerFolder.open();
    }

    update(time, delta){
        // multiply that is incremented every frame by this to avoid differences between framerates
        let deltaMultiplier = (delta/(16 + 2/3));

        //scroll the background
        this.background01.tilePositionX += (this.SCORLL_SPEED * 0.9) * deltaMultiplier;
        this.background02.tilePositionX += (this.SCORLL_SPEED * 0.6) * deltaMultiplier;
        this.background03.tilePositionX += (this.SCORLL_SPEED * 0.3) * deltaMultiplier;
        this.groundTiles.tilePositionX  += (this.SCORLL_SPEED      ) * deltaMultiplier;

        // update player
        this.player.update();

        // update the UI if the player's stats have changed
        this.updateUI();

        // run enemy spawn
        if (this.enemyCount < this.maxEnemyCount){
            this.addEnemy();
            this.enemyMoveSound.play();
        }

        //player enemy collision
        this.physics.overlap(this.player.damageHitbox, this.enemyGroup, this.playerEnemyOverlap, null, this)
        
    }

    updateUI(){
        if (this.player.UINeedsUpdate){
            // console.log("Updating UI");
            for (let i = 0; i < this.backgroundHealth.length; i++){
                if (i > this.player.maxHealth - 1){
                    this.backgroundHealth[i].alpha = 0;
                    this.emptyHealth[i].alpha = 0;
                } else {
                    this.backgroundHealth[i].alpha = 1;
                    this.emptyHealth[i].alpha = 1;
                }

                if (i > this.player.currentHealth - 1){
                    this.filledHealth[i].alpha = 0;
                } else {
                    this.filledHealth[i].alpha = 1;
                }
            }

            // UI no longer needs update
            this.player.UINeedsUpdate = false;
        }
    }
    /**
     * When an enemy overlaps with the player (probably just hurts the player)
     * @param {Enemy} player 
     * @param {Player} enemy 
     */
    playerEnemyOverlap(player, enemy){
        // first check to make sure that the player is not already overlapping the player
        // and that the player is not invincible
        if (!enemy.alreadyOverlapping && !player.invincible){
            this.player.FSM.transition('hurt', enemy);
            // enemy.body.setEnable(false);
        }
        enemy.alreadyOverlapping = true;
    }

    /**Create a new enemy and add it to this.enemyGroup() */
    addEnemy(){
        let enemy = new Enemy(this, 'enemy');
        this.enemyGroup.add(enemy);
    }
    /**
     * destroy the attacked enemy
     * @param {Phaser.Physics.Arcade.Sprite} hitbox 
     * @param {Enemy} enemy 
     */
    //TODO: change it so that the enemy only takes damage when attacked and that it dies once its health is 0
    destroyEnemy(hitbox, enemy){
        enemy.destroy();
    }
}