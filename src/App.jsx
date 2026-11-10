import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const portfolioData = {
  about: {
    title: 'About Me',
    summary:
      'I am Shaik Vali Basha, a BCA graduate in Data Science and a current MCA student. I enjoy data analysis, AI exploration, content creation, and turning ideas into clear stories and usable digital experiences.',
    bulletPoints: [
      'BCA in Data Science from Krishna Chaitanya Degree College',
      'MCA expected April 2027 at The Krishna Chaitanya Institute of Science and Technology',
      'Open to entry-level IT, data analytics, and technology support opportunities'
    ]
  },
  skills: {
    title: 'Skills & Tools',
    tags: ['Python', 'Java', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Data Visualization', 'AI Tools', 'Report Writing']
  },
  projects: {
    title: 'Projects',
    items: [
      {
        name: 'Sales Analytics & Dashboard Reporting',
        description: 'Built dashboards to visualize sales trends, KPIs, and regional performance with SQL-connected reporting.'
      },
      {
        name: 'Structured Data Pattern Analysis',
        description: 'Used Python and ML techniques to investigate patterns in structured datasets and present the insights clearly.'
      }
    ]
  },
  internships: {
    title: 'Internships',
    items: [
      'AI Transformative Learning Intern — TechSaksham (Microsoft & SAP CSR, AICTE Recognized)',
      'Data Analytics using AI-LLMs Intern — AICTE / Vodafone Idea Foundation / VOIS for Tech',
      'AI/ML Data Analysis Intern — Next24tech Technology and Services'
    ]
  },
  content: {
    title: 'Content Creation',
    links: [
      { label: 'MindBodha', href: 'https://www.instagram.com/mindbodha?cplk=b2F2dnV6NWV1M2Np' },
      { label: 'MindBodha YouTube', href: 'https://youtube.com/@mindbodha?si=PFxzFDOeYev4zhrL' },
      { label: 'BujjiBlitz', href: 'https://www.instagram.com/bujjiblitz?psln=MTZ6djE5eGV5dHVpZA==' },
      { label: 'BujjiBlitz YouTube', href: 'https://youtube.com/@bujjiblitz?si=LsuZ4igcjVIsUOyk' },
      { label: 'TrulyValli', href: 'https://www.instagram.com/trulyvalli?rpxt=MXhldXZqcWI5dWQ4cg==' },
      { label: 'TrulyValli YouTube', href: 'https://youtube.com/@trulyvalli?si=xFzINlty0yCBJHDh' }
    ]
  },
  contact: {
    title: 'Contact',
    details: {
      phone: '+91-8639563286',
      email: 'skvallibasha6@gmail.com',
      location: 'Nellore, Andhra Pradesh',
      linkedin: 'https://www.linkedin.com/in/valibasha6',
      relocation: 'Open to relocate Pan India'
    }
  }
};

const interactables = [
  { id: 'about', position: [8, 1.4, 6.5], label: 'About Me' },
  { id: 'skills', position: [2.5, 1.3, -10], label: 'Skills' },
  { id: 'projects', position: [-10, 1.4, 2], label: 'Projects' },
  { id: 'content', position: [-12, 1.4, -8], label: 'Content' },
  { id: 'internships', position: [12, 1.5, -12], label: 'Internships' },
  { id: 'contact', position: [-2, 1.3, 11], label: 'Contact' }
];

function App() {
  const mountRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [activePanel, setActivePanel] = useState('about');
  const [activeTitle, setActiveTitle] = useState('About Me');
  const [activeContent, setActiveContent] = useState(portfolioData.about);
  const [mobileHint, setMobileHint] = useState('');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#b9d4e2');
    scene.fog = new THREE.Fog('#b9d4e2', 25, 95);

    const camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(12, 2, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    const ambient = new THREE.HemisphereLight('#dfeaf6', '#4b5b42', 1.7);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight('#fff8ef', 1.1);
    sun.position.set(18, 28, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 80;
    scene.add(sun);

    // Ground and terrain
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(58, 128),
      new THREE.MeshStandardMaterial({
        color: '#49684a',
        roughness: 1,
        metalness: 0.02
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: '#6a7d5c',
      roughness: 1,
      metalness: 0
    });

    const hills = new THREE.Group();
    for (let i = 0; i < 28; i += 1) {
      const hill = new THREE.Mesh(
        new THREE.ConeGeometry(5 + Math.random() * 7, 8 + Math.random() * 9, 24),
        terrainMaterial
      );
      hill.position.set(
        (Math.random() - 0.5) * 90,
        2 + Math.random() * 7,
        (Math.random() - 0.5) * 90
      );
      hill.rotation.z = Math.random() * 2 * Math.PI;
      hill.castShadow = true;
      hill.receiveShadow = true;
      hills.add(hill);
    }
    scene.add(hills);

    // Trees
    const treeGeometry = new THREE.CylinderGeometry(0.18, 0.22, 2.2, 8);
    const leafMaterial = new THREE.MeshStandardMaterial({ color: '#2d5a3a', roughness: 1 });
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#53391d', roughness: 1 });
    const treeGroup = new THREE.Group();
    for (let i = 0; i < 90; i += 1) {
      const trunk = new THREE.Mesh(treeGeometry, trunkMaterial);
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.25 + Math.random() * 0.75, 18, 18), leafMaterial);
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;
      trunk.position.set(x, 1.1, z);
      foliage.position.set(x, 3.5 + Math.random() * 0.7, z);
      foliage.scale.y = 0.9 + Math.random() * 0.5;
      foliage.castShadow = true;
      foliage.receiveShadow = true;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);
      treeGroup.add(foliage);
    }
    scene.add(treeGroup);

    // Water body
    const lake = new THREE.Mesh(
      new THREE.CircleGeometry(10, 64),
      new THREE.MeshPhysicalMaterial({
        color: '#70a4d8',
        transparent: true,
        opacity: 0.82,
        transmission: 0.5,
        roughness: 0.2,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.2
      })
    );
    lake.rotation.x = -Math.PI / 2;
    lake.position.set(24, 0.15, -22);
    scene.add(lake);

    // Rocks
    const rockMaterial = new THREE.MeshStandardMaterial({ color: '#6d6f70', roughness: 1 });
    for (let i = 0; i < 22; i += 1) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6 + Math.random() * 1.1, 0), rockMaterial);
      rock.position.set((Math.random() - 0.5) * 70, 0.5, (Math.random() - 0.5) * 70);
      rock.scale.set(1, 0.75 + Math.random() * 0.5, 1);
      rock.castShadow = true;
      rock.receiveShadow = true;
      scene.add(rock);
    }

    // Mansion
    const mansion = new THREE.Group();
    const wallMaterial = new THREE.MeshStandardMaterial({ color: '#d9dfe6', roughness: 0.9, metalness: 0.08 });
    const accentMaterial = new THREE.MeshStandardMaterial({ color: '#515b68', roughness: 0.8, metalness: 0.18 });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: '#a7dfff',
      transparent: true,
      opacity: 0.72,
      transmission: 0.5,
      roughness: 0.1,
      metalness: 0.15,
      clearcoat: 1
    });
    const floorMaterial = new THREE.MeshStandardMaterial({ color: '#9ea7b5', roughness: 0.95, metalness: 0.04 });

    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(14, 7.5, 10), wallMaterial);
    mainBody.position.set(0, 4.2, 0);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    mansion.add(mainBody);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.8, 11.2), accentMaterial);
    roof.position.set(0, 8.6, 0);
    roof.castShadow = true;
    roof.receiveShadow = true;
    mansion.add(roof);

    const entry = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.6, 0.4), wallMaterial);
    entry.position.set(0, 1.9, 5.1);
    mansion.add(entry);

    const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.2, 0.14), new THREE.MeshStandardMaterial({ color: '#35271a', roughness: 0.8 }));
    door.position.set(0, 1.7, 5.26);
    mansion.add(door);

    for (let i = 0; i < 8; i += 1) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.12), glassMaterial);
      const x = -5 + i * 1.45;
      const z = 5.12;
      win.position.set(x, 4.2, z);
      mansion.add(win);
    }

    for (let i = 0; i < 6; i += 1) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.12), glassMaterial);
      win.position.set(-4.5 + i * 1.8, 4.2, -5.12);
      mansion.add(win);
    }

    // Room-wing additions
    const wing1 = new THREE.Mesh(new THREE.BoxGeometry(9, 5.6, 8), wallMaterial);
    wing1.position.set(-13.5, 3.2, 4.2);
    mansion.add(wing1);

    const wing2 = new THREE.Mesh(new THREE.BoxGeometry(9, 5.6, 8), wallMaterial);
    wing2.position.set(13.5, 3.2, -4.4);
    mansion.add(wing2);

    const floor = new THREE.Mesh(new THREE.BoxGeometry(21, 0.8, 14), floorMaterial);
    floor.position.set(0, 0.45, 0);
    mansion.add(floor);

    mansion.position.set(0, 0.2, 0);
    scene.add(mansion);

    // Light pillars to indicate interactable points
    const interactableMeshes = [];
    interactables.forEach((item) => {
      const marker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 1.1, 18),
        new THREE.MeshStandardMaterial({ color: '#9fe2ff', emissive: '#4cc5ff', emissiveIntensity: 0.8, metalness: 0.2, roughness: 0.3 })
      );
      marker.position.set(item.position[0], item.position[1], item.position[2]);
      marker.castShadow = true;
      scene.add(marker);
      interactableMeshes.push({ ...item, marker });
    });

    const clock = new THREE.Clock();
    const moveState = { forward: false, backward: false, left: false, right: false };

    const keys = {
      KeyW: 'forward',
      KeyS: 'backward',
      KeyA: 'left',
      KeyD: 'right'
    };

    const onKeyDown = (event) => {
      if (keys[event.code]) {
        moveState[keys[event.code]] = true;
      }
      if (event.code === 'KeyE') {
        const playerPos = controls.getObject().position;
        const closest = interactableMeshes.reduce((best, obj) => {
          const dist = playerPos.distanceTo(new THREE.Vector3(...obj.position));
          return dist < best.dist ? { dist, obj } : best;
        }, { dist: Infinity, obj: null });

        if (closest.obj) {
          const key = closest.obj.id;
          const section = portfolioData[key];
          if (section) {
            setActivePanel(key);
            setActiveTitle(section.title);
            setActiveContent(section);
          }
        }
      }
    };

    const onKeyUp = (event) => {
      if (keys[event.code]) {
        moveState[keys[event.code]] = false;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    const startInteraction = () => {
      setStarted(true);
      controls.lock();
    };

    const startButton = document.getElementById('startButton');
    startButton?.addEventListener('click', startInteraction);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onResize);

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.033);
      const speed = 8.5;

      if (controls.isLocked) {
        if (moveState.forward) controls.moveForward(speed * delta);
        if (moveState.backward) controls.moveForward(-speed * delta);
        if (moveState.left) controls.moveRight(-speed * delta);
        if (moveState.right) controls.moveRight(speed * delta);

        const pos = controls.getObject().position;
        const xLimit = 32;
        const zLimit = 32;
        pos.x = THREE.MathUtils.clamp(pos.x, -xLimit, xLimit);
        pos.z = THREE.MathUtils.clamp(pos.z, -zLimit, zLimit);
        pos.y = 1.7;
      }

      lake.material.emissiveIntensity = 0.1 + Math.sin(performance.now() * 0.0015) * 0.1;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      startButton?.removeEventListener('click', startInteraction);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  const roomContent = useMemo(() => portfolioData[activePanel] || portfolioData.about, [activePanel]);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    if (mobile) setMobileHint('Tap Start Exploring, then use WASD and mouse to roam.');
  }, []);

  return (
    <div className="app-shell">
      <div className="hud">
        <div className="hud-pill">Vali Basha Shaik</div>
        <div className="hud-pill alt">Open-world portfolio</div>
      </div>

      <div className="start-overlay" style={{ opacity: started ? 0 : 1, pointerEvents: started ? 'none' : 'auto' }}>
        <div className="welcome-panel">
          <p className="eyebrow">Immersive portfolio</p>
          <h1>Vali Basha Shaik</h1>
          <p className="tagline">Content Creator · Video Editor · Data Science Enthusiast · AI Enthusiast</p>
          <button id="startButton" className="primary-btn">Start Exploring</button>
          <div className="controls-box">
            <span>W A S D to move</span>
            <span>Mouse to look</span>
            <span>E to interact</span>
            <span>ESC to release pointer</span>
          </div>
          <p className="small-note">{mobileHint || 'Use desktop controls for the full immersive experience.'}</p>
        </div>
      </div>

      <div ref={mountRef} className="scene-wrap" />

      <div className="info-panel">
        <div className="panel-topbar">
          <span className="panel-label">{activeTitle}</span>
          <span className="panel-ghost">Press E near glowing markers</span>
        </div>

        {roomContent.title === 'About Me' && (
          <>
            <p>{roomContent.summary}</p>
            <ul>
              {roomContent.bulletPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {roomContent.title === 'Skills & Tools' && (
          <div className="tag-grid">
            {roomContent.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}

        {roomContent.title === 'Projects' && (
          <div className="stack-list">
            {roomContent.items.map((item) => (
              <div key={item.name} className="stack-item">
                <strong>{item.name}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {roomContent.title === 'Internships' && (
          <ul>
            {roomContent.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {roomContent.title === 'Content Creation' && (
          <div className="link-list">
            {roomContent.links.map((link) => (
              <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>{link.label}</a>
            ))}
          </div>
        )}

        {roomContent.title === 'Contact' && (
          <ul>
            <li>Phone: {roomContent.details.phone}</li>
            <li>Email: {roomContent.details.email}</li>
            <li>Location: {roomContent.details.location}</li>
            <li>LinkedIn: <a href={roomContent.details.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/valibasha6</a></li>
            <li>{roomContent.details.relocation}</li>
          </ul>
        )}
      </div>

      <div className="mini-nav">
        {Object.keys(portfolioData).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActivePanel(key);
              setActiveTitle(portfolioData[key].title);
              setActiveContent(portfolioData[key]);
            }}
            className={activePanel === key ? 'active' : ''}
          >
            {portfolioData[key].title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
