/**
 * stylelint plugin: sds/compositor-only (R4)
 *
 * Inside @keyframes, only compositor-friendly properties are allowed:
 * transform (+longhands), opacity, filter, backdrop-filter, clip-path,
 * custom properties, animation-timing-function, offset-* and visibility.
 *
 * The 4.0.3 catalogue's pre-existing offenders are FROZEN in
 * compat/compositor-quarantine.json: each quarantined keyframe may keep
 * exactly its listed legacy properties. Anything else — including a new
 * property added to a quarantined keyframe — is an error.
 */
const stylelint = require("stylelint");
const fs = require("fs");
const path = require("path");
const ALLOWED = require("./allowed-props.cjs");

const ruleName = "sds/compositor-only";
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (prop, kf) =>
    `Animating "${prop}" in @keyframes ${kf} triggers layout/paint — only transform/opacity/filter/clip-path (and custom properties) are allowed in new animations (R4). ` +
    `Pre-existing 4.0.3 offenders are frozen in compat/compositor-quarantine.json.`,
});

const quarantinePath = path.join(__dirname, "..", "..", "compat", "compositor-quarantine.json");
const quarantine = fs.existsSync(quarantinePath)
  ? JSON.parse(fs.readFileSync(quarantinePath, "utf8")).keyframes
  : {};

const ruleFunction = (enabled) => (root, result) => {
  if (!enabled) return;
  root.walkAtRules(/^(-webkit-)?keyframes$/, (at) => {
    const kfName = at.params.trim();
    const allowedLegacy = new Set(quarantine[kfName] || []);
    at.walkDecls((decl) => {
      const prop = decl.prop.toLowerCase();
      if (prop.startsWith("--")) return;
      if (ALLOWED.has(prop)) return;
      if (allowedLegacy.has(prop)) return;
      stylelint.utils.report({
        message: messages.rejected(decl.prop, kfName),
        node: decl,
        result,
        ruleName,
      });
    });
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
module.exports = stylelint.createPlugin(ruleName, ruleFunction);
