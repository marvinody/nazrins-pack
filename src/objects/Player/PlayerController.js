import MoveIdleState from "./states/MoveIdleState"
import MoveLeftState from "./states/MoveLeftState"
import MoveRightState from "./states/MoveRightState"
import MoveDownState from "./states/MoveDownState"
import MoveUpState from "./states/MoveUpState"
import MoveUpRightState from "./states/MoveUpRightState"
import MoveUpLeftState from "./states/MoveUpLeftState"
import MoveDownRightState from "./states/MoveDownRightState"
import MoveDownLeftState from "./states/MoveDownLeftState"

export default class PlayerController {
	/** @type {{ [key: string]: { enter: () => void } }} */
	states

	/** @type {{ enter: () => void }} */
	currentState

	/**
	 * @param {Phaser.Physics.Arcade.Sprite} player 
	 */
	constructor(player) {
		this.states = {
			idle: new MoveIdleState(player),
			moveLeft: new MoveLeftState(player),
			moveRight: new MoveRightState(player),
			moveDown: new MoveDownState(player),
			moveUp: new MoveUpState(player),
			moveUpRight: new MoveUpRightState(player),
			moveUpLeft: new MoveUpLeftState(player),
			moveDownRight: new MoveDownRightState(player),
			moveDownLeft: new MoveDownLeftState(player),
		}
	}

	/**
	 * 
	 * @param {string} name 
	 */
	setState(name) {
		if (this.currentState === this.states[name]) {
			return
		}

		this.currentState = this.states[name]
		this.currentState.enter()
	}
}