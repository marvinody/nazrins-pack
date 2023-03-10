import phaser from "phaser";
import PlayerController from "./PlayerController";
import MyGame from '../../scenes/Game'
import config from '../../config'
import { ExpGem } from "../misc/Exp";
import eventsCenter, { SELECTED_LEVEL_UP_REWARD, SHOW_LEVEL_UP, UPDATE_EXP } from "../../scenes/EventsCenter";


export default class Player extends Phaser.Physics.Arcade.Sprite {
  /** @type {PlayerController} */
  playerController

  /** @type {Number} */
  health

  /** @type {Number} */
  maxHealth

  /** @type {Phaser.GameObjects.Container} */
  healthContainer

  /** @type {Phaser.GameObjects.Graphics} */
  healthBar

  /** @type {boolean} */
  invulnerable = false;

  /** @type {number} */
  level = 1;

  /** @type {number} */
  expNeededForLevel = 10;

  /** @type {number} */
  currentExp = 9;

  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    super(scene, 150, 150, 'nazrinpack', 'chars/naz/walk/down/naz-0.png')

    scene.anims.create({
      key: 'player.walk.down',
      frames: scene.anims.generateFrameNames('nazrinpack', {
        start: 0, end: 2, zeroPad: 0,
        prefix: 'chars/naz/walk/down/naz-', suffix: '.png'
      }), frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'player.walk.left',
      frames: scene.anims.generateFrameNames('nazrinpack', {
        start: 0, end: 2, zeroPad: 0,
        prefix: 'chars/naz/walk/left/naz-', suffix: '.png'
      }),
      frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'player.walk.right',
      frames: scene.anims.generateFrameNames('nazrinpack', {
        start: 0, end: 2, zeroPad: 0,
        prefix: 'chars/naz/walk/right/naz-', suffix: '.png'
      }), frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'player.walk.up',
      frames: scene.anims.generateFrameNames('nazrinpack', {
        start: 0, end: 2, zeroPad: 0,
        prefix: 'chars/naz/walk/up/naz-', suffix: '.png'
      }), frameRate: 8,
      repeat: -1,
    })

    scene.physics.add.existing(this)
    scene.add.existing(this)

    this.playerController = new PlayerController(this, scene)
    this.playerController.setState('idle')

    this.health = 100;
    this.maxHealth = 100;

    this.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();

    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
      console.log('-'.repeat(10))
      console.log(this.scene.cameras.main.worldView)
      console.log(this.scene.cameras.main.getWorldPoint(0, 0));
      console.log(this.scene.cameras.main.getWorldPoint(100, 100));
    })

    this.setSize(this.width / 2, this.height / 2)

    this.selectLevelUpReward = this.selectLevelUpReward.bind(this);

    eventsCenter.on(SELECTED_LEVEL_UP_REWARD, this.selectLevelUpReward);
  }

  getCollectionCircle() {
    const center = this.getCenter();
    return new Phaser.Geom.Circle(center.x, center.y, config.player.collection.misc);
  }


  flash(color, duration) {
    this.setTint(color);

    this.scene.time.addEvent({
      callback: () => this.setTint(0xffffff),
      delay: duration,
      loop: false,
    })
  }

  setInvulnFor(duration) {
    this.invulnerable = true;
    this.scene.time.addEvent({
      callback: () => this.invulnerable = false,
      delay: duration,
      loop: false,
    })
  }

  /** @param {Phaser.Physics.Arcade.Sprite} enemy */
  hitBy(enemy) {
    if (this.invulnerable) {
      return;
    }

    this.setInvulnFor(250);

    const angle = Phaser.Math.Angle.BetweenPoints(enemy, this);
    const vector = Phaser.Math.Vector2.DOWN.clone().setAngle(angle);

    this.health -= 10;

    this.playerController.setState('thrust', vector, 100)
    this.flash(0xff0000, 100)

  }

  /** @param {ExpGem} gem */
  collectedGem(gem) {
    gem.die();

    // multipy exp increase here if needed
    this.currentExp += gem.value;
    eventsCenter.emit(UPDATE_EXP, this);
    this.handleExpGain();
  }

  handleExpGain() {
    if (this.currentExp >= this.expNeededForLevel) {
      this.currentExp -= this.expNeededForLevel;
      this.levelUp();
    }
  }

  selectLevelUpReward(choices, index) {
    const choice = choices[index];
    if(choice.weapon === 'GUN') {
      this.scene.bullets.levelUp(choice)
    }
    this.handleExpGain();
  }

  levelUp() {
    this.level += 1;
    // needed to send update again to see the player level up in the UI
    eventsCenter.emit(UPDATE_EXP, this);
    const levelUpChoices = this.scene.bullets.getAvailableLevelups();
    if(levelUpChoices.length > 0) {
      this.scene.scene.pause('game'); 
      eventsCenter.emit(SHOW_LEVEL_UP, levelUpChoices)
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  heal(amt) {
    this.health += amt;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  update() {
    // we do this here to make the recoil uncontrollable
    // the 'update' to remove this is in a timeout
    if (this.playerController.currentState === this.playerController.states['thrust']) {
      return;
    }

    const down = this.cursors.down.isDown;
    const up = this.cursors.up.isDown;
    const left = this.cursors.left.isDown;
    const right = this.cursors.right.isDown;

    if (up && left) {
      this.playerController.setState('moveUpLeft')
    } else if (up && right) {
      this.playerController.setState('moveUpRight')
    } else if (down && left) {
      this.playerController.setState('moveDownLeft')
    } else if (down && right) {
      this.playerController.setState('moveDownRight')
    } else if (left) {
      this.playerController.setState('moveLeft')
    } else if (right) {
      this.playerController.setState('moveRight')
    } else if (up) {
      this.playerController.setState('moveUp')
    } else if (down) {
      this.playerController.setState('moveDown')
    } else {
      this.playerController.setState('idle')
    }

  }

}