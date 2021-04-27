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
            aline: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.image(500, 1280, 'logo');

        this.add.text(game.config.width/3.0, game.config.height/2.5, 'Project Desert Ninja', menuConfig).setOrigin(0.0);
        this.add.text(game.config.width/3.1, game.config.height/2, 'Click anywhere to Play', menuConfig).setOrigin(0.0);

        this.input.on('pointerdown', () => this.scene.start('playScene'));
    }

    update(){

    }
}