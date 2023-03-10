import Phaser from 'phaser';

import GameUI from '../objects/GameUI';
import Player from '../objects/Player/Player';
import eventsCenter, { SHOW_LEVEL_UP, UPDATE_EXP, UPDATE_HEALTH } from './EventsCenter';


export default class GameUIScene extends Phaser.Scene {

  constructor() {
    super('game-ui-scene');
  }

  cleanup() {
    eventsCenter.off(UPDATE_HEALTH, this.ui.updateHealthBar, this.ui);
    eventsCenter.off(UPDATE_EXP, this.ui.updateExpLine, this.ui);
    eventsCenter.off(SHOW_LEVEL_UP, this.ui.showLevelUp, this.ui);
  }

  init({ player }) {
    this.ui = new GameUI(this);

    this.ui.updateHealthBar(player)
    this.ui.updateExpLine(player)
  }

  create() {
    eventsCenter.on(UPDATE_HEALTH, this.ui.updateHealthBar, this.ui);
    eventsCenter.on(UPDATE_EXP, this.ui.updateExpLine, this.ui);
    eventsCenter.on(SHOW_LEVEL_UP, this.ui.showLevelUp, this.ui);
    this.ui.updateWeaponStatus();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanup();
    })

  }
}