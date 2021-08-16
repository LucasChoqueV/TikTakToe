import Bootloader from './Bootloader.js';
import Play from './scenes/Play.js';
import Reload from './scenes/Reload.js';

const config = {
    title: "TikTakToe",
    version: "0.0.1",
    type: Phaser.AUTO,
    // esto es para escalar el juego en varios tamaños
    scale: {
        parent: "container",
        width: 180,
        height: 320,
        mode: Phaser.Scale.FIT,
        // centro en el medio
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#372538",
    pixelArt: true,
    physics: {
        default: "arcade",
        "arcade": {
            gravity: {
                y: 500
            }
        }
    },
    scene: [
        Bootloader,
        Play,
        Reload,
    ]
};

new Phaser.Game(config);