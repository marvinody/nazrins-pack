import Phaser from 'phaser';

import characterSheet from '../assets/characters.png'
import bullet from '../assets/bullet7.png'

export default class Boot extends Phaser.Scene {
    constructor() {
        super('first-scene');
    }

    preload() {
        this.load.spritesheet('characters', characterSheet, { frameWidth: 16, frameHeight: 16 })
        this.load.image('bullet', bullet)
    }

    create() {
      console.log('first scene starting game')
      this.scene.start('game')

    }
}