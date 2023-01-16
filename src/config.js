
const BASE_SPEED = 100;

export default {

  player: {
    speed: {
      x: BASE_SPEED,
      y: BASE_SPEED,
      diagonal: Math.sqrt((BASE_SPEED**2) / 2),
    },
    collection: {
      misc: 50
    }
  },
  enemies: {
    slime: {
      speed: BASE_SPEED * 0.8,
    }
  },
  misc: {
    exp: {
      speed: BASE_SPEED * 0.9,
      value: 1,
      maxRegular: 10,
      maxSuper: 3,
    },
    cheese: {
      heal: 33,
    }
  },
  weapons: {
    bullet: {
      amount: 3,
      speed: BASE_SPEED*1.1,
    }
  }
}