import Phaser from 'phaser';

const BASE_SPEED = 100;

export default {

  player: {
    speed: {
      x: BASE_SPEED,
      y: BASE_SPEED,
      diagonal: Math.sqrt((BASE_SPEED**2) / 2),
    },
  },
  weapons: {
    bullet: {
      amount: 3,
    }
  }
}