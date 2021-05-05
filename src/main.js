/*
    Creators: Finn Morrison, Emersen Lorenz, Marla De Leon, Aubrey Schelbauer
    Title: "Desert Ninja"
    Completed: 5/4/21
    Creative Tilt: 
    (Technical)
    We incorportaed and calculated for our game to have an increasing difficulty
    based on the amount of points the player accumulates over time using a bell curve. 
    This system will determine how many of each type of enemy will spawn as the game progresses,
    for example, less points means easier enemies are more likely to spawn, while a lot of points will increase the chances of harder enemies to spawn.
    We were also able to implement state machines for both the player actions and enemy actions, allowing us use state changes for every important event.
    (Visual)
    Tweens were added to make the enemies bob up and down to make them look like they were hovering in the air,
    adding more to asethic of the game. The paralx scrolling also increases its speed the further the player progresses and the more points they earn. 
    We are very proud of our custom designed soundtrack, sfx and animations created to make the game feel cohesive and visual interesting.
    This was the first time for most of us creating pixel art so we are proud of what we were able to learn and accomplish for this project.
*/


import Menu from "./scenes/Menu.js";
import Instructions from "./scenes/Instructions.js";
import Credits from "./scenes/Credits.js";
import Play from "./scenes/Play.js";
import Load from "./scenes/Load.js";

let config = {
    parent: "phaser-game",
    type: Phaser.AUTO,
    width: 960,
    height: 480,
    scene: [Load, Menu, Instructions, Credits, Play],
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
            // debug: true,
        },
    },
    // pixelArt: true,
    antiAlias: false,
    fps: 60,
}

//let game
let game  = new Phaser.Game(config);


//export default game = new Phaser.Game(config);

// set UI sizes 
/*
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
*/
let keyLeft;
export default game;