const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

// the canvas should be 100% filled to window
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const DELTA = 50;
const NUMBER_OF_NODES = 300;
const NUMBER_OF_FOOD = NUMBER_OF_NODES / 3;
const MAX_DISTANCE = 150;
const MAX_SIZE = 20;
const MAX_SPEED = 15;
const LIFE_EXPECTANCY = 10; // normal lifespan
let numberOfChildren = 0;
let numberOfKills = 0;
canvas.width = WIDTH;
canvas.height = HEIGHT;

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function showScoreBoard() {
  let totalNodes = 0;
  for (let n of nodes) {
    totalNodes++;
  }
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText(
    "Kills:" +
      numberOfKills +
      " Children:" +
      numberOfChildren +
      " Nodes:" +
      totalNodes,
    10,
    50
  );
}

let nodes = [];
// Setup the nodes
for (let i = 0; i < NUMBER_OF_NODES; i++) {
  // position, radius, velocity, name, id
  let randomX = Math.ceil(Math.random() * (WIDTH / 2) + WIDTH / 4);
  let randomY = Math.ceil(Math.random() * (HEIGHT / 2) + HEIGHT / 4);
  let red = Math.floor(Math.random() * 255);
  let green = Math.floor(Math.random() * 255);
  let blue = Math.floor(Math.random() * 255);
  let name = "";
  if (names?.length > 0) {
    let position = Math.random() * names.length;
    position = Math.ceil(position);
    name = names[position];
  }
  let alpha = Math.random();
  if (alpha < 0.4) {
    alpha = 1;
  }
  //position, radius, speed, name, color, parent1, parent2
  nodes.push(
    new Node(
      { x: randomX, y: randomY },
      1,
      Math.random() * 2,
      name,
      `rgba(${red}, ${green}, ${blue}, ${alpha})`,
      null,
      null
    )
  );
}

function createNewNode(parent1, parent2) {
  let name = "";
  if (names?.length > 0) {
    let position = Math.random() * names.length;
    position = Math.ceil(position);
    name = names[position];
  }

  let newSpeed = parent2.speed;
  /* random chance to take the velocity of parent 1 or 2 */
  if (parent1.speed > parent2.speed) {
    // If the parent2 is quicker than the parent1 then there is a 70% chance to inherit the quicker speed.
    newSpeed = parent1.speed + 1;
    if (newSpeed > MAX_SPEED) {
      newSpeed = MAX_SPEED;
    }
  }

  let newAngle = parent2.angle + 50;
  if (newAngle > 360 || newAngle < 0) {
    newAngle = 180;
  }
  let newPosition = {
    x: Math.ceil(Math.random() * WIDTH),
    y: Math.ceil(Math.random() * HEIGHT),
  };
  let newSize = parent1.radius;
  if (parent2.radius > parent1.radius && Math.random() > 0.8) {
    newSize = parent2.radius;
  }
  nodes.push(
    new Node(
      newPosition,
      newSize,
      newSpeed,
      name,
      parent1.color,
      parent1,
      parent2,
      newAngle
    )
  );
  parent1.children++;
  parent2.children++;
  numberOfChildren++;
  console.log(name + " was born");
}

let foods = [];
// Setup food
for (let i = 0; i < NUMBER_OF_FOOD; i++) {
  let randomX = Math.ceil(Math.random() * WIDTH);
  let randomY = Math.ceil(Math.random() * HEIGHT);
  foods.push(new Food({ x: randomX, y: randomY }, 2));
}

function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  showScoreBoard();
}

function fillFood() {
  for (let i = 0; i < NUMBER_OF_FOOD; i++) {
    let randomX = Math.ceil(Math.random() * WIDTH);
    let randomY = Math.ceil(Math.random() * HEIGHT);
    foods.push(new Food({ x: randomX, y: randomY }, 1));
  }
}

function animate() {
  setTimeout(animate, DELTA);
  clearCanvas();
  for (let node of nodes) {
    handleEdges(node);
    node.move();
    interactWithAnotherNode(node);
    checkFood(node);
    drawCircle(node.position.x, node.position.y, node.radius, node.color);
    if (node.isPregnant) {
      drawCircle(node.position.x, node.position.y, 1, "rgba(255, 255, 255, 1)");
      if (Math.random() < 0.003) {
        createNewNode(node, node.pregnantWithNode);
        node.isPregnant = false;
        node.pregnantWithNode = null;
      }
    }
  }
  if (Math.random() > 0.998) {
    fillFood();
  }
  for (let food of foods) {
    drawCircle(food.position.x, food.position.y, 2, "#F00");
  }
}

