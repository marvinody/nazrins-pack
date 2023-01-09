import Phaser from 'phaser'
import Player from './Player/Player'


export default class GameUI extends Phaser.GameObjects.Container {

  /** @type {Player} */
  player

  /**  */
  VERTICAL_OFFSET = 50;
  HORIOZNTAL_OFFSET = 10;
  

  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    super(scene);

    this.player = scene.player;

    scene.add.existing(this)



    this.createHealthBar();
    this.createExpLine();
    this.outline = this.createOutline();

    this.setPosition(0, 0);
  }

  createExpLine() {
    this.expText = new Phaser.GameObjects.Text(this.scene, this.HORIOZNTAL_OFFSET, this.VERTICAL_OFFSET)
    this.expBar = new Phaser.GameObjects.Graphics(this.scene);

    this.expText.setFontSize(16)

    this.add(this.expText);
    this.add(this.expBar);

  }

  updateExpLine(player) {
    this.expText.setText(`Level:${player.level}`)
    this.expBar.clear();
    const expPercent = player.currentExp / player.expNeededForLevel;

    this.expBar.fillStyle(0x0000ff);
    this.expBar.fillRect(this.HORIOZNTAL_OFFSET, this.VERTICAL_OFFSET + 10 + 6, expPercent * 100, 5);
  }

  createOutline() {
    const outline = new Phaser.GameObjects.Graphics(this.scene);
    outline.lineStyle(10, 0x0000ff);
    outline.strokeRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    this.setScrollFactor(0);

    this.add(outline);

    outline.setVisible(false);


    return outline;
  }

  createHealthBar() {
    this.healthBar = new Phaser.GameObjects.Graphics(this.scene);
    this.healthBar.setScrollFactor(0);
    this.add(this.healthBar)

    return this.healthBar;
  }

  updateHealthBar(player) {
    this.healthBar.clear();
    // Calculate the current health percentage
    const healthPercent = player.health / player.maxHealth;

    // Draw the health bar
    this.healthBar.fillStyle(0xdd0000, 1);
    this.healthBar.fillRect(this.HORIOZNTAL_OFFSET, this.VERTICAL_OFFSET + 15 + 6, healthPercent * 100, 5);
  }
}