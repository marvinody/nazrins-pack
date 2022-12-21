import Phaser from 'phaser';

import FirstScene from './scenes/FirstScene'
import MyGame from './scenes/Game';


const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [
        FirstScene,
        MyGame,
    ]
});
