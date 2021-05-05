/*
    Creators: Finn Morrison, Emersen Lorenz, Marla De Leon, Aubrey Schelbauer
    Title: "Desert Ninja"
    Completed: 5/4/21
    Creative Tilt: 
    (Technical)
    The game's difficulty increases as the player's score increases.
    This is calculated using a shifiting normal distribution equation which would look like a bell curve on a graph.
    As the score increases, the chances of harder enemies spawning increases.
    This creates a dynamic flow between the different types of enemies, where easier enemies are smoothly phased out and replaced with easier ones.
    The player's score also changes how many enemy spawning points are active, how quickly enemies can spawn, and the speed of the background and rock obstacles.
    We implemented state machines both fore the player and the enemies which allowed us easier control over their behavior.
    (Visual)
    Tweens were added to make the enemies smoothly come in from off screen and bob up and down to make them look like they were hovering in the air,
    adding more to asethic of the game. The parallax scrolling also increases its speed the further the player progresses and the more points they earn. 
    We are very proud of our custom designed soundtrack, sfx and animations created to make the game feel cohesive and visual interesting.
    The pixel art was scaled up by a factor of 4 so that it would look and flow smoothly as every "pixel" in the art is actually 16 pixels.
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