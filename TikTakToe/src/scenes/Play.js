import db from "../share/share.js";
class Play extends Phaser.Scene{
    constructor(){
        super({
            key: "Play",
        });
    }

    init(){
        this.turn = Phaser.Math.Between(0, 1) // si es true el jugardor cero esta iniciando sino es el jugador cero
        
        this.canvasCenter = {
            width: this.sys.game.config.width / 2, // obtenemos la anchura total del canvas y lo dividmos en 2
            height: this.sys.game.config.height / 2, // obtenemos el alto y lo dividimos en 2
        }
        this.turnText = this.add.bitmapText(this.canvasCenter.width, 50, "pixelFont", "TURN: " + (this.turn ? "O" : "X")).setOrigin(0.5);
        this.changeTurn();
    }
    create(){
        

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

        if (this.win().win) {
            alert('Ha ganado ' + this.win().player);

        }


        this.changeTurn();

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
        this.turnText.setText("TURN DE: " + ((this.turn)  ? "O" : "X"))
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

        // Horizontales
        // Arriba
        if (
            [
                db.table[0][0],
                db.table[0][1],
                db.table[0][2]
            ].every(x => ((this.turn) ? 1 : 0) === x)
        ) {
            output.win = true;
            output.equals = false;
        }

        // Medio
        if (
            [
                db.table[1][0],
                db.table[1][1],
                db.table[1][2]
            ].every(x => ((this.turn) ? 1 : 0) === x)
        ) {
            output.win = true;
            output.equals = false;
        }

        // Abajo
        if (
            [
                db.table[2][0],
                db.table[2][1],
                db.table[2][2]
            ].every(x => ((this.turn) ? 1 : 0) === x)
        ) {
            output.win = true;
            output.equals = false;
        }

        // VERTICAL
        // Izquierda
        if (
            [
                db.table[0][0],
                db.table[1][0],
                db.table[2][0]
            ].every(x => ((this.turn) ? 1 : 0) === x)
        ) {
            output.win = true;
            output.equals = false;
        }

        // Medio
        if (
            [
                db.table[0][1],
                db.table[1][1],
                db.table[2][1]
            ].every(x => ((this.turn) ? 1 : 0) === x)
        ) {
            output.win = true;
            output.equals = false;
        }

        // Derecha
        if (
            [
                db.table[0][2],
                db.table[1][2],
                db.table[2][2]
            ].every(x => ((this.turn) ? 1 : 0) === x)
        ) {
            output.win = true;
            output.equals = false;
        }

        // DIAGONALES
        // UNO
        if (
            [
                db.table[0][0],
                db.table[1][1],
                db.table[2][2]
            ].every(x => ((this.turn) ? 1 : 0) === x)
        ) {
            output.win = true;
            output.equals = false;
        }

        // DOS
        if (
            [
                db.table[0][2],
                db.table[1][1],
                db.table[2][0]
            ].every(x => ((this.turn) ? 1 : 0) === x)
        ) {
            output.win = true;
            output.equals = false;
        }

        return output;
    }


}

export default Play;