import Menu from "./scenes/Menu.js";
import Play from "./scenes/Play.js";
import Load from "./scenes/Load.js";

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 480,
    scene: [Load, Menu, Play],
    scale: {
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1500,
            },
            debug: true,
        },
    },
    pixelArt: true,
}


//let game;
let game  = new Phaser.Game(config);

//export default game = new Phaser.Game(config);

// set UI sizes 
/*
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
*/

export default game;