 class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader'); 
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image(["cero_opaco", "cero", "equis_opaco", "equis", "position", "reload", "tablero_win", "tablero"])
        this.load.image("font", "font/font.png");
        this.load.json("fontConfig", "font/font.json");
        this.load.audio("draw", "draw.mp3");
        this.load.audio("pop", "pop.mp3");
        this.load.audio("win", "win.mp3");
        // agregar evento complete, es decir cuando todo esta completado llamamos a este evento
        this.load.on("complete", () => {
            const fontConfig = this.cache.json.get("fontConfig");
            // con esto estamos agregando la fuente a phaser
            this.cache.bitmapFont.add("pixelFont", Phaser.GameObjects.RetroFont.Parse(this, fontConfig))
            this.scene.start("Play");
        })
    }
}
export default Bootloader;