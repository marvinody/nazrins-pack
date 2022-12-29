import Phaser from 'phaser';

import PlayerController from './PlayerController';
import characterSheet from '../assets/characters.png'
import config from '../config'

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
            classType: Bullet
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

    /** @type {PlayerController} */
    playerController // 👈 create a class property

    /** @type {Bullets} */
    bullets

    constructor() {
        super('game');
    }

    preload() {

    }

    create() {
        this.bullets = new Bullets(this);

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

        const vectors = splitUnitCircle(config.weapons.bullet.amount).map(angle => ([
            Math.cos(angle), -Math.sin(angle)
        ]));

        setInterval(() => {
            vectors.forEach((vector) => {
                this.bullets.fireBullet(this.player.x, this.player.y, vector[0]*100, vector[1]*100);
            })
        }, 1000)
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