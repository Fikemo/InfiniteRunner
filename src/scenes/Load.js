export default class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        
        // set load path
        this.load.path = './assets/';

        this.load.atlasXML('numbersAtlas', 'numbersSpriteSheet.png', 'sprites.xml');

        // take care of all of our asset loading now
        this.load.image('groundTile', 'groundTile.png');

        // background
        this.load.image('background01', 'background01.png');
        this.load.image('background02', 'background02.png');
        this.load.image('background03', 'background03.png');
        this.load.image('sky', 'evening_sky.png');
        this.load.image('haze', 'haze.png');
        this.load.image('evening_sun', 'evening_sun.png');

        this.load.image('health_filled', 'health_bar_filled.png');
        this.load.image('health_empty', 'health_bar_empty.png');
        this.load.image('health_background', 'health_bar_background.png');

        this.load.image('title', 'Title.png');

        this.load.image('enemy', 'enemy.png');
        this.load.image('heart', 'hud_heartFull.png');
        this.load.audio('sfx_attack', 'playerAttack.wav');
        this.load.audio('sfx_injured', 'playerOof.wav');
        this.load.audio('sfx_EMovement', 'enemyStrollin.wav');
        this.load.audio('sfx_enemyInjured', 'enemyFleshwound.wav');
        this.load.audio('sfx_destroy', 'enemyByeBye.wav');
        this.load.spritesheet('ninja', 'Ninja.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 11
        });

        this.load.spritesheet('ninja_run', 'NinjaRun.png', {
            frameWidth: 70,
            frameHeight: 80,
            startFrame: 0,
            endFrame: 5,
        })

        this.load.spritesheet('ninja_jump', 'NinjaJump.png', {
            frameWidth: 60,
            frameHeight: 80,
            startFrame: 0,
            endFrame: 6
        })

        this.load.audio('bgm', 'bgm1.mp3');
    }

    create() {
        this.anims.create({
            key: 'ninja',
            frames: this.anims.generateFrameNumbers('ninja', {
                start: 0,
                end: 11,
                first: 0
            }),
            frameRate: 20,
            repeat: -1,
        })

        this.anims.create({
            key: 'ninja_run',
            frames: this.anims.generateFrameNumbers('ninja_run', {
                start: 0,
                end: 5,
                first: 0,
            }),
            frameRate: 12,
            repeat: -1,
        })

        this.anims.create({
            key: 'ninja_jump',
            frames: this.anims.generateFrameNumbers('ninja_jump', {
                start:0,
                end:6,
                frist: 0,
            }),
            frameRate: 12,
            repeat: 0,
        })

        // this.anims.create({
        //     key: 'numbers',
        //     frames: this.anims.generateFrameNames('numberAtlas', {
        //         prefix: 'number',
        //         start: 0,
        //         end: 9,
        //         suffix: '',
        //         zeroPad: 4,
        //     }),
        //     frameRate: 0,
        //     repeat: 0,
        // })

        // ...and pass to the next Scene
        this.scene.start('creditScene');
    }
}