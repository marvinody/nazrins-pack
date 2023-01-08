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
    this.createExpLine();
    this.outline = this.createOutline();

    this.setPosition(258, 194);
  }

  createExpLine() {
    this.expText = new Phaser.GameObjects.Text(this.scene, 0, 360)
    this.expBar = new Phaser.GameObjects.Graphics(this.scene);

    this.expText.setFontSize(10)

    this.add(this.expText);
    this.add(this.expBar);
    this.updateExpLine();
  }

  updateExpLine() {
    this.expText.setText(`Level:${this.player.level}`)
    this.expBar.clear();
    const expPercent = this.player.currentExp / this.player.expNeededForLevel;

    this.expBar.fillStyle(0x0000ff);
    this.expBar.fillRect(0, 370, expPercent * 100, 5);
  }

  createOutline() {
    const outline = new Phaser.GameObjects.Graphics(this.scene);
    outline.lineStyle(1, 0x0000ff);
    console.log({
      height: this.scene.scale.height,
      width: this.scene.scale.width,
    })
    outline.strokeRect(0, 0, 508, 380);
    this.setScrollFactor(0);

    this.add(outline);

    outline.setVisible(true);


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