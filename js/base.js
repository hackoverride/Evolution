const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

// the canvas should be 100% filled to window
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
canvas.width = WIDTH;
canvas.height = HEIGHT;

function drawCircle(x, y, r) {
  ctx.fillStyle = "#333344ff";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

let nodes = [];
// Setup the nodes
for (let i = 0; i < 500; i++) {
  // position, radius, velocity, name, id
  let randomX = Math.ceil(Math.random() * WIDTH);
  let randomY = Math.ceil(Math.random() * HEIGHT);
  nodes.push(
    new Node(
      { x: randomX, y: randomY },
      4,
      { x: Math.ceil(Math.random() * 2), y: Math.ceil(Math.random() * 2) },
      "test",
      Math.random()
    )
  );
}

for (let node of nodes) {
  console.log(node.toString());
}

function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function render() {
  clearCanvas();
}

function animate() {
  setTimeout(animate, 20);
  render();
  for (let node of nodes) {
    handleEdges(node);
    node.move();
    eatAnotherNode(node);
    drawCircle(node.position.x, node.position.y, node.radius);
  }
}

function handleEdges(node) {
  // input of node to check if the position is hitting an edge or not.
  if (node.position.x <= node.radius) {
    node.velocity.x = -node.velocity.x;
  }
  if (node.position.y <= node.radius) {
    node.velocity.y = -node.velocity.y;
  }
  if (node.position.x >= WIDTH - node.radius) {
    node.velocity.x = -node.velocity.x;
  }
  if (node.position.y >= HEIGHT - node.radius) {
    node.velocity.y = -node.velocity.y;
  }
}

function eatAnotherNode(currentNode) {
  let newNodeArray = [];
  for (let node of nodes) {
    if (node.compare(currentNode)) {
      // the node compared is the same node
      newNodeArray.push(node);
    } else {
      // find if the radius and positions of the circles hit.
      // that means if the position.x and position.y of the node is too close to the currentNode
      let eaten = false;
      let score = areTheyTouching(
        node.position.x,
        currentNode.position.x,
        node.position.y,
        currentNode.position.y,
        node.radius,
        currentNode.radius
      );
      if (score !== -1) {
        eaten = true;
      }
      if (eaten && currentNode.radius >= node.radius && Math.random() < 0.001) {
        currentNode.radius += node.radius / 2;
      } else {
        newNodeArray.push(node);
      }
    }
  }
  nodes = newNodeArray;
}

animate();

function areTheyTouching(x1, x2, y1, y2, r1, r2) {
  let distSq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  let radSumSq = (r1 + r2) * (r1 + r2);
  if (distSq == radSumSq) return 1;
  else if (distSq > radSumSq) return -1;
  else return 0;
}
