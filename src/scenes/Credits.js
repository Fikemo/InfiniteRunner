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
            aline: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        

        //add text
        this.add.text(game.config.width/2, game.config.height/2 + 190, 'Sound Design: Emersen Lorenz', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 160, 'Art and Animation: Marla De Leon & Aubrey Schelbauer', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 120, 'Programming: Finn Morrison & Emersen Lorenz ', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 90, 'Creator Credits', instructConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 5, 'Joppyshrek Productions Presents', instructConfig).setOrigin(0.5);

       
    }

    update(){
        //set credit timer to transition into title screen
        this.time.delayedCall(3000, () => { this.scene.start('menuScene'); }); // delay in ms
      //this.scene.start('menuScene');

    }
}