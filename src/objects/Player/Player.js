import phaser from "phaser";
import PlayerController from "./PlayerController";


export default class Player extends Phaser.Physics.Arcade.Sprite {
  /** @type {PlayerController} */
  playerController

  /** @type {Number} */
  health

  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    super(scene, 100, 100, 'characters', 1)
    scene.physics.add.existing(this)
    scene.add.existing(this)

    this.playerController = new PlayerController(this, scene)
    this.playerController.setState('idle')

    this.health = 100;

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

  /** @param {Phaser.Physics.Arcade.Sprite} enemy */
  hitBy(enemy) {
    const angle = Phaser.Math.Angle.BetweenPoints(enemy, this);
    const vector = Phaser.Math.Vector2.DOWN.clone().setAngle(angle);

    this.playerController.setState('thrust', vector, 100)
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
  }

}