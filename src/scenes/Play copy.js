// imports
import game from "../main.js";
import Player from "../prefabs/Player.js";
import Enemy from "../prefabs/Enemy.js";

const gui = new dat.GUI();

const BOTTOM_ENEMY_SPAWN_X = 960 - 50;
const ENEMY_SPAWN_SEPERATION = 100;
const ENEMY_SPAWN_X_VARIATION = 4;
const ENEMY_SPAWN_Y = 480 - 32 - 50;

let enemySpawnTime = 4000;
let maxActiveSpawners = 1;
const ACTIVE_SPAWNERS = [];

const MAX_SCORE_DIGITS = 7;
const MAX_DIFFICULTY_SCORE = 5000;

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
        //this.enemyMoveSound = this.sound.add('sfx_EMovement');
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

        // create score display
        this.scoreArray = [];
        for (let i = 0; i < MAX_SCORE_DIGITS; i++){
            this.scoreArray.push(this.add.sprite(healthbarPos.x + (40 * i) + 624, healthbarPos.y, 'numbersAtlas', 'number0000').setOrigin(0));
        }

        // add the enemy group
        this.enemyGroup = this.add.group({
            runChildUpdate: true,
        })
        // this.enemySpawnerGroup = this.add.group({
        //     runChildUpdate: true,
        // })
        this.enemySpawnerArray = [];
        this.enemySpawnerArray.push(new EnemySpawnPoint(this, BOTTOM_ENEMY_SPAWN_X, ENEMY_SPAWN_Y));
        this.enemySpawnerArray.push(new EnemySpawnPoint(this, BOTTOM_ENEMY_SPAWN_X, ENEMY_SPAWN_Y - ENEMY_SPAWN_SEPERATION));
        this.enemySpawnerArray.push(new EnemySpawnPoint(this, BOTTOM_ENEMY_SPAWN_X, ENEMY_SPAWN_Y - ENEMY_SPAWN_SEPERATION * 2));

        // start enemy spawning
        this.beginEnemySpawning();

        // add dat.gui for debugging purposes
        // FIXME: Remove for the final build of the game
        let playerFolder = gui.addFolder('Player Parameters');
        playerFolder.add(this.player, 'currentHealth', 0, this.DEBUG_MAX_PLAYER_HEALTH, 1);
        playerFolder.add(this.player, 'maxHealth', 0, this.DEBUG_MAX_PLAYER_HEALTH, 1);
        playerFolder.add(this.player, 'score', 0, 5000, 50);
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

        // update spawners
        this.enemySpawnerArray.forEach(spawner => {spawner.update()})

        // update the UI if the player's stats have changed
        this.updateUI();

        // run enemy spawn
        if (this.enemyCount < this.maxEnemyCount){
            // this.addEnemy();
            //this.enemyMoveSound.play();
        }

        //player enemy collision
        this.physics.overlap(this.player.damageHitbox, this.enemyGroup, this.playerEnemyOverlap, null, this)
        
    }

    updateUI(){
        if (this.player.UINeedsUpdate){
            // console.log('updating ui');
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

            // update the score
            let scoreString = String(this.player.score);
            let origLength = scoreString.length;
            let zeroBufferPassed = false;
            for (let i = 0; i < this.scoreArray.length - origLength; i++){
                scoreString = "0" + scoreString;
            }
            if (scoreString.length > MAX_SCORE_DIGITS){
                scoreString = "9999999";
            }
            for (let i = 0; i < this.scoreArray.length; i++){
                let currentNumber = scoreString[i];
                this.scoreArray[i].setFrame(`number000${currentNumber}`);
                if (zeroBufferPassed || scoreString[i] != '0'){
                    this.scoreArray[i].alpha = 1;
                    zeroBufferPassed = true;
                } else {
                    this.scoreArray[i].alpha = 0.5;
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

    spawnEnemy(){

        this.calculateDifficulty();
        
        this.time.delayedCall(enemySpawnTime, () =>{this.spawnEnemy()});
    }

    beginEnemySpawning(){
        const {enemyDifficulty, spawnInterval, numberOfActiveSpawnPoints} = this.calculateDifficulty();

        maxActiveSpawners = numberOfActiveSpawnPoints;
        this.setActiveSpawners();

    }

    setActiveSpawners(){

        let totalActive = 0;
        while(totalActive < maxActiveSpawners){
            let i = Phaser.Math.Between(0,2);
            let currentSpawner = this.enemySpawnerArray[i];
            if (!currentSpawner.active){
                currentSpawner.active = true;
                console.log(currentSpawner);
                totalActive++;
            }
        }
    }

    calculateDifficulty(){
        let mu = Phaser.Math.Clamp((this.player.score / MAX_DIFFICULTY_SCORE) * 12 - 6, -6, 6);
        console.log(mu);

        // keep searching for x values until their correspoding y falls on or unter the line
        let randomX = Math.random() * (6 - (-6)) + (-6);
        while(!this.normalDisRandomChance(randomX, mu)){
            randomX = Math.random() * (6 - (-6)) + (-6);
        }

        // thresholds for enemy difficulty
        // -6, -2, 2, 6
        console.log(randomX);
        let enemyDifficulty;
        if (randomX < -2){                          // easy
            enemyDifficulty = "easy";
        } else if (randomX >= -2 && randomX < 2){   // medium
            enemyDifficulty = "medium";
        } else {                                    // hard
            enemyDifficulty = "hard";
        }

        // thresholds for spawn intervals
        // -6, -2, 2, 6
        let spawnInterval;
        if (mu < -2){
            spawnInterval = (1 - this.ratioBetween(mu, -6, -2)) * 4000 + 1000;
        } else if (mu > -2 && randomX < 2){
            spawnInterval = (1 - this.ratioBetween(mu, -2, 2)) * 4000 + 1000;
        } else {
            spawnInterval = (1 - this.ratioBetween(mu, 2, 6)) * 4000 + 1000;
        }
        
        let numberOfActiveSpawnPoints
        // thresholds active spawn points
        // -6, -5, -3 (1, 2, 3)
        // -2, 0       (2, 3)
        // 2, 4       (2, 3)
        if (mu < -5){
            numberOfActiveSpawnPoints = 1;
        } else if (mu < -3 || (mu >= -2 && mu < 0) || (mu >= 2 && mu < 4)){
            numberOfActiveSpawnPoints = 2;
        } else {
            numberOfActiveSpawnPoints = 3;
        }

        return {enemyDifficulty, spawnInterval, numberOfActiveSpawnPoints};
    }

    ratioBetween(x, min, max){
        return (x - min) / (max - min);
    }

    normalDis(x, mu = 0, sigma = 2){
        if (!x) x = mu;

        let a = (1/(sigma * Math.sqrt(2 * Math.PI)));
        let exponent = -(Math.pow(x - mu,2) / (2 * Math.pow(sigma, 2)))
        let b = Math.pow(Math.E, exponent);
        // console.log(a * b);
        return a * b;
    }

    normalDisMaxY(mu = 0, sigma = 2){
        return this.normalDis(mu, mu, sigma);
    }

    normalDisRandomChance(x, mu = 0, sigma = 2){
        let h = this.normalDis(x, mu, sigma);
        let randomH = Math.random() * this.normalDisMaxY(mu, sigma);
        return randomH <= h;
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

class EnemySpawnPoint{
    active;
    open;
    x;
    y;
    constructor(scene, x, y){
        this.active = false;
        this.open = true;
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    spawnEnemy(){
        let {enemyDifficulty, spawnInterval, numberOfActiveSpawnPoints} = this.scene.calculateDifficulty();
        maxActiveSpawners = numberOfActiveSpawnPoints;
        this.scene.time.delayedCall(spawnInterval, () => {
            this.scene.enemyGroup.add(
                new Enemy(this.scene, `enemy_${enemyDifficulty}`, this, enemyDifficulty)
            )
        });
        this.open = false;
    }

    update(){
        if (this.active && this.open){
            console.log('setting enemy spawn');
            this.spawnEnemy()
        }
    }

    setInactive(){ // called when the spawned enemy is destroyed
        this.active = false;
        this.open = true;
        this.scene.setActiveSpawners();
    }
}