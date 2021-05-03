import game from "../main.js";


export default class Credits extends Phaser.Scene{
    constructor(){
        super("creditScene");
    }

    preload() {
        this.load.image('logo', './assets/spirals.png');
        this.load.image('background', './assets/background01.png');
        this.load.image('background2', './assets/background02.png');
        this.load.image('background3', './assets/background03.png');
        this.load.image('sun', './assets/evening_sun.png');
        this.load.image('sky', './assets/sky.png');
    }

    create(){
        let instructConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            //backgroundColor: '#A3C941',
            color: '#FFFFFF',
            aline: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2 + 190, 'Sound Design: Emersen Lorenz', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 160, 'Art and Animation: Marla Deleon & Aubrey Schelbauer', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 120, 'Programming: Finn Morrison & Emersen Lorenz ', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 90, 'Creator Credits', instructConfig).setOrigin(0.5);

        //this.add.image(this.scale.width / 2, this.scale.height / 2 - 54,'title').setOrigin(0.5);


        //this.input.on('pointerdown', () => this.scene.start('menuScene'));
        //this.scene.start('menuScene');
    }

    update(){
        //scene.time.delayedCall(500, callback, args, scope); 
        this.time.delayedCall(3000, () => { this.scene.start('menuScene'); }); // delay in ms
      //this.scene.start('menuScene');

    }
}