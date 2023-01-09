import Phaser from 'phaser'

const eventsCenter = new Phaser.Events.EventEmitter()

export const UPDATE_HEALTH = Symbol('UPDATE_HEALTH');
export const UPDATE_EXP = Symbol('UPDATE_EXP');


export default eventsCenter