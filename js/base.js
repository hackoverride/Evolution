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
    if (
      n.foodEaten > oldestNode?.foodEaten ||
      typeof oldestNode?.id === "undefined"
    ) {
      oldestNode = n;
    }
    if (n?.cash > richest?.cash || typeof richest?.id === "undefined") {
      richest = n;
    }
    if (
      n?.children > mostChildren?.children ||
      typeof mostChildren?.id === "undefined"
    ) {
      mostChildren = n;
    }
  }
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillText("Children:" + numberOfChildren + " Nodes:" + totalNodes, 10, 50);
  ctx.fillText(
    "Kills:" + numberOfKills + " Natural Deaths:" + numberOfNaturalDeaths,
    10,
    80
  );

  if (typeof oldestNode?.id !== "undefined") {
    ctx.fillStyle = oldestNode.color;
    ctx.fillText(
      "Oldest node: " + oldestNode.name + " age: " + oldestNode.foodEaten,
      10,
      110
    );
  }

  if (typeof richest?.id !== "undefined") {
    ctx.fillStyle = richest.color;
    ctx.fillText(
      "Richest node: " + richest.name + " cash: " + Math.ceil(richest.cash),
      10,
      140
    );
  }

  if (typeof mostChildren?.id !== "undefined") {
    ctx.fillStyle = mostChildren.color;
    ctx.fillText(
      "Node with most children: " +
        mostChildren.name +
        " : " +
        mostChildren.children,
      10,
      170
    );
  }
}

let nodes = [];
// Setup the nodes
for (let i = 0; i < NUMBER_OF_NODES; i++) {
  // position, radius, velocity, name, id
  let randomX = Math.ceil(Math.random() * (WIDTH / 2) + WIDTH / 4);
  let randomY = Math.ceil(Math.random() * (HEIGHT / 2) + HEIGHT / 4);
  let red = fetchNewRandom(50, 200);
  let green = fetchNewRandom(50, 200);
  let blue = fetchNewRandom(50, 200);
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
  let thisSpeed = Math.random() * MAX_SPEED + MIN_SPEED;

  //position, radius, speed, name, color, parent1, parent2
  nodes.push(
    new Node(
      { x: randomX, y: randomY },
      1,
      thisSpeed,
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
  let newSize = 1;
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
  parent1.addChild(nodes[nodes.length - 1]);
  parent2.children++;
  parent2.addChild(nodes[nodes.length - 1]);
  numberOfChildren++;
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

function handleEdges(node) {
  let angleChanged = 3;
  // input of node to check if the position is hitting an edge or not.
  if (node.position.x <= node.radius) {
    //node.velocity.x = -node.velocity.x;
    if (node.angle > 360 - angleChanged) {
      node.angle = angleChanged;
    } else {
      node.angle += angleChanged;
    }
  }
  if (node.position.y <= node.radius) {
    //node.velocity.y = -node.velocity.y;
    if (node.angle > 360 - angleChanged) {
      node.angle = angleChanged;
    } else {
      node.angle += angleChanged;
    }
  }
  if (node.position.x >= WIDTH - node.radius) {
    //node.velocity.x = -node.velocity.x;
    if (node.angle > 360 - angleChanged) {
      node.angle = angleChanged;
    } else {
      node.angle += angleChanged;
    }
  }
  if (node.position.y >= HEIGHT - node.radius) {
    //node.velocity.y = -node.velocity.y;
    if (node.angle > 360 - angleChanged) {
      node.angle = angleChanged;
    } else {
      node.angle += angleChanged;
    }
  }
  if (node.position.x < -1 || node.position.x > WIDTH + 1) {
    node.position.x = WIDTH / 2;
  }
  if (node.position.y < -1 || node.position.y > HEIGHT + 1) {
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

      if (oldestNode?.id === currentNode?.id) {
        drawEdges(currentNode, node, 0, 255, 0, false);
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
        currentNode.cash += node.cash;
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

      let likelyToGetPregnant = 0.0025;

      if (currentNode.children > 1) {
        likelyToGetPregnant += 0.0025;
      }

      if (
        close &&
        currentNode.foodEaten > 1 &&
        currentNode.isFemale &&
        !node.isFemale &&
        !currentNode.isPregnant &&
        Math.random() < likelyToGetPregnant &&
        !related
      ) {
        currentNode.impregnate(node);
      }
      // unrelated
      //node.children++;
      //currentNode.children++;
      //createNewNode(currentNode, node);
      if (!nodeKilled) {
        newNodeArray.push(node);
      }
    } else {
      let probabilityOfDeath = MORTALITY;
      if (nodes?.length > NODE_CEIL) {
        /* more likely to die of the max number of nodes is reached */
        probabilityOfDeath += 0.001;
      }
      // If the currentNode has a job with increased risk
      probabilityOfDeath += currentNode?.job?.increasedRisk ?? 0;
      if (currentNode.foodEaten > LIFE_EXPECTANCY) {
        probabilityOfDeath += 0.0003;
      }
      if (currentNode.children > 3) {
        // More likely to die if the node has more children.
        probabilityOfDeath += 0.0001;
      }
      if (Math.random() < probabilityOfDeath) {
        console.log(node.name + " died, age: " + node.foodEaten);
        if (oldestNode?.id === node.id) {
          oldestNode = null;
        }
        if (mostChildren?.id === node.id) {
          mostChildren = null;
        }
        if (richest?.id === node.id) {
          richest = null;
        }
        if (node.children > 0) {
          node.handleEstate(nodes);
        }
        if (typeof node?.job?.title !== "undefined") {
          console.log("as " + node.job.title);
          // Cash goes to "the government"
        }

        numberOfNaturalDeaths++;
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
      currentNode.foodEaten++;
      if (currentNode.foodEaten === 1) {
        currentNode.getJob();
      }
      currentNode.work();
      let newRadius = currentNode.radius;
      newRadius += 1;
      if (currentNode.radius + newRadius < MAX_SIZE && Math.random() < 0.9) {
        currentNode.radius = newRadius;
      }
    } else {
      newFoodArray.push(f);
    }
  }
  foods = newFoodArray;
}

/* Animation */
requestAnimationFrame(animate);

function animate() {
  clearCanvas();
  life();
  requestAnimationFrame(animate);
}

function life() {
  for (let node of nodes) {
    handleEdges(node);
    node.move(foods); // if brain has higher foodSensor then the node should aim towards the closest food.
    interactWithAnotherNode(node);
    checkFood(node);
    drawCircle(node.position.x, node.position.y, node.radius, node.color);
    if (node.isPregnant) {
      drawCircle(node.position.x, node.position.y, 1, "rgba(255, 255, 255, 1)");
      if (Math.random() < 0.002) {
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
    drawCircle(food.position.x, food.position.y, 4, foodColor);
  }
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
