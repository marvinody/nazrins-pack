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
    super(scene, 100, 100, 'characters', 1)
    scene.physics.add.existing(this)
    scene.add.existing(this)

    this.playerController = new PlayerController(this, scene)
    this.playerController.setState('idle')

    this.health = 100;
    this.maxHealth = 100;

    this.healthBar = scene.add.graphics();
    this.healthContainer = scene.add.container(0, 0, [this.healthBar]);


    this.updateHealthBar();

    this.setCollideWorldBounds(true);

    // initial state
    this.setData({
      goingUp: false,
      goingDown: false,
      goingLeft: false,
      goingRight: false,
    });

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
  }

  updateHealthBar() {
    // Clear the health bar graphics
    this.healthBar.clear();

    // Calculate the current health percentage
    const healthPercent = this.health / this.maxHealth;

    // Draw the health bar
    this.healthBar.fillStyle(0x00ff00, 1);
    this.healthBar.fillRect(0, 0, healthPercent * 16, 5);
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


  update() {
    this.healthContainer.setPosition(this.x - 8, this.y + 8);

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
  }

}