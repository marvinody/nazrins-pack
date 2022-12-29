import config from '../../../config'

export default class MoveRightState {
	/** @type {Phaser.Physics.Arcade.Sprite} */
	player

	/**
	 * @param {Phaser.Physics.Arcade.Sprite} player 
	 */
	constructor(player) {
		this.player = player
	}

	enter() {
		this.player.play('player.walk.right')
		this.player.setVelocity(config.player.speed.x, 0)
	}
}