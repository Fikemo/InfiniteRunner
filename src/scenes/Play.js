// imports
import Player from "../prefabs/Player.js";
import Enemy from "../prefabs/Enemy.js";
import Rock from "../prefabs/Rock.js";

export default class Play extends Phaser.Scene{
    constructor(){
        super('playScene');
    }

    init(){
        this.MAX_SCROLL_SPEED = 15;
        this.MIN_SCROLL_SPEED = 5;
        this.scrollSpeed = this.MIN_SCROLL_SPEED;
        this.TILE_SIZE = 32;
        this.DEBUG_MAX_PLAYER_HEALTH = 10;
    
        this.MAX_SCORE_DIGITS = 7;
        this.MAX_DIFFICULTY_SCORE = 5000;
    
        this.PLAYER_SPAWN_POS = new Phaser.Math.Vector2(120, this.scale.height / 2);
        
        this.MAX_ENEMY_SPAWN_TIME = 2000;
        this.MIN_ENEMY_SPAWN_TIME = 250;
        
        this.ENEMY_SPAWN_X = this.scale.width - 50;
        this.ENEMY_SPAWN_X_VARIATION = 4;
        this.BOTTOM_ENEMY_SPAWN_Y = this.scale.height - 32 - 50;
        this.ENEMY_SPAWN_Y_SEPERATION = 100;
        this.ENEMY_SPAWN_Y_VARIATION = 4;
        this.maxActiveSpawners = 1;

        this.gameOver = false;
        this.gameOverActivated = false;
    }

    create(){
        // add cursor buttons
        // TODO: Instead of using cursors, use space to jump and ASDF for other things
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySlash = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        // console.log(this.keySlash);

        // play bgm
        this.bgm = this.sound.add('bgm', {volume: 0.1, loop: true});
        this.bgm.play();

        this.createBackground();

        // create the player 🐱‍👤
        this.player = new Player(this, this.PLAYER_SPAWN_POS.x, this.PLAYER_SPAWN_POS.y, 'ninja_run');
        console.log(this.player);

        // add collision between the player and the ground
        this.physics.add.collider(this.player, this.groundHitbox);
        
        this.createUI();

        this.rockGroup = this.add.group({runChildUpdate: true});
        this.spawnRock();

        // enemies
        this.enemySpawnerArray = [];
        this.enemySpawnerArray.push(new EnemySpawner(this, this.ENEMY_SPAWN_X, this.BOTTOM_ENEMY_SPAWN_Y));
        this.enemySpawnerArray.push(new EnemySpawner(this, this.ENEMY_SPAWN_X, this.BOTTOM_ENEMY_SPAWN_Y - this.ENEMY_SPAWN_Y_SEPERATION));
        this.enemySpawnerArray.push(new EnemySpawner(this, this.ENEMY_SPAWN_X, this.BOTTOM_ENEMY_SPAWN_Y - this.ENEMY_SPAWN_Y_SEPERATION * 2));

        this.enemyGroup = this.add.group({ runChildUpdate: true });

        this.beginEnemySpawning();

        // add dat.gui for debugging purposes
        // FIXME: Remove for the final build of the game
        // this.gui = new dat.GUI();
        // let playerFolder = this.gui.addFolder('Player Parameters');
        // playerFolder.add(this.player, 'currentHealth', 0, this.DEBUG_MAX_PLAYER_HEALTH, 1);
        // playerFolder.add(this.player, 'maxHealth', 0, this.DEBUG_MAX_PLAYER_HEALTH, 1);
        // playerFolder.add(this.player, 'score', 0, 5000, 50);
        // playerFolder.open();
    }

