const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

// the canvas should be 100% filled to window
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const DELTA = 50;
const NUMBEROFNODES = 300;
const NUMBEROFFOOD = NUMBEROFNODES / 4;
const MAX_DISTANCE = 30;
const LIFE_EXPECTANCY = 100; // normal lifespan
canvas.width = WIDTH;
canvas.height = HEIGHT;

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

let nodes = [];
// Setup the nodes
for (let i = 0; i < NUMBEROFNODES; i++) {
  // position, radius, velocity, name, id
  let randomX = Math.ceil(Math.random() * WIDTH);
  let randomY = Math.ceil(Math.random() * HEIGHT);
  let red = Math.floor(Math.random() * 255);
  let green = Math.floor(Math.random() * 255);
  let blue = Math.floor(Math.random() * 255);
  let name = "";
  if (names?.length > 0) {
    let position = Math.random() * names.length;
    position = Math.ceil(position);
    name = names[position];
  }
  nodes.push(
    new Node(
      { x: randomX, y: randomY },
      1,
      Math.random() * 2,
      name,
      `rgb(${red}, ${green}, ${blue})`,
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

  let newSpeed = parent1.speed;
  /* random chance to take the velocity of parent 1 or 2 */
  if (parent1.speed < parent2.speed) {
    // If the parent2 is quicker than the parent1 then there is a 70% chance to inherit the quicker speed.
    if (Math.random() > 0.5) {
      newSpeed.x = parent2.speed;
    }
  }

  nodes.push(
    new Node(
      parent1.position,
      4,
      newSpeed,
      name,
      parent1.color,
      parent1,
      parent2
    )
  );
}

let foods = [];
// Setup food
for (let i = 0; i < NUMBEROFFOOD; i++) {
  let randomX = Math.ceil(Math.random() * WIDTH);
  let randomY = Math.ceil(Math.random() * HEIGHT);
  foods.push(new Food({ x: randomX, y: randomY }, 2));
}

function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function fillFood() {
  for (let i = 0; i < NUMBEROFFOOD; i++) {
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
    //drawEdges(node);
    if (node.isPregnant) {
      drawCircle(
        node.position.x,
        node.position.y,
        1,
        "rgba(255, 255, 255, 0.8)"
      );
    }
    drawCircle(node.position.x, node.position.y, node.radius, node.color);
  }
  if (Math.random() > 0.996) {
    fillFood();
  }
  for (let food of foods) {
    drawCircle(food.position.x, food.position.y, 2, "#F00");
  }
}

function handleEdges(node) {
  // input of node to check if the position is hitting an edge or not.
  if (node.position.x <= node.radius + 10) {
    //node.velocity.x = -node.velocity.x;
    if (node.angle > 360 - 15) {
      node.angle = 15;
    } else {
      node.angle += 15;
    }
  }
  if (node.position.y <= node.radius + 10) {
    //node.velocity.y = -node.velocity.y;
    if (node.angle > 360 - 15) {
      node.angle = 15;
    } else {
      node.angle += 15;
    }
  }
  if (node.position.x >= WIDTH - node.radius + 10) {
    //node.velocity.x = -node.velocity.x;
    if (node.angle > 360 - 15) {
      node.angle = 15;
    } else {
      node.angle += 15;
    }
  }
  if (node.position.y >= HEIGHT - node.radius + 10) {
    //node.velocity.y = -node.velocity.y;
    if (node.angle > 360 - 15) {
      node.angle = 15;
    } else {
      node.angle += 15;
    }
  }
}

function interactWithAnotherNode(currentNode) {
  let newNodeArray = [];
  for (let node of nodes) {
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
        close = true;
      }
      /* Close and low change to be killed by the larger node */
      // Higher probability if the node has killed before
      let killProbability = 0.001;

      if (currentNode.killCount > 0) {
        killProbability = 0.002;
      } else if (currentNode.killCount > 10) {
        killProbability = 0.1;
      }
      if (
        close &&
        currentNode.radius > node.radius &&
        Math.random() < killProbability
      ) {
        //currentNode.radius += 1;
        currentNode.killCount++;
        console.log(
          currentNode.name +
            " killed " +
            node.name +
            " :" +
            currentNode.killCount
        );
      } else {
        newNodeArray.push(node);
      }
      /* Close and low change to have a childNode */
      // Create new child

      let likelyToGetPregnant = 0.002;
      if (currentNode.checkIfRelated(node)) {
        console.log(node.name + " is related to " + currentNode.name);
      } else {
        if (
          currentNode.isFemale &&
          !currentNode.isPregnant &&
          Math.random() <= likelyToGetPregnant
        ) {
          currentNode.impregnate(node);
        }
        // unrelated
        //node.children++;
        //currentNode.children++;
        //createNewNode(currentNode, node);
      }
    } else {
      newNodeArray.push(node);
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
      currentNode.radius = newRadius;
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

function drawEdges(currentNode) {
  let drawnToNodes = [];
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id !== currentNode.id) {
      let closeNess = currentNode.isClose(nodes[i]);
      {
        let tempPercent = closeNess / MAX_DISTANCE;
        tempPercent = 1 - tempPercent;
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${tempPercent})`;
        ctx.moveTo(nodes[i].position.x, nodes[i].position.y);
        ctx.lineTo(currentNode.position.x, currentNode.position.y);
        ctx.stroke();
        //boundEdge.push(node[i].id);
      }
    }
  }
}
