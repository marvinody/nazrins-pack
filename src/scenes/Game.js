import Phaser from 'phaser';

import PlayerController from './PlayerController';
import characterSheet from '../assets/characters.png'
import config from '../config'
import Player from '../objects/Player';

const splitUnitCircle = (n) => {
    const angles = [];
    const increment = Math.PI * 2 / (n )
    for (let idx = 0; idx < n; idx++) {
        angles.push(increment * idx)
    }
    return angles;
}

class Sword extends Phaser.Physics.Arcade.Sprite {

}

// class SlimeEnemyGroup extends Phaser.Physics.Arcade.GROUP {
//     constructor(scene) {
//         super(scene.physics.world, scene);

//         this.createMultiple({
//             frameQuantity: 100,
//             key: 'bullet',
//             active: false,
//             visible: false,
//             classType: Bullet,
//         });

//         this.anims.create({
//             key: 'slime.walk.down',
//             frames: scene.anims.generateFrameNumbers('characters', { frames: [0, 1, 2] }),
//             frameRate: 8,
//             repeat: -1,
//         })

//         scene.anims.create({
//             key: 'slime.walk.left',
//             frames: scene.anims.generateFrameNumbers('characters', { frames: [12, 13, 14] }),
//             frameRate: 8,
//             repeat: -1,
//         })

//         scene.anims.create({
//             key: 'slime.walk.right',
//             frames: scene.anims.generateFrameNumbers('characters', { frames: [24, 25, 26] }),
//             frameRate: 8,
//             repeat: -1,
//         })

//         scene.anims.create({
//             key: 'slime.walk.up',
//             frames: scene.anims.generateFrameNumbers('characters', { frames: [36, 37, 38] }),
//             frameRate: 8,
//             repeat: -1,
//         })
//     }
// }

class SlimeEnemy extends Phaser.Physics.Arcade.Sprite {

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

        if(!this.bounds.contains(this.x, this.y)) {
            console.count('DEAD BULLET')
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
            bullet.fire(x, y,velX, velY);
        }
    }
}

export default class MyGame extends Phaser.Scene {



    /** @type {Bullets} */
    bullets

    constructor() {
        super('game');
    }

    preload() {
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
    }

    create() {
        this.bullets = new Bullets(this);

        this.player = new Player(this);

        const vectors = splitUnitCircle(config.weapons.bullet.amount).map(angle => ([
            Math.cos(angle), -Math.sin(angle)
        ]));

        // setInterval(() => {
        //     vectors.forEach((vector) => {
        //         this.bullets.fireBullet(this.player.x, this.player.y, vector[0]*100, vector[1]*100);
        //     })
        // }, 1000)
    }

    update() {
        this.player.update();
    }
}