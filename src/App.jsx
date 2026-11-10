import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const portfolio = {
  about: { title: 'About me', room: 'Welcome lounge', body: 'Shaik Vali Basha is a BCA graduate in Data Science and is currently pursuing an MCA. His interests include data science, AI, content creation, and video editing.', details: ['BCA in Data Science · Krishna Chaitanya Degree College', 'MCA in progress · expected April 2027', 'Seeking entry-level IT, data, or technology-support roles'] },
  skills: { title: 'Skills & expertise', room: 'Skills studio', groups: [['Programming', 'Python', 'Java', 'SQL'], ['Analytics', 'Power BI', 'Tableau', 'Advanced Excel', 'Data visualization'], ['AI tools', 'ChatGPT', 'Google Gemini', 'Claude AI', 'Microsoft Copilot', 'GitHub Copilot', 'Perplexity AI'], ['Professional', 'Report writing', 'Analytical thinking', 'Communication', 'Team collaboration', 'Time management']] },
  projects: { title: 'Projects', room: 'Project gallery', projects: [
    { name: 'Sales Analytics & Dashboard Reporting', tools: 'Power BI · SQL · Tableau', description: 'Interactive dashboards for sales trends, KPIs, and regional performance. Connected a SQL database and cleaned data with Power Query Editor.' },
    { name: 'Structured Data Pattern Analysis', tools: 'Python · Pandas · Scikit-learn', description: 'Machine-learning analysis of structured datasets, including preprocessing, feature analysis, and visualization.' }
  ] },
  internships: { title: 'Internships', room: 'Learning room', entries: [
    { role: 'AI Transformative Learning Intern', org: 'TechSaksham · Edunet Foundation · Microsoft & SAP CSR · AICTE recognized', date: 'Dec 2024 – Jan 2025', work: 'Studied AI governance and responsible AI; explored Microsoft Copilot and documented AI use cases.' },
    { role: 'Data Analytics using AI-LLMs Intern', org: 'AICTE · Vodafone Idea Foundation · VOIS for Tech / Edunet Foundation', date: 'Oct 2024 – Nov 2024', work: 'Prepared, cleaned, and visualized data with AI/LLM tools; developed Power BI and Tableau dashboards.' },
    { role: 'AI/ML Data Analysis Intern', org: 'Next24tech Technology and Services · AICTE Virtual Internship', date: 'Apr 2024 – Jul 2024', work: 'Supported structured-data pattern analysis, preprocessing, and clear visual reporting.' }
  ] },
  content: { title: 'Content creation', room: 'Creator room', channels: [
    { name: 'MindBodha', description: 'Mysterious facts, history, and educational content.', instagram: 'https://www.instagram.com/mindbodha?cplk=b2F2dnV6NWV1M2Np', youtube: 'https://youtube.com/@mindbodha?si=PFxzFDOeYev4zhrL' },
    { name: 'BujjiBlitz', description: 'Gaming-related content.', instagram: 'https://www.instagram.com/bujjiblitz?psln=MTZ6djE5eGV5dHVpZA==', youtube: 'https://youtube.com/@bujjiblitz?si=LsuZ4igcjVIsUOyk' },
    { name: 'TrulyValli', description: 'Personal vlog channel.', instagram: 'https://www.instagram.com/trulyvalli?rpxt=MXhldXZqcWI5dWQ4cg==', youtube: 'https://youtube.com/@trulyvalli?si=xFzINlty0yCBJHDh' }
  ] },
  education: { title: 'Education', room: 'Study', entries: [
    'MCA · The Krishna Chaitanya Institute of Science and Technology (KIST), Nellore · expected April 2027',
    'BCA, Data Science · Krishna Chaitanya Degree College, Vikrama Simhapuri University · Aug 2022 – May 2025 · 80%',
    "Intermediate, MPC · Rao's Junior College, Nellore · 55%",
    'SSC · MPL High School, Venkateswarapuram, Nellore · 91.3%',
    'Also pursuing Mechanic Diesel, NSQF Level 3 · NIMI / Skill India Digital'
  ] },
  certifications: { title: 'Certifications', room: 'Credentials', entries: [
    'IBM AI Product Manager — IBM', 'Google AI Essentials — Google / Coursera, 2026',
    'Google Prompting Essentials — Google / Coursera, 2026', 'Oracle Cloud AI Foundations Associate — Oracle, 2025',
    'Identity Security for the AI Age — Saviynt, 2025', 'Career Essentials in Generative AI — Microsoft & LinkedIn, 2024'
  ] },
  contact: { title: 'Contact', room: 'Contact study', phone: '+91-8639563286', email: 'skvallibasha6@gmail.com', location: 'Nellore, Andhra Pradesh', linkedin: 'https://www.linkedin.com/in/valibasha6', relocation: 'Open to relocate Pan India' }
};

