import game from "../main.js";


export default class Credits extends Phaser.Scene{
    constructor(){
        super("creditScene");
    }

    preload() {
     
        
    }

    create(){
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

        // add logo
        this.add.image(game.config.width/ 2, game.config.height/2 - 60, 'logo');
        

        //add text
        this.add.text(game.config.width/2, game.config.height/2 + 122, 'Programming: Finn Morrison & Emersen Lorenz\nArt and Animation: Marla De Leon & Aubrey Schelbauer\nSound Design: Emersen Lorenz', instructConfig).setOrigin(0.5);

       
    }

    update(){
        //set credit timer to transition into title screen
        this.time.delayedCall(3000, () => { this.scene.start('menuScene'); }); // delay in ms
      //this.scene.start('menuScene');

    }
}