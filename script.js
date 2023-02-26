import * as THREE from "./build/three.module.js";
import { FlyControls } from "./jsm/controls/FlyControls.js";
import { Lensflare, LensflareElement } from "./jsm/objects/Lensflare.js";

// three.jsに必要な３つの要素
let camera, scene, renderer;
let controls;

const clock = new THREE.Clock(); //　経過時間を計測するオブジェクト

init();

function init() {
  // camera
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    15000
  );

  camera.position.z = 250;

  //scene
  scene = new THREE.Scene();

  //geometry
  const size = 250;
  const geometry = new THREE.BoxGeometry(size, size, size); //Boxのサイズを指定
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff, //色
    specular: 0xffffff, //反射
    shininess: 50, //輝度
  }); //Boxの見た目を指定

  //Boxを2500個生成
  for (let i = 0; i < 2500; i++) {
    // Boxを生成
    const mesh = new THREE.Mesh(geometry, material);

    // 座標の指定
    mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

    // 回転度合いをランダムに決める
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;

    // sceneへの追加
    scene.add(mesh);
  }

  // 平行光源の指定
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
  scene.add(dirLight);

  // レンズフレアの追加
  const textureLoader = new THREE.TextureLoader();
  const textureFlare = textureLoader.load("./image/LensFlare.png");

  // 光源の追加
  addLight(0.08, 0.3, 0.9, 0, 0, -1000);
  // ポイント光源を追加
  function addLight(hue, saturation, lightness, x, y, z) {
    const light = new THREE.PointLight(0xffffff, 1.5, 2000);
    light.color.setHSL(hue, saturation, lightness);
    light.position.set(x, y, z);
    scene.add(light);

    //lensflareの設定
    const lensflare = new Lensflare();
    lensflare.addElement(
      new LensflareElement(textureFlare, 700, 0, light.color)
    );
    scene.add(lensflare);
  }

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  // bodyの中に追加（canvasを作ってからでもOK)
  document.body.appendChild(renderer.domElement);

  // マウス操作を行う
  controls = new FlyControls(camera, renderer.domElement);
  controls.movementSpeed = 2500;
  controls.rollSpeed = Math.PI / 20;

  animate();
  // レンダリング
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); //　経過した時間を取得
  controls.update(delta);
  renderer.render(scene, camera);
}
