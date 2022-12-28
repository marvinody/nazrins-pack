import config from '../../config'

export default class MoveDownState {
	/** @type {Phaser.Physics.Arcade.Sprite} */
	player

	/**
	 * @param {Phaser.Physics.Arcade.Sprite} player 
	 */
	constructor(player) {
		this.player = player
	}

	enter() {
		this.player.play('player.walk.down')
		this.player.setVelocity(0, config.player.speed.y)
	}
}