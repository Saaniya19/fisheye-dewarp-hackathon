/*

All transformation functions should be of the form:

f(x,y) -> (u,v)
where x,y,u,v are all ∈ [-1, 1]

*/

/*export function identity(x, y) {
    return [x, y];
}


// https://stackoverflow.com/questions/13211595/how-can-i-convert-coordinates-on-a-circle-to-coordinates-on-a-square
export function circle(x, y) {
  const u = x * Math.sqrt(1 - (1/2) * y**2);
  const v = y * Math.sqrt(1 - (1/2) * x**2);

  return [u, v];
} 

export function divideXYBy2(x, y) {
    const u = x / 2;
    const v = y / 2;

    return [u, v];
}

export function varidistant(x, y) {
  function xy_to_angle_radius(x,y) {
    const angle = Math.atan2(y, x)
    const radius = Math.sqrt(x*x+y*y)
    return {angle, radius}
  }

  function xy_for_r_ra(radius, angle, f) {
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return {x, y}
  }
  let pan_x = 0.2;
  let pan_y = -0.4;
  let rotate = -0.2;
  let scale_factor = 6;
  let pow_factor = 10;
  const angle_radius = xy_to_angle_radius(x + pan_x, y + pan_y)
  // Scale the radius. This allows a "zoom". Changes based on the pow_factor.
  let radius = angle_radius.radius / scale_factor;
  // Apply rotation.
  let angle = angle_radius.angle + rotate;
  // Reverse the radius to be distance from edge.
  let distance_from_edge = 1 - radius;
  // Reshape the radius.
  distance_from_edge = Math.pow(distance_from_edge, pow_factor)
  // Back into radius.
  radius = 1 - distance_from_edge
  // Don't allow the radius to grow beyond the edge of the spherical image.
  radius = Math.min(radius, 1)
  const xy = xy_for_r_ra(radius, angle)
  xy.x = Math.min(xy.x, 1)
  xy.x = Math.max(xy.x, -1)
  xy.y = Math.min(xy.y, 1)
  xy.y = Math.max(xy.y, -1)
  return [xy.x, xy.y]
}

export function squircular(x, y){
  const u = x * Math.sqrt((x**2) + (y**2) - ((x**2)*(y**2))) / Math.sqrt((x**2) + (y**2));
  const v = y * Math.sqrt((x**2) + (y**2) - ((x**2)*(y**2))) / Math.sqrt((x**2) + (y**2));
  return [u, v];
}*/

export function panorama(x, y){
  const r = 2 / Math.PI;
  const angle = x/-r
  const u = y * Math.sin(angle);
  const v = y * Math.cos(angle);
   if(y > 0){
      return [u, v]
   }
  return [u, v];
}