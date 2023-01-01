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
        // this.scene.restart();
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
        const map = this.make.tilemap({ key: 'map' });

        // Add the tileset image to the map
        const tileset = map.addTilesetImage('basictiles_2', 'basictiles_2');

        // Create the layers specified in the Tiled editor
        const layer = map.createLayer('mainlayer', tileset, 0, 0);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = new Player(this);

        this.cameras.main
            .setZoom(3)
            .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
            .startFollow(this.player)

        this.cameras.main.startFollow(this.player)

        this.bullets = new Bullets(this, this.player);
        this.slimes = new SlimeEnemyGroup(this);

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

        this.game.events
            .on(Phaser.Core.Events.BLUR, () => {
                // Pause the game when the user switches to a different tab or window
                console.log("PAUSING", this.game)
                console.log(this.game.pause)
                this.game?.pause();
            })
            .on(Phaser.Core.Events.FOCUS, () => {
                // Resume the game when the user switches back to the game tab
                console.log("FOCUSED", this.game)
                this.game?.resume();
            }).on(Phaser.Core.Events.RESUME, () => {
                console.count('RESUMING')
            })

        this.events.on('shutdown', this.cleanup, this);
    }

    update() {
        this.player.update();

        this.slimes.children.each(slime => {
            if (!slime.active) {
                return;
            }
            const angle = Phaser.Math.Angle.Between(slime.x, slime.y, this.player.x, this.player.y);

            // Set the velocity of the enemy based on the calculated angle and the speed
            slime.setVelocity(Math.cos(angle) * config.enemies.slime.speed, Math.sin(angle) * config.enemies.slime.speed);
        })
    }
}