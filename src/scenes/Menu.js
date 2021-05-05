import game from "../main.js";

export default class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    create(){
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.cursors = this.input.keyboard.createCursorKeys();
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            //backgroundColor: '#A3C941',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
       
        }
        this.add.image(this.scale.width/2, this.scale.height / 2,'sky');
        this.add.image(this.scale.width/2, this.scale.height / 2,'sun');
        this.add.image(this.scale.width/2, this.scale.height / 2,'background03');
        this.add.image(this.scale.width/2, this.scale.height / 2,'background02');
        this.add.image(this.scale.width/2, this.scale.height / 2,'background01');

        this.bgm = this.sound.add('startMenu_bgm', {volume: 0.1, loop: true});
        this.bgm.play();

        this.sfx_start = this.sound.add('sfx_start', {volume: 0.4});
        

        this.add.text(game.config.width/2, game.config.height/2 + 120, 'Press SPACE to Start', menuConfig).setOrigin(0.5);

        this.add.image(this.scale.width / 2, this.scale.height / 2 - 54,'title').setOrigin(0.5);


        //this.input.on('pointerdown', () => this.scene.start('playScene'));
        //this.input.on('pointerdown', () => this.scene.start('creditScene'));
        //this.input.on('pointerdown', () => this.scene.start('instructionScene'));
        this.cursors.space.on('down', () => {this.sfx_start.play(); this.scene.start('instructionScene', this.bgm)});
    
    }

    update(){
    
    }
}