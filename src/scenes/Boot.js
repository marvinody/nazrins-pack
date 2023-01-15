import Phaser from 'phaser';

import characterSheet from '../assets/characters.png'
import bullet from '../assets/bullet7.png'
import power from '../assets/unassembled/power.png'
import fullpower from '../assets/unassembled/fullpower.png'
import star from '../assets/unassembled/star.png'
import map from '../assets/map.json'
import map2 from '../assets/map2.json'
import basictile from '../assets/basictiles_2.png'
import basictileExtruded from '../assets/basictiles_2_extruded.png'

export default class Boot extends Phaser.Scene {
    constructor() {
        super('first-scene');
    }

    preload() {
        this.load.spritesheet('characters', characterSheet, { frameWidth: 16, frameHeight: 16 })
        this.load.image('bullet', bullet)

        this.load.tilemapTiledJSON('map', map);
        this.load.tilemapTiledJSON('map2', map2);
        this.load.image('basictiles_2', basictile)
        this.load.image('power', power)
        this.load.image('fullpower', fullpower)
        this.load.image('star', star)
        this.load.image('basictiles_2_extruded', basictileExtruded)
    }

    create() {
      console.log('first scene starting game')
      this.scene.start('game')

    }
}