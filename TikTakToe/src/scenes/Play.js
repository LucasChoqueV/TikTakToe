import db from "../share/share.js";
class Play extends Phaser.Scene{
    constructor(){
        super({
            key: "Play",
        });
    }

    init(){
        this.turn = Phaser.Math.Between(0, 1) // si es true el jugardor cero esta iniciando sino es el jugador cero
        this.changeTurn();
        this.canvasCenter = {
            width: this.sys.game.config.width / 2, // obtenemos la anchura total del canvas y lo dividmos en 2
            height: this.sys.game.config.height / 2, // obtenemos el alto y lo dividimos en 2
        }
    }
    create(){
        this.add.bitmapText(this.canvasCenter.width, 50, "pixelFont","TURN: " + (this.turn ? "O" : "X")).setOrigin(0.5);

        // tablero
        this.table = this.add.image(this.canvasCenter.width, this.canvasCenter.height, "tablero");
        this.table.setAlpha(0);
        // agregar los botones para saber la posicion
        this.tableButtonPosition = [
            this.add.image(this.canvasCenter.width - 48, this.canvasCenter.height - 48, 'position'),
            this.add.image(this.canvasCenter.width, this.canvasCenter.height - 48, 'position'),
            this.add.image(this.canvasCenter.width + 48, this.canvasCenter.height - 48, 'position'),

            this.add.image(this.canvasCenter.width - 48, this.canvasCenter.height, 'position'),
            this.add.image(this.canvasCenter.width, this.canvasCenter.height, 'position'),
            this.add.image(this.canvasCenter.width + 48, this.canvasCenter.height, 'position'),

            this.add.image(this.canvasCenter.width - 48, this.canvasCenter.height + 48, 'position'),
            this.add.image(this.canvasCenter.width, this.canvasCenter.height + 48, 'position'),
            this.add.image(this.canvasCenter.width + 48, this.canvasCenter.height + 48, 'position'),
        ]

        // todos los botones estan en un array, le agregamos interactividad
        this.tableButtonPosition.map( (button, index) => {
            button.setInteractive();
            button.setAlpha(0.5)
            // cuando el mouse pase por encima del boton se cambiar la imagen a opaco
            button.on(Phaser.Input.Events.POINTER_OVER, () => {
                button.frame = this.textures.getFrame(`${db.player}_opaco`)
            })

            // cuando se levante se llama al mismo
            button.on(Phaser.Input.Events.POINTER_OUT, () => {
                button.frame = this.textures.getFrame(`position`)
            })

            button.on(Phaser.Input.Events.POINTER_DOWN, () => {
                button.frame = this.textures.getFrame(`${db.player}`)
            })

            button.on(Phaser.Input.Events.POINTER_UP, () => {
                // cuando hacemos click no se puede volver a tocar esa posicion entonces le sacamos el interactivo
                button.removeInteractive();
                button.frame = this.textures.getFrame(`${db.player}`)
                this.logic(index);
                this.turn = !this.turn;
                db.player = this.turn ? "cero" : "equis";
                console.log(db.table);

            })
        })
        this.add.tween({
            targets: [...this.tableButtonPosition, this.table],
            alpha: 1,
            duration: 1000,
            ease: "Power1",
        });

    }

    logic(index){
        const bi = this.getBidimensional(index);
        db.table[bi.y][bi.x] = this.turn ? 1 : 0;

        if (this.win().equals){
            alert("Empate");
        }
    }

    getBidimensional(index){
        return {
            y: Math.floor(index / 3),
            x: index % 3,
        };
    }

    changeTurn(){
        this.turn = !this.turn;
        db.player = this.turn ? "cero" : "equis";
    }

    win(){
        const output = {
            win: false,
            equals: false,
            player: db.player,
        };
        if (!db.table.flat().some(x => x === -1)){
            output.equals = true;
        }

        return output;
    }


}

export default Play;