import db from "../share/share.js";
class Reload extends Phaser.Scene{
    constructor(){
        super({
            key: "Reload",
        })
    }

    init(){
        db.table = [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1],
        ]
        this.scene.start("Play");
    }
    create(){
    }
}

export default Reload;