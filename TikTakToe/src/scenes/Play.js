import db from "../share/share.js";
class Play extends Phaser.Scene{
    constructor(){
        super({
            key: "Play",
        });
    }

    init(){
        this.audioDraw = this.sound.add("draw");
        this.audioPop = this.sound.add("pop");
        this.audioWin = this.sound.add("win");
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
        this.tableWin = this.add.image(0, 0, "tablero_win");
        this.turnTextWin = this.add.bitmapText(0, 0, "pixelFont", "WINNER\n\nX", 16, 1)
        this.buttonTable = this.add.image(0, 0, "reload").setInteractive();

        Phaser.Display.Align.In.Center(this.turnTextWin, this.tableWin, 0, -15);
        Phaser.Display.Align.In.Center(this.buttonTable, this.tableWin, 0, 35);
        this.tableContainer = this.add.container(this.canvasCenter.width, this.canvasCenter.height);
        this.tableContainer.add([
            this.tableWin,
            this.turnTextWin,
            this.buttonTable,
        ]);
        this.tableContainer.setDepth(2);
        this.tableContainer.setScale(0);

        this.buttonTable.on(Phaser.Input.Events.POINTER_UP, () => {
            this.add.tween({
                targets: this.tableContainer,
                scaleX: 0,
                scaleY: 0,
                duration: 1000,
                ease: "Bounce",
                onComplete: () => {
                    this.scene.start("Reload");
                }
            })
        })


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
                this.audioPop.play();
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
            this.audioDraw.play();
            this.turnTextWin.setText("DRAW");
            this.add.tween({
                targets: this.tableContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 500,
                ease: "Bounce",
            })
        }

        if (this.win().win) {
            this.audioWin.play();
            this.turnTextWin.setText("WINNER\n\n"+ ((this.turn)  ? "O" : "X"));
            this.add.tween({
                targets: this.tableContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 500,
                ease: "Bounce",
            })

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