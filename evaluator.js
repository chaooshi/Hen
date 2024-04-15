import { parse } from "./parser.js";

function evaluate(obj) {
  if (!Object.hasOwn(obj, "relative")) {
    return obj.creature.toLowerCase();
  }
  if (obj.relative == "inner") {
    return obj.creature.toLowerCase();
  } else if (obj.relative == "outer") {
    return evaluate(obj.clause);
  }
}

function whatComesFirst(program) {
  const syntax_tree = parse(program);
  return evaluate(syntax_tree);
}

// Example usages:
const example0 = "an Egg";
const example1 = "a hen has an egg";
const example2 = "an egg is in a hen";
const example3 = "a hen that is in an egg which is in an egg";
const example4 =
  "a hen that is in an egg which is in an egg that is in a hen which is in an Egg";

console.log(whatComesFirst(example0)); // egg
console.log(whatComesFirst(example1)); // hen
console.log(whatComesFirst(example2)); // hen
console.log(whatComesFirst(example3)); // egg
console.log(whatComesFirst(example4)); // egg
