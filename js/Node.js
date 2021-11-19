class Node {
  constructor(position, radius, speed, name, color, parent1, parent2) {
    this.position = position;
    this.radius = radius;
    this.speed = speed;
    this.angle = Math.ceil(Math.random() * 360); // angle is x and y coordinate x = 1 or y = 1
    this.name = name;
    this.color = color;
    this.id = Math.random();
    // Counting number of foods eaten
    this.foodEaten = 0;
    this.killCount = 0;
    this.children = 0;
    this.random = Math.random();
    this.parent1 = parent1;
    this.parent2 = parent2;
    this.isPregnant = false;
    this.isFemale = Math.random() > 0.5;
    this.pregnantWithNode = null;
  }

  impregnate(node) {
    this.isPregnant = true;
    this.pregnantWithNode = node;
  }

  checkIfRelated(node) {
    if (
      this.parent1?.id === node.id ||
      this.parent2?.id === node.id ||
      node.parent1?.id == this.id ||
      node.parent2?.id === this.id
    ) {
      return true;
    }
    return false;
  }

  compare(otherNode) {
    return this.id === otherNode.id;
  }
  move() {
    // Need to also add a random direction.
    let newPos = this.newPosition();
    // the movement is based on the velocity but also the direction of x and y velocity.
    this.position.x = newPos.x;
    this.position.y = newPos.y;
  }
  isClose(otherNode) {
    var a = this.position.x - otherNode.position.x;
    var b = this.position.y - otherNode.position.y;

    return Math.sqrt(a * a + b * b);
  }

  toString() {
    return this.name;
  }

  newPosition() {
    const x = this.position.x;
    const y = this.position.y;
    let newX = x + this.speed * Math.cos(this.angle);
    let newY = y + this.speed * Math.sin(this.angle);

    return { x: newX, y: newY };
  }
}
