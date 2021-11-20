/* Collection of global functions and variables */

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

// the canvas should be 100% filled to window
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const NUMBER_OF_NODES = 200;
const NODE_CEIL = 400; // if nodes.length > NODE_CEIL then mortality rates go up.
const NUMBER_OF_FOOD = NUMBER_OF_NODES / 3;
const MAX_DISTANCE = 70; // distance the edge rendering activates
const MAX_SIZE = 30;
const MIN_SPEED = 0.02;
const MAX_SPEED = 0.55;
const LIFE_EXPECTANCY = 90; // normal lifespan
const MORTALITY = 0.000001;
const TAXES = 0.3;
const LIFE_COST = 4;

let AVERAGE_HOUSE_PRICES = 10000;
let numberOfChildren = 0;
let numberOfKills = 0;
let numberOfNaturalDeaths = 0;

let oldestNode = null;
let mostChildren = null;
let richest = null;

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
