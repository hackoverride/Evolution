class Node {
  constructor(position, radius, velocity, name, color, id) {
    this.position = position;
    this.radius = radius;
    this.velocity = velocity;
    this.name = name;
    this.color = color;
    this.id = id;
  }

  compare(otherNode) {
    return this.id === otherNode.id;
  }
  move() {
    this.position.x = this.position.x + this.velocity.x;
    this.position.y = this.position.y + this.velocity.y;
  }
  isClose(otherNode) {
    var a = this.position.x - otherNode.position.x;
    var b = this.position.y - otherNode.position.y;

    return Math.sqrt(a * a + b * b);
  }

  toString() {
    return this.name;
  }
}