const stations = [
  { id: 'about', position: [-8, 1.7, 4.7] }, { id: 'skills', position: [0, 1.7, 4.7] }, { id: 'projects', position: [8, 1.7, 4.7] },
  { id: 'content', position: [-8, 1.7, -4.7] }, { id: 'internships', position: [0, 1.7, -4.7] }, { id: 'contact', position: [8, 1.7, -4.7] }
];
const INTERACT_DISTANCE = 3.1;
const PLAYER_EYE_HEIGHT = 1.7;
const PLAYER_RADIUS = 0.38;

// PlaneGeometry starts in local XY. With rotation.x = -PI/2, local +Y maps
// to world -Z and local +Z (the displaced vertex height) maps to world +Y.
// This helper accepts world coordinates and mirrors that exact transform.
function terrainHeightAtWorld(x, worldZ) {
  const localY = -worldZ;
  const outsideEstate = Math.max(0, Math.min(1, (Math.hypot(x, localY) - 13) / 18));
  return (Math.sin(x * 0.12) * Math.cos(localY * 0.09) * 1.2 + Math.sin((x + localY) * 0.055) * 2.1) * outsideEstate;
}

function makeTextTexture(title, subtitle) {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#24231f'; ctx.fillRect(0, 0, 768, 256); ctx.fillStyle = '#c9a875'; ctx.fillRect(0, 0, 9, 256);
  ctx.fillStyle = '#f1eadc'; ctx.font = '600 48px Georgia'; ctx.fillText(title, 38, 104);
  ctx.fillStyle = '#c3b9a7'; ctx.font = '28px Arial'; ctx.fillText(subtitle, 40, 158);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

function createScene(container, quality, onNearby, onLocked) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#b6c8cf'); scene.fog = new THREE.FogExp2('#b6c8cf', 0.0085);
  const camera = new THREE.PerspectiveCamera(68, container.clientWidth / container.clientHeight, 0.1, 180);
  camera.position.set(0, 0, 0); // Eye height belongs to the player object only.
  const renderer = new THREE.WebGLRenderer({ antialias: quality !== 'low', powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'high' ? 1.75 : 1.25)); renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = quality !== 'low'; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);
  const controls = new PointerLockControls(camera, renderer.domElement);
  const spawn = new THREE.Vector3(0, terrainHeightAtWorld(0, 18) + PLAYER_EYE_HEIGHT, 18);
  controls.getObject().position.copy(spawn); scene.add(controls.getObject());
  controls.addEventListener('lock', () => onLocked(true)); controls.addEventListener('unlock', () => onLocked(false));

  scene.add(new THREE.HemisphereLight('#d8e6e9', '#59614e', 1.35));
  const sun = new THREE.DirectionalLight('#fff0d9', 2.2); sun.position.set(-28, 38, 20); sun.castShadow = quality !== 'low';
  sun.shadow.mapSize.set(quality === 'high' ? 2048 : 1024, quality === 'high' ? 2048 : 1024);
  Object.assign(sun.shadow.camera, { left: -38, right: 38, top: 38, bottom: -38, near: 1, far: 100 }); sun.shadow.bias = -0.00015; scene.add(sun);

  const terrainGeometry = new THREE.PlaneGeometry(120, 120, 100, 100);
  const positions = terrainGeometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const localX = positions.getX(i), localY = positions.getY(i);
    // Under rotation.x=-PI/2, worldZ=-localY. Reuse the same function as movement.
    positions.setZ(i, terrainHeightAtWorld(localX, -localY));
  }
  terrainGeometry.computeVertexNormals();
  const terrain = new THREE.Mesh(terrainGeometry, new THREE.MeshStandardMaterial({ color: '#66745b', roughness: 1 }));
  terrain.rotation.x = -Math.PI / 2; terrain.receiveShadow = true; scene.add(terrain);

  const ridgeMaterial = new THREE.MeshStandardMaterial({ color: '#7d8b83', roughness: 1, flatShading: true });
  for (let i = 0; i < 13; i += 1) {
    const ridge = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), ridgeMaterial); const angle = i / 13 * Math.PI * 2;
    ridge.position.set(Math.cos(angle) * 48, 4.5, Math.sin(angle) * 48); ridge.scale.set(10 + (i % 3) * 2, 5 + (i % 4) * 1.3, 8); ridge.rotation.y = angle; ridge.receiveShadow = true; scene.add(ridge);
  }
  const treeData = []; let seed = 19371;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < (quality === 'low' ? 80 : 155); i += 1) {
    const angle = random() * Math.PI * 2, radius = 16 + random() * 43, x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    if ((Math.abs(x) < 14 && Math.abs(z) < 10) || Math.hypot(x - 24, z + 18) < 13) continue;
    treeData.push({ x, z, scale: 0.8 + random() * 0.65, yaw: random() * Math.PI * 2 });
  }
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.13, .24, 3.6, 7), new THREE.MeshStandardMaterial({ color: '#554431', roughness: 1 }), treeData.length);
  trunks.castShadow = quality !== 'low'; trunks.receiveShadow = true;
  const crowns = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.25, 1), new THREE.MeshStandardMaterial({ color: '#405b43', roughness: 1, flatShading: true }), treeData.length * 3);
  crowns.castShadow = quality === 'high'; crowns.receiveShadow = true;
  const dummy = new THREE.Object3D();
  treeData.forEach((tree, i) => {
    dummy.position.set(tree.x, 1.7 * tree.scale, tree.z); dummy.scale.setScalar(tree.scale); dummy.rotation.y = tree.yaw; dummy.updateMatrix(); trunks.setMatrixAt(i, dummy.matrix);
    for (let layer = 0; layer < 3; layer += 1) {
      dummy.position.set(tree.x + (layer - 1) * .24 * tree.scale, (3 + layer * .78) * tree.scale, tree.z + (layer % 2 ? .18 : -.15) * tree.scale);
      dummy.scale.set(tree.scale * (1.05 - layer * .12), tree.scale * .86, tree.scale * (1 - layer * .1)); dummy.rotation.set(0, tree.yaw + layer, 0); dummy.updateMatrix(); crowns.setMatrixAt(i * 3 + layer, dummy.matrix);
    }
  });
  scene.add(trunks, crowns);
  const lake = new THREE.Mesh(new THREE.CircleGeometry(9, 80), new THREE.MeshPhysicalMaterial({ color: '#779ba0', roughness: .24, metalness: .03, clearcoat: .75, clearcoatRoughness: .18 }));
  lake.rotation.x = -Math.PI / 2; lake.position.set(24, .12, -18); lake.receiveShadow = true; scene.add(lake);
  const shore = new THREE.Mesh(new THREE.RingGeometry(9, 10.1, 80), new THREE.MeshStandardMaterial({ color: '#887d65', roughness: 1, side: THREE.DoubleSide }));
  shore.rotation.x = -Math.PI / 2; shore.position.set(24, .08, -18); scene.add(shore);

  const mansion = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: '#c9c4b8', roughness: .82 }), timber = new THREE.MeshStandardMaterial({ color: '#4b4032', roughness: .7 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#82999a', roughness: .12, metalness: .12, transparent: true, opacity: .56, transmission: .25, clearcoat: .9 });
  const wood = new THREE.MeshStandardMaterial({ color: '#604b35', roughness: .68 }), floorMat = new THREE.MeshStandardMaterial({ color: '#887c68', roughness: .88 });
  const addBox = (parent, size, pos, material, cast = true) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material); mesh.position.set(...pos); mesh.castShadow = cast && quality !== 'low'; mesh.receiveShadow = true; parent.add(mesh); return mesh; };
  addBox(mansion, [24, .38, 16], [0, .1, 0], floorMat, false); addBox(mansion, [24, .3, 1.2], [0, 3.35, -8], timber);
  addBox(mansion, [1.2, 3.3, 16], [-12, 1.8, 0], stone); addBox(mansion, [1.2, 3.3, 16], [12, 1.8, 0], stone);
  addBox(mansion, [9.6, 3.3, .45], [-7.2, 1.8, 8], stone); addBox(mansion, [9.6, 3.3, .45], [7.2, 1.8, 8], stone); addBox(mansion, [24, 3.3, .45], [0, 1.8, -8], stone);
  addBox(mansion, [.18, 3.3, .55], [-2.4, 1.8, 8], timber); addBox(mansion, [.18, 3.3, .55], [2.4, 1.8, 8], timber); addBox(mansion, [4.8, .22, .58], [0, 3.48, 8], timber);
  [-4, 4].forEach((x) => { addBox(mansion, [.22, 3.1, 6.4], [x, 1.7, -4.8], stone); addBox(mansion, [.22, 3.1, 6.4], [x, 1.7, 4.8], stone); addBox(mansion, [.22, .35, 3.2], [x, 3.05, 0], timber); });
  const corridorWallSegments = [{ start: -12, end: -9.2 }, { start: -6.8, end: -1.2 }, { start: 1.2, end: 6.8 }, { start: 9.2, end: 12 }];
  corridorWallSegments.forEach(({ start, end }) => addBox(mansion, [end - start, 3.1, .2], [(start + end) / 2, 1.7, 0], stone));
  [-8, 0, 8].forEach((x) => addBox(mansion, [2.4, .35, .22], [x, 3.05, 0], timber));
  [-9, -6, -3, 3, 6, 9].forEach((x) => {
    const pane = addBox(mansion, [1.7, 1.45, .08], [x, 2.05, 7.72], glass, false); pane.castShadow = false;
    addBox(mansion, [1.85, .09, .12], [x, 2.05, 7.65], timber, false); addBox(mansion, [.08, 1.55, .12], [x, 2.05, 7.65], timber, false);
    const rearPane = addBox(mansion, [1.8, 1.45, .08], [x, 2.05, -7.72], glass, false); rearPane.castShadow = false;
  });
  addBox(mansion, [24.7, .28, .32], [0, 3.65, 7.86], timber); addBox(mansion, [24.7, .28, .32], [0, 3.65, -7.86], timber);
  addBox(mansion, [5.2, .22, 2.7], [0, 3.65, 9], timber); [-2.2, 2.2].forEach((x) => addBox(mansion, [.18, 3.35, .18], [x, 1.8, 9.8], timber));
  const rooms = [
    { x: -8, z: 4.7, label: 'WELCOME', sub: 'About Vali Basha' }, { x: 0, z: 4.7, label: 'SKILLS', sub: 'Data · AI · Tools' }, { x: 8, z: 4.7, label: 'PROJECTS', sub: 'Selected work' },
    { x: -8, z: -4.7, label: 'CREATOR', sub: 'Channels & content' }, { x: 0, z: -4.7, label: 'EXPERIENCE', sub: 'Virtual internships' }, { x: 8, z: -4.7, label: 'CONTACT', sub: 'Connect with Vali' }
  ];
  rooms.forEach((room) => {
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.45), new THREE.MeshStandardMaterial({ map: makeTextTexture(room.label, room.sub), roughness: .8, metalness: .05 }));
    sign.position.set(room.x, 2.65, room.z < 0 ? -7.82 : 7.82); sign.rotation.y = room.z < 0 ? Math.PI : 0; mansion.add(sign);
    const deskZ = room.z + (room.z > 0 ? -1.8 : 1.8);
    addBox(mansion, [3.2, .16, 1.2], [room.x, .95, deskZ], wood); addBox(mansion, [.14, .9, .14], [room.x - 1.35, .48, deskZ], timber); addBox(mansion, [.14, .9, .14], [room.x + 1.35, .48, deskZ], timber);
    addBox(mansion, [1.7, 1, .08], [room.x, 1.85, room.z < 0 ? -7.75 : 7.75], timber, false);
    const sconce = new THREE.PointLight('#f0d7ae', .45, 5, 2); sconce.position.set(room.x, 2.6, room.z < 0 ? -6.9 : 6.9); mansion.add(sconce);
  });
  scene.add(mansion);
  const pathMat = new THREE.MeshStandardMaterial({ color: '#aaa18e', roughness: .95 });
  for (let i = 0; i < 7; i += 1) { const slab = new THREE.Mesh(new THREE.BoxGeometry(2.5, .08, 1.35), pathMat); slab.position.set(0, .08, 10.5 + i * 1.45); slab.receiveShadow = true; scene.add(slab); }
  const markers = stations.map((station) => { const plaque = new THREE.Mesh(new THREE.BoxGeometry(1, 1.25, .12), new THREE.MeshStandardMaterial({ color: '#9a845e', roughness: .55, metalness: .28 })); plaque.position.set(station.position[0], 1.45, station.position[2] + (station.position[2] > 0 ? 2 : -2)); plaque.castShadow = true; scene.add(plaque); return station; });

  const collisionBoxes = [
    { minX: -12, maxX: 12, minZ: -8.3, maxZ: -7.7 }, { minX: -12.3, maxX: -11.7, minZ: -8, maxZ: 8 }, { minX: 11.7, maxX: 12.3, minZ: -8, maxZ: 8 },
    { minX: -12, maxX: -2.4, minZ: 7.7, maxZ: 8.3 }, { minX: 2.4, maxX: 12, minZ: 7.7, maxZ: 8.3 },
    ...[-4, 4].flatMap((x) => [{ minX: x - .12, maxX: x + .12, minZ: -8, maxZ: -1.6 }, { minX: x - .12, maxX: x + .12, minZ: 1.6, maxZ: 8 }]),
    ...corridorWallSegments.map(({ start, end }) => ({ minX: start, maxX: end, minZ: -.12, maxZ: .12 }))
  ];
  const keys = { KeyW: 'forward', ArrowUp: 'forward', KeyS: 'backward', ArrowDown: 'backward', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right' };
  const movement = { forward: false, backward: false, left: false, right: false }; let lastNearby = ''; let running = true; let raf = 0; const clock = new THREE.Clock();
  const collides = (x, z) => Math.abs(x) > 54 || Math.abs(z) > 54 || Math.hypot(x - 24, z + 18) < 9.4 + PLAYER_RADIUS || collisionBoxes.some((box) => x + PLAYER_RADIUS > box.minX && x - PLAYER_RADIUS < box.maxX && z + PLAYER_RADIUS > box.minZ && z - PLAYER_RADIUS < box.maxZ);
  const onKeyDown = (event) => { if (keys[event.code]) { movement[keys[event.code]] = true; event.preventDefault(); } if (event.code === 'KeyE' && lastNearby) onNearby(lastNearby); };
  const onKeyUp = (event) => { if (keys[event.code]) movement[keys[event.code]] = false; };
  const clearKeys = () => Object.keys(movement).forEach((key) => { movement[key] = false; });
  window.addEventListener('keydown', onKeyDown); window.addEventListener('keyup', onKeyUp); window.addEventListener('blur', clearKeys);
  const tick = () => {
    if (!running) return; raf = requestAnimationFrame(tick); const delta = Math.min(clock.getDelta(), .04); const player = controls.getObject();
    if (controls.isLocked) {
      const xBefore = player.position.x, zBefore = player.position.z, speed = 4.4;
      if (movement.forward) controls.moveForward(speed * delta); if (movement.backward) controls.moveForward(-speed * delta);
      if (movement.left) controls.moveRight(-speed * delta); if (movement.right) controls.moveRight(speed * delta);
      const xAfter = player.position.x, zAfter = player.position.z;
      if (collides(xAfter, zAfter)) {
        if (!collides(xAfter, zBefore)) player.position.z = zBefore;
        else if (!collides(xBefore, zAfter)) player.position.x = xBefore;
        else { player.position.x = xBefore; player.position.z = zBefore; }
      }
      // Directly sample the same analytic surface used for every terrain vertex.
      // This keeps the eye at ground + 1.7 m without a lagging lerp or height clamp.
      player.position.y = terrainHeightAtWorld(player.position.x, player.position.z) + PLAYER_EYE_HEIGHT;
    }
    let nearest = null, nearestDistance = INTERACT_DISTANCE;
    for (const station of markers) { const distance = Math.hypot(player.position.x - station.position[0], player.position.z - station.position[2]); if (distance < nearestDistance) { nearest = station.id; nearestDistance = distance; } }
    if (nearest !== lastNearby) { lastNearby = nearest || ''; onNearby(nearest || ''); }
    renderer.render(scene, camera);
  };
  tick();
  const resize = () => { camera.aspect = container.clientWidth / Math.max(1, container.clientHeight); camera.updateProjectionMatrix(); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'high' ? 1.75 : 1.25)); renderer.setSize(container.clientWidth, container.clientHeight); };
  window.addEventListener('resize', resize);
  return { controls, dispose() {
    running = false; cancelAnimationFrame(raf); window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); window.removeEventListener('blur', clearKeys); window.removeEventListener('resize', resize); controls.dispose();
    scene.traverse((object) => { if (object.geometry) object.geometry.dispose(); if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => { if (material.map) material.map.dispose(); material.dispose(); }); });
    renderer.dispose(); renderer.domElement.remove();
  } };
}