function handleEdges(node) {
  // input of node to check if the position is hitting an edge or not.
  if (node.position.x <= node.radius) {
    //node.velocity.x = -node.velocity.x;
    if (node.angle > 360 - 15) {
      node.angle = 5;
    } else {
      node.angle += 5;
    }
  }
  if (node.position.y <= node.radius) {
    //node.velocity.y = -node.velocity.y;
    if (node.angle > 360 - 15) {
      node.angle = 5;
    } else {
      node.angle += 5;
    }
  }
  if (node.position.x >= WIDTH - node.radius) {
    //node.velocity.x = -node.velocity.x;
    if (node.angle > 360 - 15) {
      node.angle = 5;
    } else {
      node.angle += 5;
    }
  }
  if (node.position.y >= HEIGHT - node.radius) {
    //node.velocity.y = -node.velocity.y;
    if (node.angle > 360 - 15) {
      node.angle = 5;
    } else {
      node.angle += 5;
    }
  }
  if (node.position.x < -100 || node.position.x > WIDTH + 100) {
    node.position.x = WIDTH / 2;
  }
  if (node.position.y < -100 || node.position.y > HEIGHT + 100) {
    node.position.y = HEIGHT / 2;
  }
}

function interactWithAnotherNode(currentNode) {
  let newNodeArray = [];
  for (let node of nodes) {
    let nodeKilled = false;
    // Check if the node is the currentNode
    if (!node.compare(currentNode)) {
      // find if the radius and positions of the circles hit.
      // that means if the position.x and position.y of the node is too close to the currentNode
      let close = false;
      let score = areTheyTouching(
        node.position.x,
        currentNode.position.x,
        node.position.y,
        currentNode.position.y,
        node.radius,
        currentNode.radius
      );
      if (score !== -1) {
        // the nodes are not close... so stop the interaction.
        close = true;
      }
      let distance = currentNode.isClose(node);
      if (distance < MAX_DISTANCE && node.isPregnant) {
        drawEdges(currentNode, node, 255, 255, 255, false);
      }
      /* Close and low change to be killed by the larger node */
      // Higher probability if the node has killed before
      let related = currentNode.checkIfRelated(node);

      if (currentNode.killCount === 0 && node.killCount > 3) {
        // get away from that node!
        if (currentNode.angle < 90) {
          currentNode.angle += 10;
        } else {
          currentNode.angle -= 10;
        }
      }
      let killProbability = 0.00005;

      if (currentNode.killCount > 0) {
        killProbability = 0.001;
      } else if (currentNode.killCount > 5) {
        // Serial killer!
        killProbability = 0.01;
      }
      if (close && Math.random() < killProbability && !related) {
        currentNode.killCount++;
        numberOfKills++;
        console.log(
          currentNode.name +
            " killed " +
            node.name +
            " :" +
            currentNode.killCount
        );
        nodeKilled = true;
      }
      /* Close and low change to have a childNode */
      // Create new child

      let likelyToGetPregnant = 0.003;

      if (currentNode.children > 1) {
        likelyToGetPregnant = 0.005;
      }

      if (
        close &&
        currentNode.isFemale &&
        !node.isFemale &&
        !currentNode.isPregnant &&
        Math.random() < likelyToGetPregnant &&
        !related
      ) {
        if (!currentNode.checkIfRelated(node) && currentNode.foodEaten > 1) {
          currentNode.impregnate(node);
        }
      }
      // unrelated
      //node.children++;
      //currentNode.children++;
      //createNewNode(currentNode, node);
      if (!nodeKilled) {
        newNodeArray.push(node);
      }
    } else {
      let probabilityOfDeath = 0.000001;
      if (currentNode.foodEaten > LIFE_EXPECTANCY) {
        probabilityOfDeath += 0.01;
      }
      if (currentNode.children > 3) {
        probabilityOfDeath += 0.0001;
      }
      if (Math.random() < probabilityOfDeath) {
        console.log(node.name + " died");
      } else {
        newNodeArray.push(node);
      }
    }
  }
  nodes = newNodeArray;
}

function checkFood(currentNode) {
  let newFoodArray = [];
  for (let f of foods) {
    let score = areTheyTouching(
      currentNode.position.x,
      f.position.x,
      currentNode.position.y,
      f.position.y,
      currentNode.radius,
      f.value
    );
    if (score !== -1) {
      let newRadius = currentNode.radius;
      newRadius += 1;
      if (currentNode.radius + newRadius <= MAX_SIZE) {
        currentNode.radius = newRadius;
        currentNode.foodEaten++;
      }
    } else {
      newFoodArray.push(f);
    }
  }
  foods = newFoodArray;
}

animate();

function areTheyTouching(x1, x2, y1, y2, r1, r2) {
  let distSq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  let radSumSq = (r1 + r2) * (r1 + r2);
  if (distSq == radSumSq) return 1;
  else if (distSq > radSumSq) return -1;
  else return 0;
}

function drawEdges(currentNode, node, r, g, b, overrideAlpha) {
  let closeNess = currentNode.isClose(node);
  {
    let tempPercent = closeNess / MAX_DISTANCE;
    tempPercent = 1 - tempPercent;
    if (overrideAlpha) {
      tempPercent = 1;
    }
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${tempPercent})`;
    ctx.moveTo(node.position.x, node.position.y);
    ctx.lineTo(currentNode.position.x, currentNode.position.y);
    ctx.stroke();
  }
}
