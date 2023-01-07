import Phaser from 'phaser';

import characterSheet from '../assets/characters.png'
import config from '../config'
import Player from '../objects/Player/Player';
import { Bullets } from '../objects/weapons/Bullet'
import { SlimeEnemyGroup } from '../objects/enemies/Slime'

export default class MyGame extends Phaser.Scene {

    /** @type {Bullets} */
    bullets

    /** @type {SlimeEnemyGroup} */
    slimes

    constructor() {
        super('game');
    }

    preload() {

    }

    addInterval(fn, ms) {
        this.time.addEvent({
            delay: ms,
            callback: fn,
            loop: true,
        })
    }

    cleanup() {
        this.time.removeAllEvents();
    }

    /** 
     * @param {Player} player 
     * @param {SlimeEnemy} slime 
     * */
    handlePlayerSlimeCollide(player, slime) {
        player.hitBy(slime)

        if (player.health <= 0) {
            this.scene.restart();
        }
    }

    /** 
     * @param {Bullets} bullet 
     * @param {SlimeEnemy} slime 
     * */
    handleBulletSlimeCollide(bullet, slime) {
        slime.die();
    }

    create() {

        // Create a new tilemap from the loaded data
        const map = this.make.tilemap({ key: 'map2' });

        // Add the tileset image to the map
        const tileset = map.addTilesetImage('basictiles_2', 'basictiles_2_extruded', 16, 16, 1, 2);



        // Create the layers specified in the Tiled editor
        const layer = map.createLayer('mainlayer', tileset, 0, 0);
        const enemyspawn = map.createLayer('enemyspawn', tileset, 0, 0);



        this.map = map;

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = new Player(this);



        this.cameras.main
            .setZoom(2)
            .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
            .startFollow(this.player, false, 0.9, 0.9)

        this.bullets = new Bullets(this, this.player);
        this.slimes = new SlimeEnemyGroup(this, this.player);

        this.physics.add.collider(
            this.player,
            this.slimes,
            this.handlePlayerSlimeCollide, undefined, this
        );

        this.physics.add.overlap(
            this.bullets,
            this.slimes,
            this.handleBulletSlimeCollide, undefined, this
        );

        // TODO, fix this I guess?
        // this.game.events
        //     .on(Phaser.Core.Events.BLUR, () => {
        //         // Pause the game when the user switches to a different tab or window
        //         console.log("PAUSING", this.game)
        //         console.log(this.game.pause)
        //         this.game?.pause();
        //     })
        //     .on(Phaser.Core.Events.FOCUS, () => {
        //         // Resume the game when the user switches back to the game tab
        //         console.log("FOCUSED", this.game)
        //         this.game?.resume();
        //     }).on(Phaser.Core.Events.RESUME, () => {
        //         console.count('RESUMING')
        //     })

        this.events.on('shutdown', this.cleanup, this);
    }

    update() {
        this.player.update();

        this.slimes.update();
    }
}