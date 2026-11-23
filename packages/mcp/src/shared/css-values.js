// @ts-check
/**
 * Small, dependency-free parsers for the CSS values that describe motion.
 * Plain JavaScript on purpose: the catalog build script (Node, no TypeScript step)
 * and the server (bundled TypeScript) both import this one file, so a Figma
 * keyframe and a library keyframe are read by exactly the same code.
 *
 * Everything here is deterministic and pure.
 */

/** @typedef {{ type: 'cubic-bezier', p: [number, number, number, number] }} CubicBezier */
/** @typedef {{ type: 'steps', n: number, pos: string }} Steps */
/** @typedef {{ type: 'linear' }} Linear */
/** @typedef {CubicBezier | Steps | Linear} Easing */

export const NAMED_EASINGS = /** @type {Record<string, [number, number, number, number]>} */ ({
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
});

/**
 * Split on a separator that sits outside any parentheses.
 * @param {string} str
 * @param {string} sep one character
 * @returns {string[]}
 */
export function splitTop(str, sep) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === sep && depth === 0) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim() !== '') out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

/** Split on whitespace outside parentheses. */
export function splitSpaces(str) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of str.trim()) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (/\s/.test(ch) && depth === 0) {
      if (cur) out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/**
 * Replace var(--x, fallback) using a map of custom properties. Unknown variables fall back to
 * their fallback, or stay as they are when there is none.
 * @param {string} str
 * @param {Record<string,string>} vars
 * @param {number} [depth]
 * @returns {string}
 */
export function resolveVars(str, vars, depth = 0) {
  if (depth > 8 || !str || !str.includes('var(')) return str;
  let out = '';
  let i = 0;
  while (i < str.length) {
    const at = str.indexOf('var(', i);
    if (at === -1) {
      out += str.slice(i);
      break;
    }
    out += str.slice(i, at);
    let depthP = 1;
    let j = at + 4;
    while (j < str.length && depthP > 0) {
      if (str[j] === '(') depthP++;
      if (str[j] === ')') depthP--;
      j++;
    }
    const inner = str.slice(at + 4, j - 1);
    const comma = inner.indexOf(',');
    const name = (comma === -1 ? inner : inner.slice(0, comma)).trim();
    const fallback = comma === -1 ? null : inner.slice(comma + 1).trim();
    if (vars[name] !== undefined) out += resolveVars(vars[name], vars, depth + 1);
    else if (fallback !== null) out += resolveVars(fallback, vars, depth + 1);
    else out += str.slice(at, j);
    i = j;
  }
  return out;
}

/**
 * "0.8s", "800ms", "-0.2s" -> milliseconds, or null when it is not a time.
 * @param {string} s
 * @returns {number | null}
 */
export function parseTimeMs(s) {
  const m = /^(-?\d*\.?\d+)(ms|s)$/.exec(String(s).trim());
  if (!m) return null;
  return Math.round(parseFloat(m[1]) * (m[2] === 's' ? 1000 : 1) * 1000) / 1000;
}

/**
 * Parse a CSS timing function.
 * @param {string} s
 * @returns {Easing | null}
 */
export function parseEasing(s) {
  const t = String(s).trim().toLowerCase();
  if (t in NAMED_EASINGS) {
    const p = NAMED_EASINGS[t];
    return t === 'linear' ? { type: 'linear' } : { type: 'cubic-bezier', p };
  }
  let m = /^cubic-bezier\(\s*([^)]+)\)$/.exec(t);
  if (m) {
    const nums = m[1].split(',').map((x) => parseFloat(x));
    if (nums.length === 4 && nums.every((n) => Number.isFinite(n))) {
      return { type: 'cubic-bezier', p: /** @type {[number,number,number,number]} */ (nums) };
    }
    return null;
  }
  m = /^steps\(\s*(\d+)\s*(?:,\s*([a-z-]+))?\s*\)$/.exec(t);
  if (m) return { type: 'steps', n: parseInt(m[1], 10), pos: m[2] || 'end' };
  if (t === 'step-start') return { type: 'steps', n: 1, pos: 'start' };
  if (t === 'step-end') return { type: 'steps', n: 1, pos: 'end' };
  return null;
}

