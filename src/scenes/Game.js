import Phaser from 'phaser';

import PlayerController from './PlayerController';
import characterSheet from '../assets/characters.png'
import config from '../config'

console.log(JSON.stringify(config, null, 2))

export default class MyGame extends Phaser.Scene {

    /** @type {PlayerController} */
    playerController // 👈 create a class property

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

        this.anims.create({
            key: 'player.walk.left',
            frames: this.anims.generateFrameNumbers('characters', { frames: [12, 13, 14] }),
            frameRate: 8,
            repeat: -1,
        })

        this.anims.create({
            key: 'player.walk.right',
            frames: this.anims.generateFrameNumbers('characters', { frames: [24, 25, 26] }),
            frameRate: 8,
            repeat: -1,
        })

        this.anims.create({
            key: 'player.walk.up',
            frames: this.anims.generateFrameNumbers('characters', { frames: [36, 37, 38] }),
            frameRate: 8,
            repeat: -1,
        })

        this.player = this.physics.add.sprite(400, 300, 'characters', 1)
        this.player.setScale(4)

        // initial state
        this.player.setData({
            goingUp: false,
            goingDown: false,
            goingLeft: false,
            goingRight: false,
        })

        this.playerController = new PlayerController(this.player)
        this.playerController.setState('idle')

        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update() {

        const down = this.cursors.down.isDown;
        const up = this.cursors.up.isDown;
        const left = this.cursors.left.isDown;
        const right = this.cursors.right.isDown;

        if (up && left) {
            this.playerController.setState('moveUpLeft')
        } else if (up && right) {
            this.playerController.setState('moveUpRight')
        } else if (down && left) {
            this.playerController.setState('moveDownLeft')
        } else if (down && right) {
            this.playerController.setState('moveDownRight')
        } else if (left) {
            this.playerController.setState('moveLeft')
        } else if (right) {
            this.playerController.setState('moveRight')
        } else if (up) {
            this.playerController.setState('moveUp')
        } else if (down) {
            this.playerController.setState('moveDown')
        } else {
            this.playerController.setState('idle')
        }
    }
}