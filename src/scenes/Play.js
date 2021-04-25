import game from "../main.js";
import Enemy from "../prefabs/Enemy.js";

export default class Play extends Phaser.Scene{
    scrollSpeed = 2;
    enemyCount = 0;
    maxEnemyCount = 2;

    constructor(){
        super("playScene");
    }

    init(){
        this.scrollSpeed = 2;
        this.enemyCount = 0;
        this.maxEnemyCount = 2;
    }

    preload(){
        console.log('play loaded');
    }

    create(){

        this.background = this.add.tileSprite(0,0, this.scale.width, this.scale.height, 'background').setOrigin(0);

        this.bgm = this.sound.add('bgm', {volume: 0.1, loop: true});
        this.bgm.play();

        let tileSize = 32;
        this.ground = this.add.group();
        for (let i = 0; i < this.scale.width; i += tileSize){
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'groundTile').setScale(1).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        this.groundScroll = this.add.tileSprite(0, this.scale.height - tileSize, this.scale.width, tileSize, 'groundTile').setOrigin(0);

        this.player = this.physics.add.sprite(120, this.scale.height/2 - tileSize, 'ninja');
        this.player.anims.play('ninja', true);

        this.physics.add.collider(this.player, this.ground);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.enemyGroup = this.add.group({
            runChildUpdate: true
        })
    }

    update(){
        this.background.tilePositionX += this.scrollSpeed / 4;
        this.groundScroll.tilePositionX += this.scrollSpeed;

        // check if player is grounded
        this.player.isGrounded = this.player.body.touching.down;
        // if so, we have jumps to spare
        if (this.player.isGrounded){
            this.player.anims.play('ninja', true);
            this.jumps = 1;
            this.jumping = false;
        } else {

        }

        // allow steady velocity change up to a certain key down duration
        if (this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(this.cursors.up, 400)){
            this.player.body.velocity.y = -400;
            this.jumping = true;
        } else {

        }

        // finall, letting go of the Up key subtracts a jump
        if (this.jumping && Phaser.Input.Keyboard.UpDuration(this.cursors.up)){
            this.jumps--;
            this.jumping = false;
        }

        if (this.enemyCount < this.maxEnemyCount){
            this.addEnemy();
        }
    }

    addEnemy(){
        let enemy = new Enemy(this, 'enemy', 'idle');
        this.enemyGroup.add(enemy);
    }
}