#!/usr/bin/env node
/** Regenerates src/generated/effects.ts from the motion registry (R3). */
const fs = require("fs");
const path = require("path");
const { generateEffectsTs } = require("../../../scripts/codegen/effects-data.js");

const out = path.join(__dirname, "..", "src", "generated", "effects.ts");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, generateEffectsTs("@salkomdesignstudio/motion-forge-angular"));
console.log("generated src/generated/effects.ts");
