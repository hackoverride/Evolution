class Node {
  constructor(
    position,
    radius,
    speed,
    name,
    color,
    parent1,
    parent2,
    angle,
    brain
  ) {
    this.position = position;
    this.radius = radius;
    this.speed = speed;
    if (typeof angle === "undefined") {
      this.angle = Math.ceil(Math.random() * 360);
    } else {
      this.angle = angle;
    }
    // If we get an input of brain then we handle the inheritance.
    if (typeof brain === "object") {
      this.brain = new Brain(brain);
    } else {
      this.brain = new Brain();
    }
    // angle is x and y coordinate x = 1 or y = 1
    this.name = name;
    this.color = color;
    this.id = Math.random();
    // Counting number of foods eaten
    this.foodEaten = 0;
    this.killCount = 0;
    this.children = 0;
    this.random = fetchNewRandom(1, 3);
    this.parent1 = parent1;
    this.parent2 = parent2;
    this.childNodes = [];
    this.isPregnant = false;
    this.isFemale = Math.random() > 0.5;
    this.pregnantWithNode = null;
    this.cash = 0;
  }

  addChild(node) {
    let newChildArray = [];
    for (let i = 0; i < this.childNodes.length; i++) {
      //
      newChildArray.push(this.childNodes[i]);
    }
    newChildArray.push(node);
    this.childNodes = newChildArray;
  }

  handleEstate(allNodes) {
    // pass out remaining cash to children.
    let numberOfChildrenAlive = [];

    for (let n of allNodes) {
      for (let c of this.childNodes) {
        if (c.id === n.id) {
          numberOfChildrenAlive.push(c);
        }
      }
    }
    let splitNumber = numberOfChildrenAlive?.length || 1;
    let sum = this.cash / splitNumber; // Taxes comes several times!'
    for (let c of numberOfChildrenAlive) {
      c.inherit(sum, this.id);
    }
  }

  inherit(cash, id) {
    if (this.parent1?.id === id) {
      this.parent1 = null;
    } else if (this.parent2?.id === id) {
      this.parent2 = null;
    }
    console.log(this.name + " inherited " + Math.floor(cash / TAXES));
    this.cash += Math.floor(cash / TAXES);
  }

  impregnate(node) {
    this.isPregnant = true;
    this.pregnantWithNode = node;
  }

  getJob() {
    let position = fetchNewRandom(0, professions.length);
    this.job = professions[position];
  }

  work() {
    if (typeof this?.job?.title !== "undefined") {
      let totalCash = this.cash;
      totalCash += this.job.pay / TAXES;
      totalCash -= LIFE_COST;
      if (Math.random() < 0.2) {
        // Sometimes you just have a bad day
        totalCash -= totalCash / 3;
      }
      if (totalCash > AVERAGE_HOUSE_PRICES) {
        if (typeof this?.ownsAHome === "undefined") {
          this.ownsAHome = true;
        }
        totalCash -= AVERAGE_HOUSE_PRICES;
      }
      this.cash += this.job.pay / TAXES;
    }
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
  move(foods) {
    // Need to also add a random direction.
    let closestFood = null;
    let distance = 10000;
    if (this.brain.foodSensor > 70) {
      // should target closest food.
      for (let f of foods) {
        if (this.brain.findClosest(this.position, f.position) < distance) {
          closestFood = f;
        }
      }
    }
    this.closestFood = closestFood ?? null;
    if (typeof this.closestFood?.position?.y !== "undefined") {
      let newAngle = this.brain.angle360(
        this.position.x,
        this.position.y,
        closestFood?.position?.x,
        closestFood?.position?.y
      );
      this.angle = newAngle;
    } else {
      if (Math.random() > 0.99) {
        if (Math.random() > 0.5) {
          this.angle -= this.random / 10;
        } else {
          this.angle += this.random / 10;
        }
      }
    }

    // adjust angle if closestFood position is found.

    /*
    
    */

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
