import config from '../../config'

export default class MoveUpState {
	/** @type {Phaser.Physics.Arcade.Sprite} */
	player

	/**
	 * @param {Phaser.Physics.Arcade.Sprite} player 
	 */
	constructor(player) {
		this.player = player
	}

	enter() {
		this.player.play('player.walk.up')
		this.player.setVelocity(0, -config.player.speed.y)
	}
}