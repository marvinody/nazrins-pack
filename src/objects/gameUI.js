import Phaser from 'phaser'
import Player from './Player/Player'


export default class GameUI extends Phaser.GameObjects.Container {

  /** @type {Player} */
  player

  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    super(scene);

    this.player = scene.player;

    scene.add.existing(this)

    this.createHealthBar();
    this.outline = this.createOutline();

    this.setPosition(258, 194);
  }

  createOutline() {
    const outline = new Phaser.GameObjects.Graphics(this.scene);
    outline.lineStyle(2, 0x0000ff);
    outline.strokeRect(0, 0, 508, 380);
    this.setScrollFactor(0);

    this.add(outline);

    outline.setVisible(false);


    return outline;
  }

  createHealthBar() {
    this.healthBar = new Phaser.GameObjects.Graphics(this.scene);
    this.healthBar.setScrollFactor(0);
    this.add(this.healthBar)

    this.updateHealthBar();
    
    return this.healthBar;
  }

  updateHealthBar() {
    this.healthBar.clear();
    // Calculate the current health percentage
    const healthPercent = this.player.health / this.player.maxHealth;

    // Draw the health bar
    this.healthBar.fillStyle(0xdd0000, 1);
    this.healthBar.fillRect(0, 375, healthPercent * 100, 5);
  }
}