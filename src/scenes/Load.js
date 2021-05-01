export default class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set load path
        this.load.path = './assets/';
        // take care of all of our asset loading now
        this.load.image('groundTile', 'groundTile.png');

        // background
        this.load.image('background', 'background_mockup.png');
        this.load.image('background01', 'background01.png');
        this.load.image('background02', 'background02.png');
        this.load.image('background03', 'background03.png');
        this.load.image('sky', 'evening_sky.png');
        this.load.image('haze', 'haze.png');
        this.load.image('sun', 'sun.png');
        this.load.image('evening_sun', 'evening_sun.png');

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

        // ...and pass to the next Scene
        this.scene.start('menuScene');
    }
}