/** @param {string} s */
export function looksLikeEasing(s) {
  const t = s.trim().toLowerCase();
  return t in NAMED_EASINGS || /^(cubic-bezier|steps)\(/.test(t) || t === 'step-start' || t === 'step-end';
}

/**
 * @typedef {{ v: number, u: string }} Num
 * @typedef {{ fn: string, args: Num[] }} TransformFn
 */

/** "-24px" -> {v:-24,u:'px'} ; "0.5" -> {v:0.5,u:''} */
export function parseNum(s) {
  const m = /^(-?\d*\.?\d+)([a-z%]*)$/i.exec(String(s).trim());
  if (!m) return null;
  return { v: parseFloat(m[1]), u: m[2].toLowerCase() };
}

/**
 * @param {string} s a transform value such as "translateY(-24px) scale(0.9)"
 * @returns {TransformFn[]}
 */
export function parseTransform(s) {
  const out = [];
  const re = /([a-zA-Z0-9]+)\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(s))) {
    const args = m[2]
      .split(',')
      .map((a) => parseNum(a.trim()))
      .filter((x) => x !== null);
    out.push({ fn: m[1], args: /** @type {Num[]} */ (args) });
  }
  return out;
}

/** length -> nominal pixels. % is read 1:1 (a nominal 100px element); vw/vh are rough. */
function toPx(n) {
  if (!n) return 0;
  switch (n.u) {
    case '':
    case 'px':
      return n.v;
    case '%':
      return n.v;
    case 'rem':
    case 'em':
      return n.v * 16;
    case 'vw':
    case 'vh':
    case 'vmin':
    case 'vmax':
      return n.v * 10;
    default:
      return n.v;
  }
}

function toDeg(n) {
  if (!n) return 0;
  switch (n.u) {
    case 'rad':
      return (n.v * 180) / Math.PI;
    case 'turn':
      return n.v * 360;
    case 'grad':
      return n.v * 0.9;
    default:
      return n.v;
  }
}

/**
 * The channels the matcher understands. A missing channel means "identity" (no change).
 * @typedef {{
 *   opacity?: number, tx?: number, ty?: number, tz?: number,
 *   sx?: number, sy?: number, rot?: number, rotx?: number, roty?: number,
 *   skx?: number, sky?: number, blur?: number
 * }} Channels
 */

/** Identity value of each channel, used when a keyframe leaves it out. */
export const IDENTITY = /** @type {Required<Channels>} */ ({
  opacity: 1, tx: 0, ty: 0, tz: 0, sx: 1, sy: 1, rot: 0, rotx: 0, roty: 0, skx: 0, sky: 0, blur: 0,
});

/**
 * Turn one keyframe's declarations into channels plus the names of other CSS properties it touches.
 * @param {Record<string,string>} decls property -> value
 * @returns {{ ch: Channels, other: string[] }}
 */
export function channelsFromDecls(decls) {
  /** @type {Channels} */
  const ch = {};
  const other = new Set();
  for (const [prop, rawValue] of Object.entries(decls)) {
    const value = rawValue.replace(/\s*!important\s*$/i, '').trim();
    if (prop === 'opacity') {
      const n = parseNum(value);
      if (n) ch.opacity = n.v;
    } else if (prop === 'transform') {
      for (const f of parseTransform(value)) applyTransformFn(ch, f);
    } else if (prop === 'translate') {
      const parts = splitSpaces(value).map(parseNum);
      if (parts[0]) ch.tx = toPx(parts[0]);
      if (parts[1]) ch.ty = toPx(parts[1]);
      if (parts[2]) ch.tz = toPx(parts[2]);
    } else if (prop === 'scale') {
      const parts = splitSpaces(value).map(parseNum);
      if (parts[0]) {
        ch.sx = parts[0].v;
        ch.sy = parts[1] ? parts[1].v : parts[0].v;
      }
    } else if (prop === 'rotate') {
      const n = parseNum(splitSpaces(value).slice(-1)[0] || '');
      if (n) ch.rot = toDeg(n);
    } else if (prop === 'filter' || prop === 'backdrop-filter') {
      let any = false;
      for (const f of parseTransform(value)) {
        if (f.fn === 'blur' && f.args[0]) {
          ch.blur = Math.max(ch.blur || 0, toPx(f.args[0]));
          any = true;
        } else {
          other.add(`filter:${f.fn}`);
        }
      }
      if (!any && !parseTransform(value).length) other.add('filter');
    } else if (prop === 'animation-timing-function' || prop === 'animation-play-state') {
      // per-keyframe timing; not a visual property
    } else {
      other.add(prop);
    }
  }
  return { ch, other: [...other] };
}