    update(time, delta){
        // multiply everytyhing that is incremented every frame by deltaMultiplier
        let deltaMultiplier = (delta/ ( 16 + 2/3 ));

        // scroll the background
        this.background01.tilePositionX += (this.scrollSpeed * 0.9) * deltaMultiplier;
        this.background02.tilePositionX += (this.scrollSpeed * 0.6) * deltaMultiplier;
        this.background03.tilePositionX += (this.scrollSpeed * 0.3) * deltaMultiplier;
        this.groundTiles.tilePositionX  += (this.scrollSpeed      ) * deltaMultiplier;

        // update the player
        if (!this.gameOver){
            this.player.update();
            this.physics.overlap(this.player.attackHitbox, this.enemyGroup, this.attackEnemyOverlap, null, this);
            this.physics.overlap(this.player.damageHitbox, this.rockGroup, this.hitByRock, null, this);
        }

        // update the ui if it needs to
        this.updateUI();

        // check for enemy and player collision
        this.physics.overlap(this.player.damageHitbox, this.enemyGroup, this.playerEnemyOverlap, null, this);

        if (this.player.currentHealth <= 0){
            this.gameOver = true;
        }

        if (this.gameOver){

            if (!this.gameOverActivated){

                let instructConfig = {
                    fontFamily: 'Courier',
                    fontSize: '28px',
                    //backgroundColor: '#A3C941',
                    color: '#FFFFFF',
                    align: 'center',
                    padding: {
                        top: 5,
                        bottom: 5,
                    },
                    fixedWidth: 0
                }

                this.add.sprite(0,0,'game_over_background').setOrigin(0).setAlpha(0.5,0.5,0.5,0.5);
                this.add.sprite(this.scale.width / 2,this.scale.height / 2 - 60,'game').setOrigin(0.5);
                this.add.sprite(this.scale.width / 2,this.scale.height / 2 + 50,'over').setOrigin(0.5);
                this.add.text(this.scale.width/2, this.scale.height/2 + 160, 'R to Restart\nM for Main Menu',instructConfig).setOrigin(0.5);
                this.gameOverActivated = true;
            }

            if (Phaser.Input.Keyboard.JustDown(this.keyR)){
                this.bgm.stop();
                this.scene.restart();
            }

            if (Phaser.Input.Keyboard.JustDown(this.keyM)){
                this.bgm.stop()
                this.scene.start('menuScene');
            }
        }
    }

    createUI() {
        // create healthbar
        let healthbarPos = new Phaser.Math.Vector2(32, 32);
        let healthBarSegmentWidth = 40;
        this.backgroundHealth = [];
        for (let i = 0; i < this.DEBUG_MAX_PLAYER_HEALTH; i++) {
            this.backgroundHealth.push(this.add.sprite(healthbarPos.x + healthBarSegmentWidth * i, healthbarPos.y, 'health_background').setOrigin(0));
        }
        this.emptyHealth = [];
        for (let i = 0; i < this.DEBUG_MAX_PLAYER_HEALTH; i++) {
            this.emptyHealth.push(this.add.sprite(healthbarPos.x + healthBarSegmentWidth * i + 8, healthbarPos.y + 4, 'health_empty').setOrigin(0));
        }
        this.filledHealth = [];
        for (let i = 0; i < this.DEBUG_MAX_PLAYER_HEALTH; i++) {
            this.filledHealth.push(this.add.sprite(healthbarPos.x + healthBarSegmentWidth * i + 8, healthbarPos.y + 4, 'health_filled').setOrigin(0));
        }

        // create score display
        this.scoreArray = [];
        for (let i = 0; i < this.MAX_SCORE_DIGITS; i++){
            this.scoreArray.push(this.add.sprite(healthbarPos.x + (40 * i) + 624, healthbarPos.y, 'numbersAtlas', 'number0000').setOrigin(0));
        }

    }

