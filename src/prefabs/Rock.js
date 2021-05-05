export default class Rock extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.newRock = true;
        this.setOrigin(0.5,1);

        this.body.setSize(this.width - 8, this.height - 16, false);
        this.body.setOffset(4,16);

        // this.setVelocityX(-600);
    }

    update(time, delta){
        if (this.newRock){
            let deltaMultiplier = (delta/ ( 16 + 2/3 ));
            this.x -= this.scene.scrollSpeed * deltaMultiplier;
            // this.setVelocityX(-600);
    
            if (this.x < -this.width){
                this.newRock = false;
                this.scene.time.delayedCall(Phaser.Math.Between(1000, 10000), () => {
                    this.scene.spawnRock();
                    this.destroy();
                }, undefined, this);
            }
        }
    }
}