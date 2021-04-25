import game from "../main.js";

export default class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    create(){
        this.scene.start("playScene");
    }

    update(){

    }
}