export const splitUnitCircle = (n) => {
  const angles = [];
  const increment = Math.PI * 2 / (n)
  for (let idx = 0; idx < n; idx++) {
      angles.push(increment * idx)
  }
  return angles;
}

