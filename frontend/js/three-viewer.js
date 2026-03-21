// Three.js 3D Viewer Integration

let homeScene, homeCamera, homeRenderer, homeMesh;
let detailScene, detailCamera, detailRenderer, detailMesh;

// --- Procedural 3D Clay System ---
function createClayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  // Base earthy terracotta color
  ctx.fillStyle = '#b8593a';
  ctx.fillRect(0,0,512,512);
  
  // High-frequency noise for clay grain bump and albedo detail
  for(let i=0; i<40000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    ctx.fillRect(Math.random()*512, Math.random()*512, Math.random()*2+1, Math.random()*2+1);
  }
  // Horizontal rings to simulate a traditional potter's wheel
  for(let y=0; y<512; y+=8) {
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(0, y, 512, Math.random()*4+1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createRealisticPot() {
  const points = [];
  points.push(new THREE.Vector2(0.01, -1.2)); // center base
  points.push(new THREE.Vector2(0.5, -1.2));  // flat base
  
  // Gorgeous belly curve
  for (let i = 0; i <= 25; i++) {
    const t = i / 25;
    const x = 0.5 + Math.sin(t * Math.PI) * 0.95; 
    const y = -1.2 + t * 1.8;
    points.push(new THREE.Vector2(x, y));
  }
  
  // Tapered neck
  points.push(new THREE.Vector2(0.7, 0.7));
  points.push(new THREE.Vector2(0.55, 0.9));
  
  // Sculpted decorative flared rim
  points.push(new THREE.Vector2(0.9, 1.0));
  points.push(new THREE.Vector2(0.95, 1.05));
  points.push(new THREE.Vector2(0.85, 1.1));
  points.push(new THREE.Vector2(0.4, 1.05)); // inner rim depth
  points.push(new THREE.Vector2(0.01, -1.15)); // hollow inside

  const geometry = new THREE.LatheGeometry(points, 128);
  const tex = createClayTexture();
  const material = new THREE.MeshStandardMaterial({ 
    map: tex,
    bumpMap: tex,
    bumpScale: 0.08, // Physically offsets lighting based on noise!
    roughness: 1.0,
    metalness: 0.0,
    side: THREE.DoubleSide
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

// --- Procedural 3D Wood System ---
function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // Base teak/sandalwood color
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(0,0,512,512);
  
  // Draw randomized rich grain lines
  ctx.globalAlpha = 0.4;
  for(let i=0; i<300; i++) {
    ctx.strokeStyle = Math.random() > 0.5 ? '#5c3a21' : '#b87333';
    ctx.lineWidth = Math.random() * 4 + 1;
    ctx.beginPath();
    const xOffset = Math.random() * 512;
    ctx.moveTo(xOffset, 0);
    // Wavy curve to simulate organic wood grains
    ctx.bezierCurveTo(xOffset + Math.random()*40-20, 170, xOffset + Math.random()*60-30, 340, xOffset + Math.random()*20-10, 512);
    ctx.stroke();
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  // Ensure it tiles perfectly over the 3D meshes
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createRealisticElephant() {
  const group = new THREE.Group();
  
  const tex = createWoodTexture();
  const material = new THREE.MeshStandardMaterial({
    map: tex,
    bumpMap: tex,
    bumpScale: 0.05, // deep handcarved texture feeling
    roughness: 0.9,
    metalness: 0.1,
  });

  // Elephant Body (elongated & heavily scaled sphere)
  const bodyGeo = new THREE.SphereGeometry( 0.7, 32, 32 );
  const body = new THREE.Mesh( bodyGeo, material );
  body.scale.set(1, 0.85, 1.3);
  body.position.set(0, 0.8, 0);
  group.add(body);

  // Elephant Head
  const headGeo = new THREE.SphereGeometry( 0.5, 32, 32 );
  const head = new THREE.Mesh( headGeo, material );
  head.position.set(0, 1.1, 0.9);
  group.add(head);

  // Trunk (Torus arching downwards simulating a curled trunk)
  const trunkGeo = new THREE.TorusGeometry( 0.5, 0.15, 16, 32, Math.PI * 0.7 );
  const trunk = new THREE.Mesh( trunkGeo, material );
  trunk.position.set(0, 0.6, 1.25);
  trunk.rotation.y = Math.PI / 2;
  trunk.rotation.x = Math.PI / 8;
  group.add(trunk);

  // Ears (squashed wide spheres)
  const earGeo = new THREE.SphereGeometry( 0.4, 32, 16 );
  
  const leftEar = new THREE.Mesh( earGeo, material );
  leftEar.scale.set(1, 1, 0.15);
  leftEar.position.set(0.5, 1.1, 0.8);
  leftEar.rotation.y = -Math.PI / 5;
  group.add(leftEar);

  const rightEar = new THREE.Mesh( earGeo, material );
  rightEar.scale.set(1, 1, 0.15);
  rightEar.position.set(-0.5, 1.1, 0.8);
  rightEar.rotation.y = Math.PI / 5;
  group.add(rightEar);

  // 4 Legs (Cylinders)
  const legGeo = new THREE.CylinderGeometry( 0.2, 0.15, 0.8, 32 );
  const legPositions = [
    [0.35, 0.4, 0.6],  [-0.35, 0.4, 0.6], // Front
    [0.35, 0.4, -0.6], [-0.35, 0.4, -0.6] // Back
  ];
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh( legGeo, material );
    leg.position.set(...pos);
    group.add(leg);
  });

  // White Tusks (Cones)
  const tuskMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const tuskGeo = new THREE.ConeGeometry( 0.05, 0.5, 16 );
  
  const leftTusk = new THREE.Mesh( tuskGeo, tuskMat );
  leftTusk.position.set(0.2, 0.7, 1.4);
  leftTusk.rotation.x = Math.PI / 2.5;
  group.add(leftTusk);

  const rightTusk = new THREE.Mesh( tuskGeo, tuskMat );
  rightTusk.position.set(-0.2, 0.7, 1.4);
  rightTusk.rotation.x = Math.PI / 2.5;
  group.add(rightTusk);
  
  // Return the entire grouped artifact
  group.position.y = -0.5; // Plant legs on center origin
  return group;
}

document.addEventListener('DOMContentLoaded', () => {
  initHomeViewer();
});

// Initialize 3D Viewer on Homepage
function initHomeViewer() {
  const container = document.getElementById('sample-3d-container');
  if(!container) return;

  // Setup Scene
  homeScene = new THREE.Scene();
  // Slightly transparent to let background texture show, or pick an earthy tone
  homeScene.background = null; 

  // Setup Camera
  homeCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  homeCamera.position.z = 5;

  // Setup Renderer
  homeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  homeRenderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(homeRenderer.domElement);

  // Add Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  homeScene.add(ambientLight);
  
  const dirLight = new THREE.DirectionalLight(0xfff0dd, 0.8);
  dirLight.position.set(5, 5, 5);
  homeScene.add(dirLight);

  // Create Photorealistic "Terracotta Pottery" 3D Mesh
  homeMesh = createRealisticPot();
  // Adjust scale to fit beautifully in the viewer
  homeMesh.scale.set(1.2, 1.2, 1.2);
  homeMesh.position.y = 0.2;
  
  homeScene.add(homeMesh);

  // Orbit Controls
  const controls = new THREE.OrbitControls(homeCamera, homeRenderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.0;

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    homeRenderer.render(homeScene, homeCamera);
  }
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    homeCamera.aspect = container.clientWidth / container.clientHeight;
    homeCamera.updateProjectionMatrix();
    homeRenderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// Global hook for Product Detail Viewer
window.initDetail3DViewer = function(productId) {
  const container = document.getElementById('product-3d-container');
  if(!container) return;
  
  // Clear any existing canvas
  const existingCanvas = container.querySelector('canvas');
  if(existingCanvas) {
    existingCanvas.remove();
  }

  // Setup Scene
  detailScene = new THREE.Scene();
  
  // Determine if Dark Theme to switch background
  const isDark = document.body.classList.contains('dark-mode');
  detailScene.background = new THREE.Color(isDark ? 0x241c19 : 0xfdfaf6);

  // Camera
  // Width and Height of the container, defaulting to 500px if hidden
  const w = container.clientWidth || 500;
  const h = container.clientHeight || 500;
  
  detailCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  detailCamera.position.z = 4;

  // Renderer
  detailRenderer = new THREE.WebGLRenderer({ antialias: true });
  detailRenderer.setSize(w, h);
  container.appendChild(detailRenderer.domElement);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  detailScene.add(ambient);
  const pointLight = new THREE.PointLight(0xffddaa, 1, 100);
  pointLight.position.set(10, 10, 10);
  detailScene.add(pointLight);

  // Mesh Selector Logic based on specific categories
  if(productId === 'p2') {
    // Photorealistic Clay Pot
    detailMesh = createRealisticPot();
    detailMesh.scale.set(1.5, 1.5, 1.5);
    detailScene.add(detailMesh);
  } else if (productId === 'p4') {
    // Photorealistic Hand-carved Wooden Elephant Group!
    const familyGroup = new THREE.Group();
    
    // Papa Elephant (Front/Large)
    const papa = createRealisticElephant();
    papa.scale.set(1.0, 1.0, 1.0);
    papa.position.set(1.5, -0.3, 0);
    familyGroup.add(papa);

    // Mama Elephant (Middle/Medium)
    const mama = createRealisticElephant();
    mama.scale.set(0.75, 0.75, 0.75);
    mama.position.set(0, -0.55, 0);
    familyGroup.add(mama);

    // Baby Elephant (Back/Small)
    const baby = createRealisticElephant();
    baby.scale.set(0.5, 0.5, 0.5);
    baby.position.set(-1.1, -0.8, 0);
    familyGroup.add(baby);

    // Center the whole family cluster inside the camera view
    familyGroup.position.set(-0.2, 0.5, 0);

    detailMesh = familyGroup;
    detailScene.add(detailMesh);
  } else {
    // Fallback Abstract Geometry
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let material = new THREE.MeshStandardMaterial({ 
      color: 0xc04c36,
      roughness: 0.9,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    detailMesh = new THREE.Mesh(geometry, material);
    detailScene.add(detailMesh);
  }

  // Controls
  const controls = new THREE.OrbitControls(detailCamera, detailRenderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  function animateDetail() {
    requestAnimationFrame(animateDetail);
    controls.update();
    detailRenderer.render(detailScene, detailCamera);
  }
  animateDetail();

  // Detail Viewer Resize handler
  window.addEventListener('resize', () => {
    if(!container.clientWidth) return;
    detailCamera.aspect = container.clientWidth / container.clientHeight;
    detailCamera.updateProjectionMatrix();
    detailRenderer.setSize(container.clientWidth, container.clientHeight);
  });
};
