var coefVec = new THREE.Vector3(2, 6, 7);

function init() {
// New scene object
  var scene = new THREE.Scene();

// Build or import 3d objects and add them to scene
  var paraForm = getParaForm();
  paraForm.name = 'paraF';
  scene.add(paraForm);

// Set up lighting
  var pointLight = getPointLight(0.5);
  scene.add(pointLight);
  var directionalLight = getDirectionalLight(1);
  directionalLight.position.x = 13;
  directionalLight.position.y = 10;
  directionalLight.position.z = 10;
  directionalLight.intensity = .5;
  scene.add(directionalLight);

// Set up GUI if desired
  var gui = new dat.GUI();
  gui.add(coefVec, 'x', 0, 16).name("Coefficient 1");
  gui.add(coefVec, 'y', 0, 16).name("Coefficient 2");
  gui.add(coefVec, 'z', 0, 16).name("Coefficient 3");

// Add, position, and orient any cameras
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1,
    1000
  );
  camera.position.x = 10;
  camera.position.y = 10;
  camera.position.z = 10;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

// Add renderer and set initial values
  var renderer = new THREE.WebGLRenderer();
  
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(120, 120, 120)');
  document.getElementById('webgl').appendChild(renderer.domElement);

// Orbit control if desired - be sure to uncomment lines for update call and update function
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Call the function to update the scene
  update(renderer, scene, camera, controls);  // if using orbit controls, use this one:

  // Return the scene to the window
  return scene;
}

// functions for the paraform
function computeXYZ (c1, c2, c3, angle) {
  c1 = Math.floor(c1);
  c2 = Math.floor(c2);
  c3 = Math.floor(c3);
  let x =  3 * (Math.cos((Math.PI/180)*(c1 * angle)) + (Math.cos((Math.PI/180)*(c2 * angle)) / 2) + (Math.sin((Math.PI/180)*(c3 * angle)) / 3)); 
  let y =  3 * (Math.sin((Math.PI/180)*(c1 * angle)) + (Math.sin((Math.PI/180)*(c2 * angle)) / 2) + (Math.cos((Math.PI/180)*(c3 * angle)) / 3));
  let z = -3 * (Math.cos((Math.PI/180)*(c1 * angle)) + (Math.sin((Math.PI/180)*(c2 * angle)) / 2) + (Math.cos((Math.PI/180)*(c3 * angle)) / 3)); 
  let posit = new THREE.Vector3(x, y, z);
  return posit;
}

function do360Sweep(scn) {
  var grp = scn.getObjectByName('paraF');
//  console.log(grp);
  var ang;
  var position;
  for (ang = 0; ang < 360; ang = ang + 1) {
//    position = computeXYZ(coefVec.x, coefVec.y, coefVec.z, ang);
    grp.children[ang].position.x = computeXYZ(coefVec.x, coefVec.y, coefVec.z, ang).x;
    grp.children[ang].position.y = computeXYZ(coefVec.x, coefVec.y, coefVec.z, ang).y;
    grp.children[ang].position.z = computeXYZ(coefVec.x, coefVec.y, coefVec.z, ang).z;
    grp.children[ang].material.color.set(new THREE.Color().setHSL((ang/360), 1, .5));
  }
}

function getParaForm() {
  var group = new THREE.Group();
  var i = 0;
  for (i = 0; i < 360; i++) {
    var orb = getSphere(0.25);
    orb.name = "orb" + i;
    group.add(orb);
  }
  return group;
}
///////////////////////////////////

// Returns a sphere
function getSphere(size) {
  var geometry = new THREE.SphereGeometry(size, 24, 24);
  var material = new THREE.MeshPhongMaterial({
    color: 'rgb(0, 255, 0)',
    metal: 0.8,
    roughness: 0.625
  });
  var mesh = new THREE.Mesh(
    geometry,
    material 
  );
  mesh.receiveShadow = true;
  return mesh;
}

// Returns a point light
function getPointLight(intensity) {
  var light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  return light;
}

// Returns a directional light
function getDirectionalLight(intensity) {
  var light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.camera.left = -15;
  light.shadow.camera.bottom = -15;
  light.shadow.camera.right = 15;
  light.shadow.camera.top = 15;

  return light;
}

// Animation loop below - recursive callback runs until window is closed
//function update(renderer, scene, camera) {
function update(renderer, scene, camera, controls) { // Use this line instead with orbit controls
  //Redner the scene
  renderer.render(
    scene,
    camera
  );
  // Update scene here
  do360Sweep(scene);
  scene.getObjectByName('paraF').rotation.x += 0.005;
  scene.getObjectByName('paraF').rotation.y += 0.005;
  // Callback to get new frame
  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls);
  })
}

// Initialize scene and begin animation loop
var scene = init();  