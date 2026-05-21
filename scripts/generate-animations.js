const fs = require('fs');
const path = require('path');

const rawData = `
# Typography Motion (50)

1. Word Morph — blur + scale transition between words
2. Particle Text Dissolve — letters break into pseudo-particles with text-shadow
3. Typewriter Loop — width reveal using steps()
4. Glitch Split — RGB channel offset animation
5. Elastic Headline — spring scale overshoot
6. Wave Characters — staggered translateY per letter
7. Gradient Flow Text — animated background-position
8. Liquid Fill Text — clipping mask simulation
9. Neon Pulse — animated text-shadow glow
10. Split Reveal — lines reveal independently
11. Magnetic Heading — cursor-follow translate effect
12. Blur-to-Focus — animated blur filter reduction
13. Rotate Flip Text — 3D rotateX swaps
14. Noise Flicker — random opacity flicker
15. Scanline Sweep — overlay gradient moves vertically
16. Ink Spread — expanding pseudo-element mask
17. Ghost Trail Text — duplicated motion blur trails
18. Letter Scatter Hover — chars fly outward on hover
19. Rebuild Typography — letters animate back sequentially
20. Vertical Marquee — infinite translateY loop
21. Infinite Breathing Title — subtle scale oscillation
22. Folding Text — rotateY folding panels
23. SVG Stroke Reveal — stroke-dashoffset animation
24. Chromatic Hover — hue-rotate animation
25. Perspective Push — 3D depth translateZ illusion
26. Underline Grow — scaleX underline transform
27. Cursor Reactive Warp — skew based on pointer position
28. Shimmer Typography — animated gradient sweep
29. Heat Distortion — wobble transform distortion
30. Bounce Character Chain — chained cubic-bezier bounces
31. Flip Word Carousel — vertical word rotation
32. Blur Exit — opacity + blur exit transition
33. Radial Text Explosion — chars expand from center
34. Orbiting Letters — rotate around container center
35. VHS Text Drift — slight horizontal jitter
36. Hover Weight Simulation — scaleX font weight illusion
37. Sliding Reveal Mask — clip-path animation
38. Stretch Compression — squash-and-stretch effect
39. Aurora Typography — animated multicolor gradients
40. Spotlight Hover — radial mask follows cursor
41. Sequential Glow — letters glow one after another
42. Echo Expand — duplicated transparent scaling layers
43. Matrix Rain Typography — falling character streams
44. Glass Reflection Sweep — skewed highlight pass
45. Distorted Hover Mesh — skew transform mesh illusion
46. Particle Reassemble — delayed stagger reformation
47. Floating Glyphs — sinusoidal translate animation
48. Pixelated Reveal — stepped clip-path blocks
49. Dynamic Baseline Shift — alternating translateY letters
50. Cinematic Fade Sequence — staggered opacity timing

# Button States (50)

1. Liquid Hover Fill — pseudo-element expand fill
2. Magnetic Button — follows cursor slightly
3. Elastic Press — scale compression on active
4. Ripple Click — radial scale animation
5. Glow Pulse — animated box-shadow
6. Border Trace — border drawn via gradients
7. Morph Radius — border-radius interpolation
8. Tilt Hover — perspective rotateX/Y
9. Neon Sweep — linear gradient move
10. Depth Push — layered shadow translation
11. Particle Burst Click — pseudo particles explode
12. Gradient Shift — animated background-position
13. Press Shockwave — expanding outer ring
14. Holographic Shine — blend-mode shimmer
15. Slide Arrow Reveal — icon translateX
16. Gooey Expansion — blur-filter merge effect
17. Breathing CTA — idle scale pulse
18. Frost Hover — backdrop blur increase
19. Flip CTA — rotateX content swap
20. Bounce Edge — spring translateY
21. Chromatic Border — animated hue rotation
22. Hover Warp — skew transformation
23. Wave Distortion — oscillating scale/skew
24. Cursor Spotlight — radial gradient follows mouse
25. Floating Button — idle vertical oscillation
26. Expand Icon — icon scales independently
27. Split Fill — left/right fill animations
28. Shimmer Pass — gradient shine sweep
29. Hover Lift — shadow depth increase
30. Ink Spread — pseudo-element radial fill
31. Slide Background — translateX background layer
32. Flash Pulse — rapid opacity burst
33. Dynamic Outline — animated outline-offset
34. Orbit Glow — rotating outer glow
35. Rotating Border Beam — conic-gradient rotate
36. Stretch Hover — width expansion
37. Physics Snap — spring cubic-bezier return
38. Frosted Morph — blur + transparency shift
39. 3D Pushdown — translateZ illusion
40. Hover Bounce Chain — stagger child motion
41. Energy Ring — rotating ring around button
42. Hover Flicker — quick neon instability
43. Corner Expand — animated corner borders
44. Cursor Gravity — button attracted to pointer
45. Sliding Gradient Beam — beam passes diagonally
46. Hover Distortion — displacement via transform skew
47. Hover Compress — squash effect
48. Morphing Icon Swap — opacity + rotate transition
49. Hover Echo — duplicated scaling ring
50. Infinite CTA Attention — subtle idle animation

# Inputs & Focus (50)

1. Floating Label — label translate + scale
2. Glow Focus Ring — animated box-shadow
3. Pulse Border — border-color oscillation
4. Cursor Beam — animated caret effect
5. Underline Expand — scaleX underline
6. Liquid Focus — pseudo background spread
7. Gradient Border Focus — animated gradient outline
8. Frost Input — backdrop blur transitions
9. Validation Shake — translateX error motion
10. Success Pop — scale bounce success state
11. Hover Elevation — subtle translateY
12. Active Depth — inset shadow press effect
13. Input Reveal — clip-path expansion
14. Dynamic Placeholder — placeholder animation
15. Magnetic Cursor Focus — pointer-follow effect
16. Border Beam — rotating conic-gradient border
17. Ripple Focus — radial focus spread
18. Glow Sweep — gradient shine across border
19. Neon Typing — active glow pulse
20. Stretch Focus — slight width expansion
21. Focus Bounce — spring scaling
22. Elastic Outline — animated outline-offset
23. Floating Hint Text — staggered fade hint
24. Scanline Input — overlay moving line
25. Holographic Focus — rainbow reflection effect
26. Error Flash — red flicker animation
27. Focus Warp — skew on focus
28. Animated Caret Trail — trailing opacity cursor
29. Soft Attention Pulse — idle field pulse
30. Slide Label Reveal — translateY label entry
31. Glass Morph Input — opacity blur changes
32. Dynamic Border Radius — radius morphing
33. Hover Shine — moving highlight reflection
34. Noise Flicker Border — unstable glow effect
35. Edge Trace — border drawing animation
36. Floating Icons — icon bobbing motion
37. Input Compression — active squash effect
38. Gradient Fill Background — animated gradient shift
39. Reactive Cursor Halo — pointer-follow radial glow
40. Split Border Reveal — left/right border draw
41. Bounce Placeholder — placeholder translateY
42. Input Lock Animation — lock icon transition
43. Reveal Password Morph — eye icon morph
44. Search Wave Pulse — ripple on typing
45. Multi-layer Focus Shadow — depth stacking
46. Slide Validation Badge — icon enters sideways
47. Hover Blur Transition — blur reduction effect
48. Floating Field Container — ambient motion
49. Breathing Border Glow — opacity oscillation
50. Scroll Reactive Input — transform on viewport

# Cards & Depth (50)

1. Perspective Tilt — rotateX/Y by cursor
2. Glassmorphism Hover — blur + transparency shift
3. Floating Depth — idle translateY
4. Dynamic Shadow Shift — shadow follows cursor
5. Expand Reveal — scale container reveal
6. Hover Zoom Layer — inner image scale
7. Border Beam Rotation — conic-gradient rotation
8. Glow Edge — animated outer glow
9. Magnetic Card — follows cursor slightly
10. Frost Hover Layer — overlay opacity transition
11. Flip Card 3D — rotateY backside reveal
12. Stack Compression — layered translateZ effect
13. Hover Parallax — layered movement
14. Ripple Hover — radial pseudo-element spread
15. Holographic Reflection — animated gradient overlay
16. Ambient Rotation — slow idle rotate
17. Depth Pulse — shadow oscillation
18. Card Bounce — spring translateY
19. Hover Blur BG — background blur increase
20. Expand Corners — animated corner lines
21. Inner Glow Motion — moving inner light
22. Scroll Reactive Scale — viewport scaling
23. Dynamic Radius Morph — changing border-radius
24. Shimmer Surface — diagonal light sweep
25. Hover Stretch — scaleX animation
26. Hover Compression — squash effect
27. Slide Overlay Reveal — translate overlay layer
28. Cursor Spotlight — radial gradient follow
29. Hover Wave Distortion — skew oscillation
30. Breathing Surface — subtle scale animation
31. Layer Separation — independent depth movement
32. Hover Energy Ring — rotating outline
33. Hover Shadow Burst — rapid shadow expansion
34. Floating Particles BG — pseudo animated dots
35. Tilted Reflection — moving reflective strip
36. Card Shake Alert — warning animation
37. Hover Expand Content — staggered children reveal
38. Animated Grid Texture — moving background pattern
39. Scroll Fade Stack — opacity depth system
40. Hover Rotation Snap — spring rotate reset
41. Glow Orbit — rotating outer light
42. Hover Gradient Shift — animated colors
43. Hover Border Draw — SVG stroke animation
44. Dynamic Elevation — translateZ illusion
45. Hover Flicker Neon — unstable glow pulse
46. Hover Split Panels — separated transforms
47. Hover Collapse Expand — content accordion motion
48. Card Physics Swing — pendulum effect
49. Aurora Surface — animated multicolor overlay
50. Cinematic Reveal — staggered clip-path entry

# Loaders & Skeletons (50)

1. Pulse Skeleton — opacity breathing
2. Shimmer Skeleton — animated gradient sweep
3. Rotating Ring — infinite rotate transform
4. Dual Spinner — nested opposite rotations
5. Gooey Loader — blur merged circles
6. Dot Bounce — staggered translateY
7. Elastic Bars — scaling vertical bars
8. Orbit Loader — circles rotating center
9. DNA Loader — alternating translate paths
10. Neon Spinner — glow rotation
11. Wave Loader — sequential scale animation
12. Morph Blob Loader — border-radius morphing
13. Grid Pulse — staggered opacity cells
14. Flip Loader — rotateX flipping square
15. Radar Sweep — conic-gradient rotation
16. Stretch Dots — scaleX oscillation
17. Spiral Loader — rotating translate paths
18. Equalizer Bars — audio waveform simulation
19. Particle Orbit — pseudo-elements rotating
20. Liquid Fill Loader — height transition
21. Circular Progress Sweep — stroke-dashoffset
22. Infinite Beam Loader — diagonal sweep
23. Magnetic Dots — cursor attraction motion
24. Ripple Rings — expanding circles
25. Wave Skeleton — moving opacity gradient
26. Noise Flicker Loader — random opacity changes
27. Scanline Progress — moving thin line
28. Breathing Logo Loader — scale pulse
29. Shaking Cube — translate oscillation
30. Hovering Balls — sinusoidal motion
31. Layered Spin Loader — multi-speed rotation
32. Typing Dots — sequential opacity
33. Rotating Hexagon — transform rotation
34. Glow Beam Loader — moving light strip
35. Blob Collision Loader — merged border-radius shapes
36. Stretch Spinner — elastic scaling
37. Scroll Sync Loader — progress-linked animation
38. Orbit Trails — fading rotation traces
39. Skeleton Reveal — clip-path transition
40. Infinite Gradient Flow — background-position shift
41. Floating Loader Cluster — random translate motion
42. Clock Loader — rotating hands
43. Tunnel Spinner — scale + opacity illusion
44. Hover Distortion Loader — skew oscillation
45. Frosted Spinner — blur filter transitions
46. Bounce Chain Loader — staggered jumps
47. Dynamic Stroke Loader — SVG path animation
48. Pixel Loader — stepped opacity grid
49. Ambient Glow Loader — pulsating shadow
50. Holographic Loader — rainbow rotating effect

# Scroll Viewports (50)

1. Fade In Viewport — opacity on intersection
2. Slide Up Reveal — translateY reveal
3. Scale Reveal — scale transition on enter
4. Parallax Layers — varying translate speeds
5. Sticky Scroll Transform — pinned animation
6. Scroll Blur Reduce — blur-to-focus
7. Horizontal Scroll Sync — translateX tied to scroll
8. Zoom Sections — scale linked to viewport
9. Scroll Progress Bar — width transform
10. Mask Reveal — clip-path expansion
11. Text Line Reveal — staggered opacity
12. Scroll Rotation — rotate tied to progress
13. Scroll Depth Cards — translateZ illusion
14. Scroll Snap Motion — CSS scroll snapping
15. Dynamic Background Shift — background-position movement
16. Infinite Scroll Marquee — looping translate
17. Viewport Bounce Entry — spring reveal
18. Scroll Triggered Glow — shadow opacity change
19. Sequential Grid Reveal — staggered children
20. Scroll Warp Effect — skew based on speed
21. Blur Exit Sections — blur while leaving
22. Sticky Scaling Headlines — pinned transforms
23. Scroll Particle Drift — pseudo particle motion
24. Scroll Perspective Tilt — rotate based on scroll
25. Edge Fade Scroll — mask-image gradients
26. Progressive Radius Morph — changing border radius
27. Scroll Beam Sweep — moving highlight line
28. Layer Collapse Scroll — shrinking stack
29. Velocity Reactive Motion — speed-based transforms
30. Scroll Shimmer Sections — gradient sweep
31. Scroll Snap Carousel — smooth snapping
32. Depth Fade Layers — opacity by distance
33. Elastic Scroll Return — overscroll bounce
34. Scroll Rotate Cards — rotate on enter
35. Scroll Morph Panels — shape transformation
36. Section Curtain Reveal — vertical clip animation
37. Scroll Noise Overlay — animated grain
38. Dynamic Sticky Cards — stacked scroll motion
39. Scroll Wave Distortion — skew oscillation
40. Viewport Energy Pulse — glow on visibility
41. Scroll Orbit Elements — circular motion path
42. Scroll Split Panels — opposing directions
43. Scroll Breathing Sections — scale oscillation
44. Scroll Controlled SVG Draw — path reveal
45. Scroll Spotlight — radial gradient movement
46. Scroll Reactive Shadows — depth changes
47. Scroll Cascade Lists — staggered timing
48. Scroll Gradient Drift — animated colors
49. Scroll Compression — squash transitions
50. Cinematic Section Transition — layered reveal system

# Cursor & Physics (50)

1. Magnetic Cursor — attraction force simulation
2. Cursor Trail — fading translate chain
3. Blob Cursor — morphing radial shape
4. Elastic Follow — delayed lerp movement
5. Physics Spring Cursor — damping interpolation
6. Ripple Cursor Click — radial expansion
7. Glow Cursor Halo — animated shadow
8. Cursor Distortion — skew nearby elements
9. Velocity Stretch Cursor — scale by speed
10. Orbit Cursor Particles — rotating dots
11. Cursor Gravity Fields — nearby pull effect
12. Hover Explosion — particle burst on hover
13. Cursor Spotlight — radial gradient follow
14. Noise Cursor Motion — jitter randomness
15. Cursor Beam Trail — stretched afterimage
16. Dynamic Cursor Ring — rotating outline
17. Cursor Blend Invert — mix-blend-mode effects
18. Sticky Hover Cursor — snaps to elements
19. Floating Cursor Aura — opacity pulse
20. Cursor Tilt Physics — rotate target by position
21. Bounce Follow Cursor — spring overshoot
22. Cursor Heat Distortion — blur wobble
23. Hover Push Physics — repelling elements
24. Cursor Shockwave — expanding scale ring
25. Cursor Orbital Motion — circular paths
26. Cursor Compression — squash at speed
27. Cursor Friction Delay — eased movement
28. Reactive Cursor Trails — particle fading
29. Cursor Warp Grid — transform mesh
30. Dynamic Cursor Blur — speed blur
31. Cursor Pulse Ring — repeated scaling
32. Hover Field Distortion — transform nearby items
33. Cursor Floating Shadow — shadow follows
34. Cursor Spring Snap — snapping transitions
35. Interactive Goo Cursor — blur merge blobs
36. Cursor Liquid Stretch — elastic morphing
37. Cursor Collision Bounce — object spring reaction
38. Cursor Trail Glow — fading neon path
39. Cursor Holographic Ring — rainbow hue rotate
40. Cursor Hover Scanline — moving overlay
41. Dynamic Cursor Reflections — light response
42. Cursor Energy Particles — emitted pseudo particles
43. Cursor Rotational Drift — smooth rotation
44. Hover Magnet Lines — SVG attraction lines
45. Cursor Parallax Layers — depth movement
46. Cursor Elastic Border — animated outline
47. Reactive Cursor Beams — directional glow
48. Cursor Hover Pulse — radial shadow growth
49. Physics Driven Hover Cards — spring transforms
50. Cursor Inertia Motion — velocity persistence

# Micro Interactions (50)

1. Toggle Morph — animated switch transition
2. Checkbox Bounce — spring scaling
3. Like Burst — heart explosion particles
4. Accordion Smooth Expand — height interpolation
5. Tooltip Fade Lift — opacity + translateY
6. Tab Underline Slide — translateX line
7. Copy Success Pulse — glow feedback
8. Notification Slide Stack — staggered entry
9. Avatar Hover Float — idle translateY
10. Progress Fill Motion — width interpolation
11. Menu Reveal Cascade — staggered opacity
12. Dropdown Perspective — rotateX reveal
13. Toast Bounce Entry — spring translateY
14. Floating Action Expand — radial menu spread
15. Hover Icon Wiggle — rotate oscillation
16. Upload Progress Wave — animated bar gradient
17. Success Check Draw — SVG stroke animation
18. Error Shake — translateX oscillation
19. Favorite Glow — pulsating shadow
20. Switch Elastic Snap — spring translateX
21. Drag Hover Elevation — translateY shadow depth
22. Hover Ripple Icons — radial pseudo-element
23. Link Hover Beam — animated underline sweep
24. Notification Pulse — opacity oscillation
25. Badge Bounce — scale overshoot
26. Hover Tilt Icons — rotate transforms
27. Swipe Reveal Actions — translateX actions
28. Dynamic Tooltip Glow — animated shadow
29. Input Success Morph — border-color transition
30. Hover Color Drift — gradual hue shift
31. Menu Blur Backdrop — opacity blur increase
32. Hover Stretch Icons — scaleX effect
33. Card Expand Details — height transition
34. Hover Shadow Flicker — unstable neon glow
35. Scroll Hint Bounce — translateY repeat
36. Loading Button Morph — spinner replacement
37. Nav Indicator Slide — transform interpolation
38. Animated Breadcrumbs — staggered fade
39. Hover Orbit Icons — circular movement
40. Interactive Stepper — progress scaling
41. Shake Notification Bell — rotate oscillation
42. Expand Search Field — width animation
43. Dynamic Counter Increment — rolling numbers
44. Hover Split Background — dual layer motion
45. Glass Overlay Reveal — opacity fade
46. Hover Compression Cards — squash effect
47. Interactive Rating Stars — scale glow
48. Modal Elastic Entry — spring scale reveal
49. Hover Gradient Drift — animated colors
50. Ambient Idle Motion — subtle infinite transforms

# Web Components (50)

1. Glass Navbar — backdrop blur transitions
2. Morphing Sidebar — width interpolation
3. Infinite Carousel — translateX looping
4. Floating Dock Menu — macOS-style magnification
5. Interactive Hero Section — layered parallax
6. Expandable Pricing Cards — scale + depth
7. Sticky Animated Header — scroll transforms
8. Perspective Gallery — rotateY image stack
9. Magnetic CTA Section — pointer-follow motion
10. Gooey Navigation Menu — blur merge effect
11. Animated Tabs System — sliding indicator
12. Elastic Modal Window — spring reveal
13. Scroll Reactive Timeline — progress-linked motion
14. Holographic Dashboard Widgets — animated gradients
15. Dynamic Masonry Grid — staggered reveals
16. Interactive Command Palette — fade + scale
17. Frosted Search Overlay — blur opacity transitions
18. Floating Notification Center — stack animations
19. Animated Stats Counter — rolling numbers
20. Hover Reactive Product Cards — tilt transforms
21. Infinite Logo Marquee — looping motion
22. Layered Hero Typography — staggered parallax
23. Expanding FAQ Panels — smooth height transitions
24. Scroll Controlled Story Sections — viewport transforms
25. Cursor Reactive Background — radial gradient follow
26. Interactive File Upload Zone — hover pulse
27. Animated Sidebar Collapse — width morphing
28. Dynamic Breadcrumb Navigation — staggered motion
29. Expandable Media Player — height + blur
30. Hover Activated Mega Menu — perspective reveal
31. Scroll Snap Gallery — snapping transforms
32. Interactive Charts Motion — SVG interpolation
33. Dynamic Data Tables — hover elevation
34. Floating Glass Cards — translateY oscillation
35. Animated Command Inputs — focus glow system
36. Reactive Dashboard Panels — depth transforms
37. Expandable Notification Toasts — scale stack
38. Scroll Velocity Components — speed-linked transforms
39. Hover Reactive Buttons — magnetic motion
40. Dynamic Hero Backgrounds — animated gradients
41. Elastic Form Sections — staggered reveal
42. Orbiting Dashboard Icons — circular transforms
43. Interactive Kanban Boards — drag elevation
44. Animated Dock Toolbars — scale interpolation
45. Scroll Reveal Galleries — clip-path transitions
46. Cursor Reactive Mesh Backgrounds — transform grids
47. Dynamic Accordion Navigation — height transitions
48. Interactive Video Overlays — blur fade reveals
49. Animated Footer Sections — staggered entries
50. SaaS Dashboard Motion System — combined layered physics, blur, glow, stagger, parallax, and cursor-reactive interactions using pure CSS + minimal JS orchestration.
`;

