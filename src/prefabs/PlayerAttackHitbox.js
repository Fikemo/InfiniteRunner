export default class PlayerAttackHitbox extends Phaser.Physics.Arcade.Sprite{
    // defaultActiveTime;
    // activeTimer;
    // defaultAnticipationTime;
    
    constructor(scene){
        super(scene)
        // this.defaultActiveTime = 500;
        // this.defaultAnticipationTime = 100;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // this.body.setSize(50,100, true);
        this.body.allowGravity = false;
        // this.setDebugBodyColor(0xFF0000);

        // // this.body.setEnable(false);
        // this.attacking = false;
    }

    update(){
        // if (this.scene.player != undefined && this.scene.player != null){
        //     this.x = this.scene.player.x + 50;
        //     this.y = this.scene.player.y;
        // }
    }

    getAttacking(){
        return this.attacking;
    }

    setActive(time = null){
        // FIXME: When the body is not enabled, it's position cannot update.
        //        When enabled, the body stays where it last was for a frame or a few frames.
        //        This means that any time the attack is set to active, the attack will start from wherever the last attack was.
        // if (time == null) time = this.defaultActiveTime;
        // if (this.body.enable == false){
        //     this.x = this.scene.player.x + 50;
        //     this.y = this.scene.player.y;
        //     this.body.setEnable(true);
        //     this.activeTimer = this.scene.time.delayedCall(time, () =>{
        //         this.body.setEnable(false);
        //     })
        // }

        // this works, but it might be iffy in the future, I dunno
        // if (time == null) time = this.defaultActiveTime;
        // if (!this.attacking){
        //     this.attacking = true;
        //     this.activeTimer = this.scene.time.delayedCall(time, () =>{
        //         this.attacking = false;
        //     })
        // }
    }
}