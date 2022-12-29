export default class MoveIdleState {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player 
   */
  constructor(player) {
    this.player = player
  }

  enter() {
    this.player.setVelocity(0, 0)

    const key = this.player.anims?.currentAnim?.key
    if (!key) {
      return;
    }
    const parts = key.split('-')
    const direction = parts[0]
    // this.player.play(`${direction}-idle`)
    this.player.anims.stopAfterDelay(0);
  }
}