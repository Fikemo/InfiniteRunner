import game from "../main.js";


export default class Instructions extends Phaser.Scene{
    constructor(){
        super("instructionScene");
    }

    init(data){
        this.bgm = data;
    }
    
    create(){
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.cursors = this.input.keyboard.createCursorKeys();

        let instructConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#666666',
            color: '#FFFFFF',
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

        this.add.text(game.config.width/2, game.config.height/2, 'Press F to attack\nPress SPACE to jump\nDestroy as many enemy robots as you can\nAvoid incoming rocks\n\nPress SPACE to continue', instructConfig).setOrigin(0.5);

        //this.add.image(this.scale.width / 2, this.scale.height / 2 - 54,'title').setOrigin(0.5);


        this.sfx_start = this.sound.add('sfx_start', {volume: 0.4});

        // this.input.on('pointerdown', () => this.scene.start('playScene'));
        this.cursors.space.on('down', () => {this.sfx_start.play(); this.bgm.stop(); this.scene.start('playScene')});
        
    }

    update(){
      

    }
}