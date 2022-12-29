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
    parent: 'phaser-example',
    width: 1600,
    height: 900,
    scene: [
        Boot,
        MyGame,
    ]
});