const outputData = {};

function rnd(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

// Parse the text block into categories
const lines = rawData.split('\n').map(l => l.trim());
let currentCategory = '';
let catId = '';

const parsedCategories = {};

lines.forEach(line => {
    const headerMatch = line.match(/^# (.+) \(\d+\)/);
    if (headerMatch) {
        currentCategory = headerMatch[1];
        if (currentCategory.includes('Typography')) catId = 'text';
        else if (currentCategory.includes('Button')) catId = 'button';
        else if (currentCategory.includes('Inputs')) catId = 'input';
        else if (currentCategory.includes('Cards')) catId = 'card';
        else if (currentCategory.includes('Loaders')) catId = 'loader';
        else if (currentCategory.includes('Scroll')) catId = 'scroll';
        else if (currentCategory.includes('Cursor')) catId = 'cursor';
        else if (currentCategory.includes('Micro Interactions')) catId = 'micro';
        else if (currentCategory.includes('Web Components')) catId = 'webcomp';
        parsedCategories[catId] = [];
    } else if (line.match(/^\d+\./) && catId) {
        const parts = line.split('—');
        const name = parts[0].replace(/^\d+\.\s*/, '').trim();
        const desc = parts[1] ? parts[1].trim() : '';
        parsedCategories[catId].push({ name, desc });
    }
});

const cats = Object.keys(parsedCategories);

cats.forEach(category => {
    const keyframes = [];
    const classes = [];
    const dataItems = [];

    const items = parsedCategories[category];

    items.forEach((item, i) => {
        const animName = `anim-${category}-${i}`;
        
        // Sanitize name for CSS class
        let cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const clsName = `sds-${category}-${cleanName}`;
        
        let kf = '';
        let prop = '';
        let previewHTML = '';

        const descLower = item.desc.toLowerCase();
        const nameLower = item.name.toLowerCase();

        // ── Keyframe logic: map desc/name keywords → distinct animation patterns ──
        const dur = (1.5 + (i % 7) * 0.4).toFixed(1);
        let kfBody = '';
        let ease = 'ease-in-out';
        let direction = 'alternate';

        if (descLower.includes('rotate') || descLower.includes('spin') || nameLower.includes('orbit') || nameLower.includes('clock')) {
            kfBody = '0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)}';
            ease = 'linear'; direction = 'normal';
        } else if (descLower.includes('blur') || nameLower.includes('blur') || nameLower.includes('focus')) {
            kfBody = '0%{filter:blur(8px);opacity:0} 100%{filter:blur(0);opacity:1}';
        } else if (descLower.includes('elastic') || descLower.includes('spring') || descLower.includes('bounce') || nameLower.includes('bounce')) {
            kfBody = '0%{transform:scale(0.85)} 60%{transform:scale(1.12)} 80%{transform:scale(0.96)} 100%{transform:scale(1)}';
            ease = 'cubic-bezier(0.34,1.56,0.64,1)';
        } else if (descLower.includes('clip') || descLower.includes('reveal') || descLower.includes('mask')) {
            kfBody = '0%{clip-path:inset(0 100% 0 0)} 100%{clip-path:inset(0 0% 0 0)}';
        } else if (nameLower.includes('float') || descLower.includes('translatey') || descLower.includes('sinusoidal')) {
            kfBody = '0%{transform:translateY(0)} 50%{transform:translateY(-10px)} 100%{transform:translateY(0)}';
            ease = 'ease-in-out'; direction = 'normal';
        } else if (descLower.includes('skew') || nameLower.includes('warp') || nameLower.includes('distort') || nameLower.includes('glitch')) {
            kfBody = '0%{transform:skewX(0deg)} 25%{transform:skewX(-6deg)} 75%{transform:skewX(6deg)} 100%{transform:skewX(0deg)}';
        } else if (descLower.includes('shadow') || descLower.includes('glow') || nameLower.includes('neon') || nameLower.includes('glow')) {
            kfBody = '0%{box-shadow:0 0 0 rgba(0,20,209,0)} 100%{box-shadow:0 0 18px rgba(0,20,209,0.35),0 0 36px rgba(79,94,255,0.20)}';
        } else if (descLower.includes('gradient') || descLower.includes('hue') || nameLower.includes('aurora') || nameLower.includes('chromatic')) {
            kfBody = '0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)}';
            ease = 'linear'; direction = 'normal';
        } else if (descLower.includes('width') || descLower.includes('scalex') || nameLower.includes('stretch') || nameLower.includes('expand')) {
            kfBody = '0%{transform:scaleX(0.7)} 100%{transform:scaleX(1)}';
        } else if (descLower.includes('opacity') || nameLower.includes('flicker') || nameLower.includes('pulse') || nameLower.includes('breathe') || nameLower.includes('breathing')) {
            kfBody = '0%{opacity:0.3} 100%{opacity:1}';
        } else if (descLower.includes('translatex') || nameLower.includes('slide') || nameLower.includes('marquee')) {
            kfBody = '0%{transform:translateX(-100%)} 100%{transform:translateX(0)}';
        } else {
            kfBody = `0%{transform:translateY(14px);opacity:0} 100%{transform:translateY(0);opacity:1}`;
        }

        kf = `@keyframes ${animName} { ${kfBody} }`;
        prop = `animation: ${animName} ${dur}s ${ease} ${direction} infinite;`;

        // ── Preview HTML — light theme styles ──
        const baseInline = `font-family:'Inter',sans-serif; font-size:13px; display:inline-flex; align-items:center; justify-content:center;`;

        if (category === 'text') {
            previewHTML = `<span style="font-size:18px;font-weight:700;color:#0D0F2E;display:inline-block;${prop}">${item.name.split(' ').slice(0,2).join(' ')}</span>`;
        } else if (category === 'button') {
            previewHTML = `<button style="background:#0014D1;color:#fff;border:none;padding:9px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;${prop}">${item.name.split(' ').slice(0,2).join(' ')}</button>`;
        } else if (category === 'input') {
            previewHTML = `<input type="text" placeholder="${item.name.split(' ').slice(0,2).join(' ')}" style="background:#fff;color:#0D0F2E;border:1.5px solid #0014D1;padding:9px 13px;border-radius:7px;width:170px;font-size:12px;font-family:inherit;outline:none;${prop}" readonly />`;
        } else if (category === 'card') {
            previewHTML = `<div style="width:140px;height:68px;background:#fff;border:1.5px solid #0014D1;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#0014D1;text-align:center;padding:8px;${prop}">${item.name.split(' ').slice(0,3).join(' ')}</div>`;
        } else if (category === 'loader') {
            const loaderStyle = descLower.includes('rotate') || descLower.includes('spin') || nameLower.includes('spin') || nameLower.includes('ring') ?
                `width:38px;height:38px;border:3.5px solid #EEF0FF;border-top-color:#0014D1;border-radius:50%;${prop}` :
                descLower.includes('bar') || nameLower.includes('bar') ?
                `width:120px;height:6px;background:#EEF0FF;border-radius:3px;overflow:hidden;position:relative;` :
                `width:38px;height:38px;border:3.5px solid #EEF0FF;border-top-color:#0014D1;border-radius:50%;${prop}`;
            previewHTML = `<div style="${loaderStyle}"></div>`;
        } else if (category === 'scroll') {
            previewHTML = `<div style="width:130px;height:56px;background:#EEF0FF;border:1.5px solid #0014D1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#0014D1;text-align:center;padding:6px;${prop}">${item.name.split(' ').slice(0,3).join(' ')}</div>`;
        } else if (category === 'cursor') {
            previewHTML = `<div style="width:26px;height:26px;border-radius:50%;background:#0014D1;${prop}"></div>`;
        } else if (category === 'micro') {
            const icons = ['✦','★','♥','◉','⊛','⬡','◈','⚡','✿','◎'];
            const icon = icons[i % icons.length];
            previewHTML = `<span style="font-size:28px;color:#0014D1;display:inline-block;${prop}">${icon}</span>`;
        } else if (category === 'webcomp') {
            previewHTML = `<div style="width:160px;height:52px;background:#EEF0FF;border-radius:8px;border:1.5px solid #0014D1;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#0014D1;text-align:center;padding:6px;${prop}">${item.name.split(' ').slice(0,3).join(' ')}</div>`;
        }

        keyframes.push(kf);
        classes.push(`.${clsName} { ${prop} }`);
        dataItems.push({ name: item.name, cls: clsName, desc: item.desc, preview: previewHTML });
    });

    fs.writeFileSync(path.join(__dirname, `../src/css/keyframes/${category}.css`), keyframes.join('nn'));
    fs.writeFileSync(path.join(__dirname, `../src/css/animations/${category}.css`), classes.join('nn'));
    
    outputData[`${category}Animations`] = dataItems;
});

// Update index CSS
const allImports = [];
cats.forEach(c => {
    allImports.push(`@import "./keyframes/${c}.css";`);
    allImports.push(`@import "./animations/${c}.css";`);
});
fs.writeFileSync(path.join(__dirname, '../src/css/sds-motion.css'), allImports.join('n'));

// Save JS data
const jsContent = `module.exports = ${JSON.stringify(outputData, null, 2)};`;
fs.writeFileSync(path.join(__dirname, '../playground/animation-data.js'), jsContent);

console.log('Successfully generated 450 specific animations from user list.');
