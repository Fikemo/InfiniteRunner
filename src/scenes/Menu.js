import game from "../main.js";

export default class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload() {
        this.load.image('logo', './assets/spirals.png');
    }

    create(){
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#A3C941',
            color: '#600605',
            aline: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
       
        }

        this.add.image(500, 1280, 'logo');

        this.add.text(game.config.width/2, game.config.height/2 + 120, 'Click to Start', menuConfig).setOrigin(0.5);

        this.add.image(this.scale.width / 2, this.scale.height / 2 - 54,'title').setOrigin(0.5);


        //this.input.on('pointerdown', () => this.scene.start('playScene'));
        //this.input.on('pointerdown', () => this.scene.start('creditScene'));
        this.input.on('pointerdown', () => this.scene.start('instructionScene'));
       //keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update(){
        //this.scene.start('creditScene');
        //this.scene.start('menuScene');
        //this.scene.start('creditScene');
       /* if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // Novice mode
            //this.sound.play('sfx_select');
            this.scene.start("creditScene");    
          }
    */
    }
}
        //this.input.on('pointerdown', () => this.scene.start('InstructionScene'));