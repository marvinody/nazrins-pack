import Phaser from 'phaser';

import characterSheet from '../assets/characters.png'

export default class MyGame extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {

    }

    create() {

        this.anims.create({
            key: 'player.walk.down',
            frames: this.anims.generateFrameNumbers('characters', { frames: [0, 1, 2] }),
            frameRate: 8,
            repeat: -1,
        })

        this.player = this.add.sprite(400, 300, 'characters', 1)
        this.player.setScale(8)

    }

    update() {
        // console.log('IS OUT')
        if (this.input.activePointer.isDown) {
            // console.log('IS DOWN')
            this.player.play('player.walk.down', true)
        }
    }
}