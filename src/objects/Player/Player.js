import phaser from "phaser";
import PlayerController from "./PlayerController";
import MyGame from '../../scenes/Game'



export default class Player extends Phaser.Physics.Arcade.Sprite {
  /** @type {PlayerController} */
  playerController

  /** @type {Number} */
  health

  /** @type {Number} */
  maxHealth

  /** @type {Phaser.GameObjects.Container} */
  healthContainer

  /** @type {Phaser.GameObjects.Graphics} */
  healthBar

  /** @type {boolean} */
  invulnerable = false;

  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    super(scene, 500, 300, 'characters', 1)
    scene.physics.add.existing(this)
    scene.add.existing(this)

    this.playerController = new PlayerController(this, scene)
    this.playerController.setState('idle')

    this.health = 100;
    this.maxHealth = 100;

    this.healthBar = scene.add.graphics();
    this.outline = scene.add.graphics();

    this.healthContainer = scene.add.container(this.x, this.y, [this.healthBar, this.outline]);

    this.outline.clear();
    this.outline.lineStyle(1, 0x0000ff);
    this.outline.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    this.updateHealthBar();

    this.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();

    scene.anims.create({
      key: 'player.walk.down',
      frames: scene.anims.generateFrameNumbers('characters', { frames: [0, 1, 2] }),
      frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'player.walk.left',
      frames: scene.anims.generateFrameNumbers('characters', { frames: [12, 13, 14] }),
      frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'player.walk.right',
      frames: scene.anims.generateFrameNumbers('characters', { frames: [24, 25, 26] }),
      frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'player.walk.up',
      frames: scene.anims.generateFrameNumbers('characters', { frames: [36, 37, 38] }),
      frameRate: 8,
      repeat: -1,
    })


    this.play('player.walk.right')
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
      console.log('-'.repeat(10))
      console.log(this.scene.cameras.main.roundPixels)
      this.scene.cameras.main.setRoundPixels(!this.scene.cameras.main.roundPixels)
      console.log('current:', this.scene.cameras.main.roundPixels)
    })
  }

  updateHealthBar() {
    // Clear the health bar graphics
    this.healthBar.clear();

    // Calculate the current health percentage
    const healthPercent = this.health / this.maxHealth;

    // Draw the health bar
    this.healthBar.fillStyle(0xdd0000, 1);
    const MAX_WIDTH = 16;
    this.healthBar.fillRect(-MAX_WIDTH / 2, 8, healthPercent * MAX_WIDTH, 5);
  }

  flash(color, duration) {
    this.setTint(color);

    this.scene.time.addEvent({
      callback: () => this.setTint(0xffffff),
      delay: duration,
      loop: false,
    })
  }

  setInvulnFor(duration) {
    this.invulnerable = true;
    this.scene.time.addEvent({
      callback: () => this.invulnerable = false,
      delay: duration,
      loop: false,
    })
  }

  /** @param {Phaser.Physics.Arcade.Sprite} enemy */
  hitBy(enemy) {
    if (this.invulnerable) {
      return;
    }

    this.setInvulnFor(250);

    const angle = Phaser.Math.Angle.BetweenPoints(enemy, this);
    const vector = Phaser.Math.Vector2.DOWN.clone().setAngle(angle);

    this.health -= 10;
    this.updateHealthBar();

    this.playerController.setState('thrust', vector, 100)
    this.flash(0xff0000, 100)

  }

  preUpdate(time, delta) {

  }

  update() {
    // we do this here to make the recoil uncontrollable
    // the 'update' to remove this is in a timeout
    if (this.playerController.currentState === this.playerController.states['thrust']) {
      return;
    }

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
    this.healthContainer.setPosition(this.x, this.y);
  }

}