import game from "../main.js";


export default class Instructions extends Phaser.Scene{
    constructor(){
        super("instructionScene");
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
        this.add.image(this.scale.width/2, this.scale.height / 2,'sky');
        this.add.image(this.scale.width/2, this.scale.height / 2,'sun');
        this.add.image(this.scale.width/2, this.scale.height / 2,'background3');
        this.add.image(this.scale.width/2, this.scale.height / 2,'background2');
        this.add.image(this.scale.width/2, this.scale.height / 2,'background');

        this.add.text(game.config.width/2, game.config.height/2 + 160, 'Destory as many enemy Robots as you can', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 120, 'Click Space bar to jump', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 90, 'Click F to attack', instructConfig).setOrigin(0.5);

        //this.add.image(this.scale.width / 2, this.scale.height / 2 - 54,'title').setOrigin(0.5);


        this.input.on('pointerdown', () => this.scene.start('playScene'));
    }

    update(){
      

    }
}