/** @param {Channels} ch @param {TransformFn} f */
function applyTransformFn(ch, f) {
  const a = f.args;
  switch (f.fn) {
    case 'translate':
    case 'translate3d':
      if (a[0]) ch.tx = toPx(a[0]);
      if (a[1]) ch.ty = toPx(a[1]);
      if (a[2]) ch.tz = toPx(a[2]);
      break;
    case 'translateX': if (a[0]) ch.tx = toPx(a[0]); break;
    case 'translateY': if (a[0]) ch.ty = toPx(a[0]); break;
    case 'translateZ': if (a[0]) ch.tz = toPx(a[0]); break;
    case 'scale':
      if (a[0]) {
        ch.sx = a[0].v;
        ch.sy = a[1] ? a[1].v : a[0].v;
      }
      break;
    case 'scale3d':
      if (a[0]) ch.sx = a[0].v;
      if (a[1]) ch.sy = a[1].v;
      break;
    case 'scaleX': if (a[0]) ch.sx = a[0].v; break;
    case 'scaleY': if (a[0]) ch.sy = a[0].v; break;
    case 'rotate':
    case 'rotateZ': if (a[0]) ch.rot = toDeg(a[0]); break;
    case 'rotateX': if (a[0]) ch.rotx = toDeg(a[0]); break;
    case 'rotateY': if (a[0]) ch.roty = toDeg(a[0]); break;
    case 'rotate3d': {
      // axis (x,y,z) and angle: split the angle across the axes by their share
      if (a.length >= 4) {
        const [x, y, z] = [a[0].v, a[1].v, a[2].v];
        const len = Math.hypot(x, y, z) || 1;
        const deg = toDeg(a[3]);
        ch.rotx = (deg * x) / len;
        ch.roty = (deg * y) / len;
        ch.rot = (deg * z) / len;
      }
      break;
    }
    case 'skew':
      if (a[0]) ch.skx = toDeg(a[0]);
      if (a[1]) ch.sky = toDeg(a[1]);
      break;
    case 'skewX': if (a[0]) ch.skx = toDeg(a[0]); break;
    case 'skewY': if (a[0]) ch.sky = toDeg(a[0]); break;
    default:
      break; // perspective(), matrix(): not mapped
  }
}

/**
 * Group channel names into the families used to compare an effect with a spec.
 * @param {string} channel
 * @returns {string}
 */
export function familyOf(channel) {
  if (channel === 'opacity') return 'opacity';
  if (channel === 'tx' || channel === 'ty' || channel === 'tz') return 'translate';
  if (channel === 'sx' || channel === 'sy') return 'scale';
  if (channel === 'rot' || channel === 'rotx' || channel === 'roty') return 'rotate';
  if (channel === 'skx' || channel === 'sky') return 'skew';
  if (channel === 'blur') return 'blur';
  return channel;
}

/**
 * Family for a non-channel CSS property name.
 * @param {string} prop
 * @returns {string}
 */
export function familyOfCssProp(prop) {
  const p = prop.toLowerCase();
  if (p.startsWith('filter:')) return 'filter';
  if (/^offset-(distance|path|rotate)/.test(p)) return 'translate';
  if (/^(clip-path|mask|-webkit-mask|mask-image|clip)/.test(p)) return 'clip';
  if (/^(color|background-color|border-color|fill|stroke|outline-color|text-decoration-color|caret-color)$/.test(p)) return 'color';
  if (/^(background|background-position|background-size|background-image)$/.test(p)) return 'background';
  if (/shadow/.test(p)) return 'shadow';
  if (/^(width|height|min-|max-|top|left|right|bottom|margin|padding|gap|flex)/.test(p)) return 'layout';
  if (/letter-spacing|word-spacing|line-height/.test(p)) return 'spacing';
  if (/^(stroke-dash|stroke-dashoffset)/.test(p)) return 'stroke';
  if (/^(border|outline)/.test(p)) return 'border';
  if (p === 'filter') return 'filter';
  return 'other';
}

/**
 * Parse a CSS time string that may be "0.8s" or "800ms" or a bare number of milliseconds.
 * @param {unknown} v
 * @returns {number | null}
 */
export function toMs(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') return parseTimeMs(v);
  return null;
}
