/* Collection of global functions and variables */

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

// the canvas should be 100% filled to window
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const NUMBER_OF_NODES = 300;
const NODE_CEIL = 300; // if nodes.length > NODE_CEIL then mortality rates go up.
const NUMBER_OF_FOOD = NUMBER_OF_NODES / 3;
const MAX_DISTANCE = 150;
const MAX_SIZE = 20;
const MIN_SPEED = 0.02;
const MAX_SPEED = 0.55;
const LIFE_EXPECTANCY = 30; // normal lifespan
const MORTALITY = 0.000001;
const TAXES = 0.03;
const LIFE_COST = 8;
let AVERAGE_HOUSE_PRICES = 100000;
let numberOfChildren = 0;
let numberOfKills = 0;
let numberOfNaturalDeaths = 0;
canvas.width = WIDTH;
canvas.height = HEIGHT;
let oldestNode = null;

const fetchNewRandom = (min, max) => {
  return Math.round(Math.random() * (max - min + 1)) + min;
};

const foodColor = "rgba(255, 0, 255, 0.6)";

function areTheyTouching(x1, x2, y1, y2, r1, r2) {
  let distSq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  let radSumSq = (r1 + r2) * (r1 + r2);
  if (distSq == radSumSq) return 1;
  else if (distSq > radSumSq) return -1;
  else return 0;
}
