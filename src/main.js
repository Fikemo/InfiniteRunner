import Menu from "./scenes/Menu.js";
import Play from "./scenes/Play.js";
import Load from "./scenes/Load.js";

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 480,
    scene: [Load, Menu, Play],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1500,
            },
            debug: true,
        },
    }
}


let game;
export default game = new Phaser.Game(config);