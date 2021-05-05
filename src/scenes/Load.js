export default class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        
        // set load path
        this.load.path = './assets/';



        this.load.atlasXML('numbersAtlas', 'numbersSpriteSheet.png', 'sprites.xml');
        this.load.atlas('ninja_run_2', 'ninja_run_spritesheet.png', 'ninja_run_spritesheet.json');
        this.load.atlas('ninja_ow_2', 'ninja_ow_spritesheet.png', 'ninja_ow_spritesheet.json');
        this.load.atlas('ninja_jump_2', 'ninja_jump_spritesheet.png', 'ninja_jump_spritesheet.json');
        this.load.atlas('ninja_attack', 'ninja_attack_spritesheet.png', 'ninja_attack_spritesheet.json');
        this.load.atlas('ninja_attack_2', 'ninja_attack_spritesheet_2.png', 'ninja_attack_spritesheet_2.json');
        this.load.atlas('slash_effect', 'slash_spritesheet.png', 'slash_spritesheet.json');
        this.load.atlas('easy_destroy_atlas', 'easy_destroy_spritesheet.png', 'easy_destroy_spritesheet.json');
        this.load.atlas('medium_destroy_atlas', 'medium_destroy.png', 'easy_destroy_spritesheet.json');
        this.load.atlas('hard_destroy_atlas', 'hard_destroy.png', 'easy_destroy_spritesheet.json');

        this.load.image('rock', 'rock.png');

        // take care of all of our asset loading now
        this.load.image('groundTile', 'groundTile.png');
        this.load.image('ground_tile', 'floor_tile.png');

        // background
        this.load.image('background01', 'background01.png');
        this.load.image('background02', 'background02.png');
        this.load.image('background03', 'background03.png');
        this.load.image('sky', 'evening_sky.png');
        this.load.image('haze', 'haze.png');
        this.load.image('evening_sun', 'evening_sun.png');

        this.load.image('game', 'game.png');
        this.load.image('over', 'over.png');
        this.load.image('game_over_background', 'gameover_background.png');

        this.load.image('health_filled', 'health_bar_filled.png');
        this.load.image('health_empty', 'health_bar_empty.png');
        this.load.image('health_background', 'health_bar_background.png');

        this.load.image('logo', 'joppy_shrek_logo.png');
        this.load.image('title', 'Title.png');

        this.load.image('enemy', 'enemy.png');
        this.load.image('enemy_easy', 'enemy_easy.png');
        this.load.image('enemy_medium', 'enemy_medium.png');
        this.load.image('enemy_hard', 'enemy_hard.png');
        this.load.audio('sfx_attack', 'playerAttack.wav');
        this.load.audio('sfx_injured', 'playerOof.wav');
        this.load.audio('sfx_EMovement', 'enemyStrollin.wav');
        this.load.audio('sfx_enemyInjured', 'enemyFleshwound.wav');
        this.load.audio('sfx_destroy', 'EnemyExplosion.wav');
        this.load.audio('sfx_start', 'StartGameSound.wav');

        this.load.audio('sfx_charge', 'EnemyChargeSound.wav');

        this.load.spritesheet('ninja', 'Ninja.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame: 0,
            endFrame: 11
        });

        this.load.spritesheet('ninja_run', 'run.png', {
            frameWidth: 80,
            frameHeight: 92,
            startFrame: 0,
            endFrame: 7,
        })

        this.load.spritesheet('ninja_jump', 'jump.png', {
            frameWidth: 80,
            frameHeight: 92,
            startFrame: 1,
            endFrame: 13
        })

        this.load.spritesheet('ninja_hurt', 'ow.png', {
            frameWidth: 80,
            frameHeight: 92,
            startFrame: 0,
            endFrame: 5
        })

        this.load.audio('bgm', 'bgm1.mp3');
        this.load.audio('startMenu_bgm', 'Metal Cognition.mp3');
    }

    create() {

        this.anims.create({
            key: 'ninja',
            frames: this.anims.generateFrameNumbers('ninja', {
                start: 0,
                end: 7,
                first: 0
            }),
            frameRate: 20,
            repeat: -1,
        })

        this.anims.create({
            key: 'ninja_run',
            frames: this.anims.generateFrameNumbers('ninja_run', {
                start: 0,
                end: 7,
                first: 0,
            }),
            frameRate: 12,
            repeat: -1,
        })

        this.anims.create({
            key: 'ninja_jump',
            frames: this.anims.generateFrameNumbers('ninja_jump', {
                start:0,
                end:13,
                frist: 0,
            }),
            frameRate: 12,
            repeat: 0,
        })

        this.anims.create({
            key: 'ninja_hurt',
            frames: this.anims.generateFrameNumbers('ninja_hurt', {
                start:0,
                end:5,
                frist: 0,
            }),
            frameRate: 12,
            repeat: -1,
        })

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('ninja_run_2', {
                prefix: 'run',
                start: 1,
                end: 7,
                zeroPad: 4,
            }),
            repeat: -1,
            frameRate: 12,
        })

        this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNames('ninja_ow_2', {
                prefix: 'ow',
                start: 1,
                end: 6,
                zeroPad: 4,
            }),
            repeat: -1,
            frameRate: 12,
        })

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('ninja_jump_2', {
                prefix: 'jump',
                start: 1,
                end: 15,
                zeroPad: 4,
            }),
            repeat: -1,
            frameRate: 12,
        })

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNames('ninja_attack', {
                prefix: 'attack',
                start: 1,
                end: 11,
                zeroPad: 4,
            }),
            frameRate: 36,
            repeat: 0,
        })

        this.anims.create({
            key: 'attack_2',
            frames: this.anims.generateFrameNames('ninja_attack_2', {
                prefix: 'sprite',
                start: 1,
                end: 11,
                zeroPad: 4,
            }),
            frameRate: 36,
            repeat: 0,
        })

        this.anims.create({
            key: 'slash',
            frames: this.anims.generateFrameNames('slash_effect', {
                prefix: 'slash',
                start: 1,
                end: 4,
                zeroPad: 4,
            }),
            frameRate: 12,
            repeat: 0,
        })

        this.anims.create({
            key: 'easy_destroy',
            frames: this.anims.generateFrameNames('easy_destroy_atlas', {
                prefix: 'sprite',
                start: 1,
                end: 23,
                zeroPad: 4,
            }),
            frameRate: 48,
            repeat: 0,
        })

        this.anims.create({
            key: 'medium_destroy',
            frames: this.anims.generateFrameNames('medium_destroy_atlas', {
                prefix: 'sprite',
                start: 1,
                end: 23,
                zeroPad: 4,
            }),
            frameRate: 48,
            repeat: 0,
        })

        this.anims.create({
            key: 'hard_destroy',
            frames: this.anims.generateFrameNames('hard_destroy_atlas', {
                prefix: 'sprite',
                start: 1,
                end: 23,
                zeroPad: 4,
            }),
            frameRate: 48,
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