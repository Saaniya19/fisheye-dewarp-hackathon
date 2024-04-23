export async function fileContents(path) {
  return await fetch(path).then((res) => res.text());
}

function rect(x, y, width, height) {
  const xyzw = (x, y) => [x, y];

  const topLeft = xyzw(x, y);
  const topRight = xyzw(x+width, y);
  const bottomLeft = xyzw(x, y+height);
  const bottomRight = xyzw(x+width, y+height);

  return [
    ...topLeft,
    ...topRight,
    ...bottomLeft,
    ...bottomLeft,
    ...topRight,
    ...bottomRight
  ]
}

/*
 * Working within the coordinate space [-1, 1]
 */
export function uniformGrid(n) {
  let delta = 2 / n;  // same for x and y

  let positions = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
    positions.push(...rect(
        i*delta-1,
        j*delta-1,
        delta,
        delta
      ))
    }
  }

  return positions;
}
