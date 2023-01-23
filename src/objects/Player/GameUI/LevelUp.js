import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext.js';
import eventsCenter, { SELECTED_LEVEL_UP_REWARD } from '../../../scenes/EventsCenter';
import ThrustedState from '../states/ThrustedState';



const MAX_CHOICES = 4;
const Y_MARGIN_BETWEEN = 10;
const emptyChoices = [];
for (let i = 0; i < MAX_CHOICES; i++) {
  emptyChoices.push({
    text: '',
  })
}


export default class LevelUpUI extends Phaser.GameObjects.Container {


  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    super(scene, 300, 300);

    scene.add.existing(this)

    this.upKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.downKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    this.enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.handleUpKey = this.handleUpKey.bind(this);
    this.handleDownKey = this.handleDownKey.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);

    this.choices = emptyChoices
    this.createLevelUpMenu();

    this.setVisible(false);

  }

  createLevelUpMenu() {
    const textChoices = [];
    for (let i = 0; i < MAX_CHOICES; i++) {

      const choice = this.choices[i];
      const txt = new BBCodeText(this.scene, 100, 0, '', {
        backgroundColor: '#555',
        fontSize: 20,
        padding: { left: 4, right: 4, top: 4, bottom: 4 },
        backgroundStrokeColor: '#000'
      });

      txt.addImage('gun', {
        key: 'nazrinpack',
        frame: 'misc/gun.png',
      });

      txt.setText(choice.text)

      textChoices.push(txt);

    }

    this.textChoices = textChoices;

    this.add(this.textChoices)
  }

  show(choices) {
    this.choices = choices;
    this.currentSelection = 0;

    this.addBindings();
    this.updateLevelUpMenu();
    this.setVisible(true);
  }

  hide() {
    this.removeBindings();
    this.setVisible(false);
  }

  addBindings() {
    this.upKey.on('down', this.handleUpKey);
    this.downKey.on('down', this.handleDownKey);
    this.enterKey.on('down', this.handleEnterKey);
  }

  removeBindings() {
    this.upKey.off('down', this.handleUpKey)
    this.downKey.off('down', this.handleDownKey);
    this.enterKey.off('down', this.handleEnterKey);
  }


  handleUpKey() {
    this.currentSelection = (this.currentSelection - 1 + this.choices.length) % this.choices.length;
    this.updateLevelUpMenu();
  }

  handleDownKey() {
    this.currentSelection = (this.currentSelection + 1) % this.choices.length;
    this.updateLevelUpMenu();
  }

  handleEnterKey() {
    this.hide();
    this.scene.scene.resume('game')
    eventsCenter.emit(SELECTED_LEVEL_UP_REWARD, this.choices, this.currentSelection)
  }

  updateLevelUpMenu() {
    let runningYOffset = 0;
    for (let i = 0; i < this.choices.length; i++) {
      const choice = this.choices[i];
      const isSelected = i === this.currentSelection;
      const textChoice = this.textChoices[i];

      textChoice.setVisible(true);
      textChoice.setY(runningYOffset)
      textChoice.setText(choice.text);
      textChoice.setBackgroundStrokeColor(isSelected ? '#f00' : '#000', 2)

      runningYOffset += textChoice.height + Y_MARGIN_BETWEEN;
    }

    for( let i = this.choices.length; i < MAX_CHOICES; i++) {
      const textChoice = this.textChoices[i];
      textChoice.setVisible(false);
    }
  }


}