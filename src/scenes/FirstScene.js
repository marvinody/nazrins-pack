import Phaser from 'phaser';

import characterSheet from '../assets/characters.png'

export default class FirstScene extends Phaser.Scene {
    constructor() {
        super('first-scene');
    }

    preload() {
        this.load.spritesheet('characters', characterSheet, { frameWidth: 16, frameHeight: 16 })
    }

    create() {
      console.log('first scene starting game')
      this.scene.start('game')

    }
}