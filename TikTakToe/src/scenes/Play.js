class Play extends Phaser.Scene{
    constructor(){
        super({
            key: "Play",
        });
    }

    init(){
        this.turno = true // si es true el jugardor cero esta iniciando sino es el jugador equis
    }
    create(){
        this.add.image(100, 100, "equis");
    }


}

export default Play;