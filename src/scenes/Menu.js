import Test from "../prefabs/Test.js";

export default class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload(){
        console.log("Menu Preload");
    }

    create(){
        this.testPrefab = new Test(this);
        console.log(this.testPrefab);
    }

    update(){

    }
}