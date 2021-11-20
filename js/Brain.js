const MAX_BRAIN_VALUE = 100;
class Brain {
  constructor(inherited) {
    // if you inherit another brain, you can develop inheritance.
    /*
     * foodSensor is the perception of food and turning towards the food.
     */
    this.foodSensor = fetchNewRandom(10, MAX_BRAIN_VALUE - 10);
    let inheritedScale = fetchNewRandom(1, 100);
    if (inheritedScale > 70) {
      // increased inheritance
      if (typeof inherited?.foodSensor !== "undefined") {
        this.foodSensor = inherited?.foodSensor;
      }
    } else {
      if (typeof inherited?.foodSensor !== "undefined") {
        this.foodSensor = inherited?.foodSensor + 1;
      }
    }
  }

  findClosest(pos1, pos2) {
    let diffX = pos1.x - pos2.x;
    let diffY = pos1.y - pos2.y;
    return diffX * diffX + diffY * diffY;
  }

  angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    return theta;
  }

  angle360(cx, cy, ex, ey) {
    var theta = this.angle(cx, cy, ex, ey); // range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }
}
