export function parse(program) {
  program = skipSpaceOrComment(program);
  let match;
  if ((match = /^(a|an) /i.exec(program))) {
    program = program.slice(match[0].length);
    program = skipSpaceOrComment(program);
    if ((match = /^(hen|egg)/i.exec(program))) {
      let creature = { creature: match[0] };
      program = program.slice(match[0].length);
      return parseRelativeClause(creature, skipSpaceOrComment(program));
    } else {
      throw new SyntaxError("Expected 'hen' or 'egg' after 'a' or 'an'");
    }
  } else {
    throw new SyntaxError(
      "Expected 'a' or 'an' at the beginning of the phrase"
    );
  }
}

function parseRelativeClause(creature, program) {
  if (!program.length) return creature;

  let match;
  if ((match = /^(which|that|has|is in) /i.exec(program))) {
    let relativeKeyword = match[1];
    program = program.slice(match[0].length);
    if (relativeKeyword === "has") {
      const innerCreature = parse(skipSpaceOrComment(program));
      return {
        creature: creature.creature,
        relative: "inner",
        clause: innerCreature,
      };
    } else if (relativeKeyword === "is in") {
      const outerCreature = parse(skipSpaceOrComment(program));
      return {
        creature: creature.creature,
        relative: "outer",
        clause: outerCreature,
      };
    } else {
      // Skip "which" or "that" and parse the next keyword
      return parseRelativeClause(creature, skipSpaceOrComment(program));
    }
  } else {
    throw new SyntaxError(
      "Expected a relational keyword (which, that, has, is in)"
    );
  }
}

function skipSpaceOrComment(string) {
  let skippable = /^(\s|-(.*?)-)*/.exec(string);
  return string.slice(skippable[0].length);
}

// Example usages:
const example0 = "an Egg";
const example1 = "a hen has an egg";
const example2 = "an egg is in a hen";
const example3 = "a hen that is in an egg which is in an egg";

/*

console.log(parse(example0)); // {creature: "Egg" }
console.log(parse(example1)); // {creature: "hen", relative: "inner", clause: {creature: "egg"}}
console.log(parse(example2)); // {creature: "egg", relative: "outer", clause: {creature: "hen"}}
console.log(parse(example3)); // Nested structure

*/
