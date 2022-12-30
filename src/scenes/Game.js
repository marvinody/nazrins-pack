import Phaser from 'phaser';

import characterSheet from '../assets/characters.png'
import config from '../config'
import Player from '../objects/Player/Player';

const splitUnitCircle = (n) => {
    const angles = [];
    const increment = Math.PI * 2 / (n)
    for (let idx = 0; idx < n; idx++) {
        angles.push(increment * idx)
    }
    return angles;
}

class Sword extends Phaser.Physics.Arcade.Sprite {

}

class SlimeEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'characters', 48);
        this.bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
    }

    spawn(x, y) {
        console.log('SPAWNED')
        console.log(this.texture)
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        this.enableBody();

        this.setVelocityX(10);
        this.anims.play('slime.walk.right')
    }

    die() {
        this.setActive(false);
        this.setVisible(false);
        this.disableBody();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.bounds.contains(this.x, this.y)) {
            this.die();
        }

    }

    update(time, delta) {
        console.log(this, time, delta)
    }
}

class SlimeEnemyGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 10,
            key: 'characters',
            setScale: {
                x: 3,
                y: 3,
            },
            active: false,
            visible: false,
            classType: SlimeEnemy,
        });

        scene.anims.create({
            key: 'slime.walk.down',
            frames: scene.anims.generateFrameNumbers('characters', { frames: [48, 49, 50] }),
            frameRate: 8,
            repeat: -1,
        })

        scene.anims.create({
            key: 'slime.walk.left',
            frames: scene.anims.generateFrameNumbers('characters', { frames: [60, 61, 21] }),
            frameRate: 8,
            repeat: -1,
        })

        scene.anims.create({
            key: 'slime.walk.right',
            frames: scene.anims.generateFrameNumbers('characters', { frames: [72, 73, 74] }),
            frameRate: 8,
            repeat: -1,
        })

        scene.anims.create({
            key: 'slime.walk.up',
            frames: scene.anims.generateFrameNumbers('characters', { frames: [84, 85, 86] }),
            frameRate: 8,
            repeat: -1,
        })
    }

    spawn(x, y) {
        let slime = this.getFirstDead(false);

        if (slime) {
            slime.spawn(x, y);
        }
    }
}

class Bullet extends Phaser.Physics.Arcade.Sprite {
    /** @type {Phaser.Geom.Rectangle} */
    bounds

    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
    }


    fire(x, y, velX, velY) {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocity(velX, velY);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.bounds.contains(this.x, this.y)) {
            this.setActive(false);
            this.setVisible(false);
        }

    }
}

class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 100,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet,
        });
    }

    fireBullet(x, y, velX, velY) {
        let bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.fire(x, y, velX, velY);
        }
    }
}

export default class MyGame extends Phaser.Scene {

    /** @type {Bullets} */
    bullets

    /** @type {SlimeEnemyGroup} */
    slimes

    /** @type {Array<Number>} */
    intervals = [];

    constructor() {
        super('game');
    }

    preload() {

    }

    addInterval(fn, ms) {
        const intervalId = setInterval(fn, ms)
        this.intervals.push(intervalId)
    }

    cleanup() {
        this.stopAllIntervals();
    }

    stopAllIntervals() {
        for (let interval of this.intervals) {
            clearInterval(interval);
        }
    }

    /** 
     * @param {Player} player 
     * @param {SlimeEnemy} slime 
     * */
    handlePlayerSlimeCollide(player, slime) {
        this.scene.restart();
    }

    /** 
     * @param {Bullet} bullet 
     * @param {SlimeEnemy} slime 
     * */
    handleBulletSlimeCollide(bullet, slime) {
        slime.die();
    }

    create() {
        this.player = new Player(this);

        this.cameras.main.startFollow(this.player)

        this.bullets = new Bullets(this);
        this.slimes = new SlimeEnemyGroup(this);

        this.slimes.spawn(100, 100)

        this.physics.add.collider(this.player, this.slimes, this.handlePlayerSlimeCollide, undefined, this)
        this.physics.add.overlap(this.bullets, this.slimes, this.handleBulletSlimeCollide, undefined, this)


        const vectors = splitUnitCircle(config.weapons.bullet.amount).map(angle => ([
            Math.cos(angle), -Math.sin(angle)
        ]));

        this.addInterval(() => {
            vectors.forEach((vector) => {
                this.bullets.fireBullet(this.player.x, this.player.y, vector[0] * 100, vector[1] * 100);
            })
        }, 2000)

        this.addInterval(() => {
            this.slimes.spawn(100, 100)
        }, 3000)

        this.events.on('shutdown', this.cleanup, this);
        this.slimes.runChildUpdate = true
    }

    update() {
        this.player.update();

        
    }
}