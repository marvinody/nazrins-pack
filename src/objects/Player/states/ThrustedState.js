import config from '../../../config'
import MyGame from '../../../scenes/Game'
import Player from '../Player'

export default class ThrustedState {
  /** @type {Player} */
  player

  /** @type {Phaser.Time.TimerEvent} */
  timer

  /** @type {MyGame} */
  scene

  /**
   * @param {Player} player 
   * @param {Phaser.Scene} scene
   */
  constructor(player, scene) {
    this.player = player

    this.scene = scene

  }

  enter(direction, duration) {
    this.player.setVelocity(
      direction.x * config.player.speed.x * 2,
      direction.y * config.player.speed.y * 2,
    );
    
    const timeConfig = {
      callback: () => {
        this.player.playerController.setState('idle')
      },
      delay: duration,
      loop: false,
    }

    if(!this.timer || this.timer.hasDispatched) {
      // create a new event only when first time or it's fired already
      this.timer = this.scene.time.addEvent(timeConfig)
    } else {
      // otherwise, let's update the same one
      this.timer.reset(timeConfig)
    }
  }
}