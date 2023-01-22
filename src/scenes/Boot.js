import Phaser from 'phaser';

import map2 from '../assets/map.json'
import basictileExtruded from '../assets/spritesheets/floortiles/basictiles_2_extruded.png'
import atlassprites from '../assets/atlas.png'
import atlasdata from '../assets/atlas.json'

export default class Boot extends Phaser.Scene {
    constructor() {
        super('first-scene');
    }

    preload() {
        this.load.atlas({
            key: 'nazrinpack',
            atlasURL: atlasdata,
            textureURL: atlassprites
        });

        this.load.tilemapTiledJSON('map', map2);
        this.load.image('basictiles_2', basictileExtruded)
    }

    create() {
      console.log('first scene starting game')
      this.scene.start('game')
    }
}