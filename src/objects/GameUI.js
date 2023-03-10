import Phaser from 'phaser'
import Player from './Player/Player'
import LevelUpUI from './Player/GameUI/LevelUp';


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
    this.createWeaponStatus();
    this.outline = this.createOutline();
    this.levelUpUI = new LevelUpUI(scene);

    this.setPosition(0, 0);

  }

  showLevelUp(choices) {
    this.levelUpUI.show(choices);
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
    const expPercent = Math.min(player.currentExp / player.expNeededForLevel, 1);

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

  createWeaponStatus() {
    this.weaponGraphics = new Phaser.GameObjects.Graphics(this.scene);
    this.weaponSprites = [];

    this.weaponArea = new Phaser.GameObjects.Container(this.scene, this.HORIOZNTAL_OFFSET, 30, [
      this.weaponGraphics,
    ]);
    this.weaponArea.setScrollFactor(0);
    this.add(this.weaponArea)
    return this.weaponArea;
  }

  updateWeaponStatus(weapons) {
    const MAX_WEAPONS = 6;
    this.weaponGraphics.clear();
    this.weaponGraphics.fillStyle(0xdd0000, 0.25);
    const colors = [0xff0000, 0x00ff00, 0x0000ff];
    const styles = {
      MARGIN_FROM_CONTAINER: 1,
      OUTLINE: 1,
      MARGIN_BETWEEN: 1,
      WIDTH: 16,
    }
    this.weaponGraphics.fillRect(0, 0, MAX_WEAPONS * (16 + 2 + 2), 18);
    for (let i = 0; i < MAX_WEAPONS; i++) {
      this.weaponGraphics.fillStyle(colors[i % colors.length])
      this.weaponGraphics.lineStyle(styles.OUTLINE, colors[(i + 1) % colors.length])

      const leftMargin = styles.MARGIN_FROM_CONTAINER
        + i * (
          2 * (styles.OUTLINE)
          + styles.MARGIN_BETWEEN
          + styles.WIDTH
        );

      const rightMargin = styles.MARGIN_FROM_CONTAINER;

      this.weaponGraphics.strokeRect(
        leftMargin,
        rightMargin,
        16,
        16
      )
    }
  }

}