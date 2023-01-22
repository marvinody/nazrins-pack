import Phaser from 'phaser'

const eventsCenter = new Phaser.Events.EventEmitter()

export const UPDATE_HEALTH = Symbol('UPDATE_HEALTH');
export const UPDATE_EXP = Symbol('UPDATE_EXP');
export const SHOW_LEVEL_UP = Symbol('SHOW_LEVEL_UP');
export const SELECTED_LEVEL_UP_REWARD = Symbol('SELECTED_LEVEL_UP_REWARD');

export default eventsCenter