////////////////////////////////////////////
//   "Aurora Smith-ealis"
//   A Madman's experiments with THREE.js
//   "Making the most of the pandemic"
//   December 2020
//   Original code by David Gail Smith
////////////////////////////////////////////
var v1 = Math.floor(Math.random() * 15 + 1);
var v2 = Math.floor(Math.random() * 15 + 1);
var v3 = Math.floor(Math.random() * 15 + 1);
console.log(v1, v2, v3);
var coefVec = new THREE.Vector3(v1, v2, v3);
var twn = [];
var change = true;
var twnLen = 20000;

function init() {
  // New scene object
  var scene = new THREE.Scene();
  // Build or import 3d objects and add them to scene
  var paraForm = getParaForm();
  paraForm.name = "paraF";
  scene.add(paraForm);
  // Set up camera
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 11;
  camera.position.y = 11;
  camera.position.z = 11;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  // Add renderer and set initial values
  var renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(0, 0, 0)");
  document.getElementById("webgl").appendChild(renderer.domElement);
  // Orbit control if desired - be sure to uncomment lines for update call and update function
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  update(renderer, scene, camera, controls); // if using orbit controls, use this one:
  resizeRendererToDisplaySize(renderer);
  // Return the scene to the window
  return scene;
}

// functions for the paraform
function computeXYZ(c1, c2, c3, angle) {
  c1 = Math.floor(c1);
  c2 = Math.floor(c2);
  c3 = Math.floor(c3);
  let x =
    3 *
    (Math.cos((Math.PI / 180) * (c1 * angle)) +
      Math.cos((Math.PI / 180) * (c2 * angle)) / 2 +
      Math.sin((Math.PI / 180) * (c3 * angle)) / 3);
  let y =
    3 *
    (Math.sin((Math.PI / 180) * (c1 * angle)) +
      Math.sin((Math.PI / 180) * (c2 * angle)) / 2 +
      Math.cos((Math.PI / 180) * (c3 * angle)) / 3);
  let z =
    -3 *
    (Math.cos((Math.PI / 180) * (c1 * angle)) +
      Math.sin((Math.PI / 180) * (c2 * angle)) / 2 +
      Math.cos((Math.PI / 180) * (c3 * angle)) / 3);
  let posit = new THREE.Vector3(x, y, z);
  return posit;
}

function do360Sweep(scn) {
  var grp = scn.getObjectByName("paraF");
  var ang;
  var posit;
  for (ang = 0; ang < 359; ang = ang + 1) {
    posit = computeXYZ(coefVec.x, coefVec.y, coefVec.z, ang);
    var coords = grp.children[ang].position;
    twn[ang] = new TWEEN.Tween(coords)
      .to({ x: posit.x, y: posit.y, z: posit.z }, twnLen)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    grp.children[ang].material.color.set(
      new THREE.Color().setHSL((ang / 360) * (200 / 360) + 160 / 360, 1, 0.5)
    );
    grp.children[ang].material.emissive.set(
      new THREE.Color().setHSL((ang / 360) * (200 / 360) + 160 / 360, 1, 0.5)
    );
  }
  change = false;
  posit = computeXYZ(coefVec.x, coefVec.y, coefVec.z, 359);
  coords = grp.children[359].position;
  twn[359] = new TWEEN.Tween(coords)
    .to({ x: posit.x, y: posit.y, z: posit.z }, twnLen)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onComplete(() => {
      coefVec.x++;
      change = true;
      if (coefVec.x > 16) {
        coefVec.x = 1;
        coefVec.y++;
        if (coefVec.y > 16) {
          coefVec.y = 1;
          coefVec.z++;
          if (coefVec.z > 16) {
            coefVec.z = 1;
          }
        }
      }
    })
    .start();
  grp.children[359].material.color.set(
    new THREE.Color().setHSL((359 / 360) * (200 / 360) + 160 / 360, 1, 0.5)
  );
  grp.children[359].material.emissive.set(
    new THREE.Color().setHSL((359 / 360) * (200 / 360) + 160 / 360, 1, 0.5)
  );
}

function getParaForm() {
  var group = new THREE.Group();
  var i = 0;
  for (i = 0; i < 360; i++) {
    var orb = getNode();
    orb.name = "orb" + i;
    twn[i] = new TWEEN.Tween(orb.position);
    group.add(orb);
  }
  return group;
}

function getNode() {
  var geometry = new THREE.SphereGeometry(1, 25, 25);
  var material = new THREE.MeshLambertMaterial({
    emissive: "rgb(0, 255, 0)",
    emissiveIntensity: 0.75,
    opacity: 0.075,
    transparent: true,
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
// Animation loop below - recursive callback runs until window is closed
function update(renderer, scene, camera, controls) {
  // Use this line instead with orbit controls
  //Redner the scene
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
  // Update scene here
  if (change == true) {
    do360Sweep(scene);
  }
  scene.getObjectByName("paraF").rotation.x += 0.0025;
  scene.getObjectByName("paraF").rotation.y += 0.002;
  scene.getObjectByName("paraF").rotation.z += 0.0015;
  // Callback to get new frame
  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls);
    TWEEN.update();
  });
}

// Initialize scene and begin animation loop
var scene = init();