    createBackground(){
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
    
        this.groundTiles = this.add.tileSprite(0, this.scale.height - this.TILE_SIZE, this.scale.width, this.TILE_SIZE, 'ground_tile').setOrigin(0);
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
            if (scoreString.length > this.MAX_SCORE_DIGITS){
                scoreString = "9999999";
            }
            for (let i = 0; i < this.scoreArray.length; i++){
                let currentNumber = scoreString[i];
                this.scoreArray[i].setFrame(`number000${currentNumber}`);
                if (zeroBufferPassed || scoreString[i] != '0' || i == this.scoreArray.length - 1){
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

    playerEnemyOverlap(playerDamageHitbox, enemy){
        // first check to make sure that the player is not already overlapping the player and that the player is not invincible
        // and that the player's attack isn't currently active
        if (!enemy.alreadyOverlapping && enemy.FSM.getState() == 'charging'){
            this.player.takeDamage(enemy.damage);
        }
        enemy.alreadyOverlapping = true;
    }

    hitByRock(playerDamageHitbox, rock){
        if (this.player.body.touching.down != 0) { this.player.takeDamage(1)};
    }

    attackEnemyOverlap(playerAttackHitbox, enemy){
        if (playerAttackHitbox.attacking) {
            playerAttackHitbox.successfulHit = true;
            if (enemy.FSM.getState() == 'charging') enemy.FSM.transition('hurt');
        };
    }

    beginEnemySpawning(){
        const {enemyDifficulty, spawnInterval, activeSpawnersAmount} = this.calculateDifficulty();
        this.maxActiveSpawners = activeSpawnersAmount;
        this.setActiveSpawners();
    }

    spawnRock(){
        this.rockGroup.add(new Rock(this, this.scale.width + 100, this.scale.height - 32, 'rock'));
    }

    setActiveSpawners(){
        let totalActive = 0;
        this.enemySpawnerArray.forEach(spawner => {if (spawner.active) totalActive++});

        while(totalActive < this.maxActiveSpawners){
            let i = Phaser.Math.Between(0,this.enemySpawnerArray.length - 1);
            let currentSpawner = this.enemySpawnerArray[i];
            if(!currentSpawner.active){
                currentSpawner.active = true;
                currentSpawner.spawnEnemy();
                totalActive++;
            }
        }
    }

    calculateDifficulty(){
        let mu = Phaser.Math.Clamp((this.player.score / this.MAX_DIFFICULTY_SCORE) * 12 - 6, -6, 6);

        // search for a x value until its correspoding y value is on or below the line
        let randomX = this.randomBetween(-6, 6);
        while(!this.normalDisRandomChance(randomX, mu)){
            randomX = this.randomBetween(-6, 6);
        }

        this.scrollSpeed = this.ratioBetween(mu, -6, 6) * (this.MAX_SCROLL_SPEED - this.MIN_SCROLL_SPEED) + this.MIN_SCROLL_SPEED;

        // thresholds for enemy difficutly
        // easy < -2
        // -2 <= medium < 2
        // 2 <= hard
        let enemyDifficulty;
        if (randomX < -2){
            enemyDifficulty = "easy";
        } else if (randomX >= -2 && randomX < 2){
            enemyDifficulty = "medium";
        } else {
            enemyDifficulty = "hard";
        }

        // thresholds for spawn intervals
        // -6 <= first phase < -2
        // -2 <= second phase < 2
        // 2 <= third phase < 6
        let spawnInterval;
        if (mu < -2){
            spawnInterval = Math.max((1 - this.ratioBetween(mu, -6, -2)) * this.MAX_ENEMY_SPAWN_TIME, this.MIN_ENEMY_SPAWN_TIME);
        } else if (mu >= -2 && mu < 2){
            spawnInterval = Math.max((1 - this.ratioBetween(mu, -2, 2)) * this.MAX_ENEMY_SPAWN_TIME, this.MIN_ENEMY_SPAWN_TIME);
        } else {
            spawnInterval = Math.max((1 - this.ratioBetween(mu, 2, 6)) * this.MAX_ENEMY_SPAWN_TIME, this.MIN_ENEMY_SPAWN_TIME);
        }

        let activeSpawnersAmount;
        // thresholds for active spawn points
        // -6 <= one < -5
        // -5 <= two < -3
        // -3 <= three < -2
        // -2 <= two < 0
        // 0 <= three < 2
        // 2 <= two < 4
        // 4 <= three < 6
        if (mu < -5){
            activeSpawnersAmount = 1;
        } else if ((mu >= -5 && mu < -3) || (mu >= -2 && mu < 0) || (mu >= 2 && mu < 4)){
            activeSpawnersAmount = 2;
        } else {
            activeSpawnersAmount = 3;
        }

        return {enemyDifficulty, spawnInterval, activeSpawnersAmount}
    }

    randomBetween(min, max){
        return Math.random() * (max - min) + min;
    }

    /**Returns a number between 0 and 1 for where x falls in a range between a min and a max value*/
    ratioBetween(x, min, max){
        return (x-min) / (max-min);
    }

    normalDis(x, mu = 0, sigma = 2){
        if (!x) x = mu;

        let a = (1/(sigma * Math.sqrt(2 * Math.PI)));
        let exponent = -(Math.pow(x - mu,2) / (2 * Math.pow(sigma, 2)))
        let b = Math.pow(Math.E, exponent);
        let result = a * b
        return result;
    }

    normalDisMaxY(mu = 0, sigma = 2){
        return this.normalDis(mu, mu, sigma);
    }

    normalDisRandomChance(x, mu = 0, sigma = 2){
        let h = this.normalDis(x, mu, sigma);
        let randomH = Math.random() * this.normalDisMaxY(mu, sigma);
        return randomH <= h;
    }
}

class EnemySpawner{
    constructor(scene, x, y){
        this.active = false;
        this.open = true;
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    spawnEnemy(){
        let {enemyDifficulty, spawnInterval, activeSpawnersAmount} = this.scene.calculateDifficulty();
        this.scene.maxActiveSpawners = activeSpawnersAmount;
        
        this.scene.time.delayedCall(spawnInterval, ()=>{
            this.scene.enemyGroup.add(
                new Enemy(this.scene, `enemy_${enemyDifficulty}`, this, enemyDifficulty)
            )
        })
        this.open = false;
    }

    deactivate(){
        this.active = false;
        this.open = true;
        this.scene.setActiveSpawners();
    }
}