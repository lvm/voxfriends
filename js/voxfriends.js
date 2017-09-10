var select = document.querySelector("select");
var anchor = document.createElement("a");
anchor.href = window.location.href;

var scene = new THREE.Scene();
var mouse = new THREE.Vector2();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 25;
camera.position.z = 100;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor(0xf9ffe0);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT,
    ZOOM: THREE.MOUSE.MIDDLE,
    PAN: THREE.MOUSE.LEFT
};
controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.rotateSpeed = 0.5;
controls.maxPolarAngle = Math.PI / 2;

var ambientLight = new THREE.AmbientLight(0xffffff);
var spotLight = new THREE.SpotLight(0xAAAAAA);
spotLight.position.set(2, 3, 3);
spotLight.castShadow = true;
spotLight.shadow.bias = 0.0001;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
scene.add(ambientLight);
scene.add(spotLight);

var parser = new vox.Parser();
var render_voxel = function(voxelData) {
    var builder = new vox.MeshBuilder(voxelData);
    var mesh = builder.createMesh();
    mesh.position.set(0, 0, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    scene.children.pop();
    scene.add(mesh);
};
var chr_vox = anchor.search ? anchor.search.replace("?", "") : "chr_grey";
window.history.pushState( {}, "voxfriends", anchor.pathname + "?" + chr_vox);
parser.parse("vox/"+chr_vox+".vox").then(render_voxel);

select.addEventListener("change", function(){
    window.history.pushState( {}, "voxfriends", anchor.pathname + "?" + this.value);
    parser.parse("vox/"+this.value+".vox").then(render_voxel);
});

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();
