import config from '../../config'

export default class MoveLeftState {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player 
   */
  constructor(player) {
    this.player = player
  }

  enter() {
    this.player.play('player.walk.left')
    this.player.setVelocity(-config.player.speed.x, 0)
  }
}