function App() {
  const mountRef = useRef(null), worldRef = useRef(null);
  const [quality, setQuality] = useState('medium'), [started, setStarted] = useState(false), [locked, setLocked] = useState(false), [nearby, setNearby] = useState(''), [active, setActive] = useState('about'), [sceneError, setSceneError] = useState('');
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;
  useEffect(() => {
    const container = mountRef.current; if (!container) return undefined;
    try { worldRef.current = createScene(container, quality, setNearby, setLocked); }
    catch (error) { console.error('Unable to initialize the WebGL portfolio scene.', error); setSceneError('3D preview could not start in this browser. Use the accessible portfolio navigation below.'); }
    return () => { worldRef.current?.dispose(); worldRef.current = null; };
  }, [quality]);
  const selectSection = (id) => { if (portfolio[id]) { setActive(id); if (isMobile) setStarted(true); } };
  const start = () => { setStarted(true); if (!isMobile) worldRef.current?.controls.lock(); };
  const content = portfolio[active];
  return <main className="app-shell">
    <div className="scene-wrap" ref={mountRef} aria-label="Three-dimensional portfolio environment" />
    <header className="hud"><a className="hud-brand" href="#home">VALI BASHA <span>SHAIK</span></a><div className="hud-tools">
      <label className="quality-control">Quality<select value={quality} onChange={(event) => setQuality(event.target.value)} aria-label="3D rendering quality"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
      <button className="hud-button" onClick={() => worldRef.current?.controls.unlock()} type="button">Pause / release</button><a className="hud-button" href="mailto:skvallibasha6@gmail.com">Contact</a>
    </div></header>
    {!started && <div className="welcome-overlay"><section className="welcome-card" aria-labelledby="welcome-title"><p className="eyebrow">A Three.js portfolio experience</p><h1 id="welcome-title">A world of <span>work & ideas.</span></h1><p>Explore a quiet landscape and a small open-plan portfolio pavilion. This is a browser-based Three.js scene—not Unreal Engine rendering.</p><button className="primary-button" onClick={start} type="button">Start exploring</button><div className="controls-guide"><span><b>W A S D</b> move</span><span><b>Mouse</b> look</span><span><b>E</b> interact nearby</span><span><b>ESC</b> release pointer</span></div><p className="welcome-note">Mobile and keyboard users can select any section from the accessible navigation.</p></section></div>}
    <div className="scene-status" aria-live="polite"><span className="status-dot" />{locked ? 'Exploring · ESC to release' : 'Pointer released'}{nearby && <button className="interact-prompt" onClick={() => selectSection(nearby)} type="button">E · Open {portfolio[nearby]?.title}</button>}</div>
    <nav className="section-nav" aria-label="Portfolio sections">{Object.keys(portfolio).map((id) => <button key={id} type="button" className={active === id ? 'selected' : ''} onClick={() => selectSection(id)}>{portfolio[id].title}</button>)}</nav>
    <aside className="portfolio-panel" aria-live="polite"><div className="panel-heading"><div><span className="room-label">{content.room}</span><h2>{content.title}</h2></div><button type="button" className="close-panel" aria-label="Return to About me" onClick={() => setActive('about')}>↻</button></div>
      {content.body && <><p className="panel-copy">{content.body}</p><ul>{content.details.map((item) => <li key={item}>{item}</li>)}</ul></>}
      {content.groups && <div className="content-list">{content.groups.map(([heading, ...items]) => <div className="content-card" key={heading}><h3>{heading}</h3><div className="chips">{items.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div>)}</div>}
      {content.projects && <div className="content-list">{content.projects.map((project) => <article className="content-card" key={project.name}><h3>{project.name}</h3><p>{project.description}</p><span className="small-meta">{project.tools}</span></article>)}</div>}
      {content.entries && <div className="content-list">{content.entries.map((entry) => typeof entry === 'string' ? <div className="content-card" key={entry}>{entry}</div> : <article className="content-card" key={entry.role}><h3>{entry.role}</h3><p className="small-meta">{entry.org} · {entry.date}</p><p>{entry.work}</p></article>)}</div>}
      {content.channels && <div className="content-list">{content.channels.map((channel) => <article className="content-card" key={channel.name}><h3>{channel.name}</h3><p>{channel.description}</p><div className="external-links"><a href={channel.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={channel.youtube} target="_blank" rel="noreferrer">YouTube ↗</a></div></article>)}</div>}
      {content.email && <div className="content-list"><div className="content-card"><p><strong>Phone:</strong> <a href="tel:+918639563286">{content.phone}</a></p><p><strong>Email:</strong> <a href={`mailto:${content.email}`}>{content.email}</a></p><p><strong>Location:</strong> {content.location}</p><p><strong>LinkedIn:</strong> <a href={content.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/valibasha6 ↗</a></p><p>{content.relocation}</p></div></div>}
    </aside>
    {sceneError && <p className="scene-error" role="status">{sceneError}</p>}{isMobile && <div className="mobile-note">3D mouse-look is desktop-only. Use section navigation to explore all portfolio content.</div>}
    <footer className="site-footer">© {new Date().getFullYear()} Shaik Vali Basha · WebGL / Three.js</footer>
  </main>;
}

export default App;
