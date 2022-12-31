import Phaser from 'phaser';

import Boot from './scenes/Boot'
import MyGame from './scenes/Game';


const game = new Phaser.Game({
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    render: {
        // prevent tile bleeding
        antialiasGL: false,
        // prevent pixel art from becoming blurry when scaled
        pixelArt: true
    },
    parent: 'phaser-example',
    width: 1600,
    height: 900,
    scene: [
        Boot,
        MyGame,
    ]
});
