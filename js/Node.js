class Node {
  constructor(position, radius, velocity, name, id) {
    this.position = position;
    this.radius = radius;
    this.velocity = velocity;
    this.name = name;
    this.id = id;
  }

  compare(otherNode) {
    return this.id === otherNode.id;
  }
  move() {
    this.position.x = this.position.x + this.velocity.x;
    this.position.y = this.position.y + this.velocity.y;
  }

  toString() {
    return this.name;
  }
}
