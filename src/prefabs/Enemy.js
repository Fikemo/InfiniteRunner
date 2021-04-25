export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, state){
        super(
            scene,
            scene.scale.width + 32,
            Phaser.Math.Between(scene.scale.height / 2, scene.scale.height - 32 * 2 + 5),
            texture
        )

        this.state = state;
        scene.enemyCount++;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.targetX = scene.scale.width - 50;
        this.targetY = this.y;
        this.setImmovable();
        this.body.setAllowGravity(false);
        this.newEnemy = true;

        this.idleTimer = this.scene.time.delayedCall(Phaser.Math.Between(500, 2000), () => {
            this.state = 'charge';
        })
    }

    update(){
        if (this.newEnemy && this.x < this.scene.scale.width / 2){
            this.newEnemy = false;
            this.scene.enemyCount--;
        }

        if (this.x < -this.width){
            this.destroy();
            return;
        }

        switch(this.state){
            case 'idle':
                if (Math.abs(this.x - this.targetX) > 1){
                    this.setVelocityX(-100);
                } else {
                    this.setVelocityX(0);
                    this.x = this.targetX;
                }
                // console.log(this.state);
            break;
            case 'charge':{
                this.setVelocityX(-500);
            }
            break;
        }
    }
}