import Phaser from 'phaser';

import Boot from './scenes/Boot'
import MyGame from './scenes/Game';


const game = new Phaser.Game({
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,

    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
        },
    },
    render: {
        // prevent tile bleeding
        antialiasGL: false,
        // prevent pixel art from becoming blurry when scaled
        pixelArt: true,
    },
    parent: 'phaser-example',
    // width: Math.min(window.innerWidth, 1920),
    // height: Math.min(Math.max( window.innerHeight, document.body.clientHeight ) - 82, 1080),
    scene: [
        Boot,
        MyGame,
    ]
});


