import * as THREE from 'https://cdn.skypack.dev/three@0.124.0';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import { images, scrollTime } from './config.js';
import { Animation, AnimationMix } from './animation.js'




// Получение Холста со страници
const canvas = document.querySelector('#c');

const coordMouse = {
  'x': canvas.clientWidth / 2,
  'y': canvas.clientHeight / 2
}

window.addEventListener('mousemove', event => {
  coordMouse.x = event.x
  coordMouse.y = event.y
})

// Создание рендера
const renderer = new THREE.WebGLRenderer({canvas});

/// Камера /// 
const fov = 40; // fov сокращение от field of view, поле зрения. В этом случае 75 градусов в вертикальном измерении.
const aspect = 2;  // aspect это соотношение сторон холста. По умолчанию холст имеет размер 300x150 пикселей, значит соотношение сторон 300/150 или 2.

// near и far представляют пространство перед камерой, которое будет отображаться. Все, что находится до или после этого диапазона, будет обрезано (не нарисовано).
const near = 0.1; 
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 15);

/// Сцена ///
const scene = new THREE.Scene();
scene.position.set(0, -8, -10)

/// Собздаём объекты ///
const loader = new THREE.TextureLoader();

const imagesObj = []

const imagesPlane = new THREE.Object3D();
imagesPlane.position.set(0, 0, -6)
imagesPlane.rotation.x = -1
imagesPlane.rotation.y = 0
scene.add(imagesPlane);

function createPlane(img, x = 0, y = 0, z = 0) {
  // Для того чтобы подстроить размеры plane под размеры изображения получим сначала изображение
  const image = new MarvinImage();
  image.load(img, () => {
    const width = 10
    const heightPlane = width / image.getWidth() * image.getHeight()

    // Геометрия
    const geometry = new THREE.PlaneGeometry(width, heightPlane, 50, 50)
    
    // Материал
    const texture = loader.load(img)
    const material = new THREE.MeshPhongMaterial({ map: texture })
    
    // Mesh
    const obj = new THREE.Mesh(geometry, material)
    
    obj.position.set(x, y, z)
    
    imagesObj.push(obj)
    imagesPlane.add(obj)
  });
}

images.forEach((img, index) => {
  createPlane(img, 0, index * -10)
})


/// Создаём свет ///

let lightAmbient
{
  const color = 0xFFFFFF;
  const intensity = 0;
  lightAmbient = new THREE.AmbientLight(color, intensity);
  scene.add(lightAmbient);
}

// ----------

const lightSphere = new THREE.Object3D();
lightSphere.position.set(3, 0, 5)
scene.add(lightSphere)

{
  const geometry = new THREE.SphereGeometry(0.02, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
  const sphere = new THREE.Mesh(geometry, material)

  lightSphere.add(sphere)
}

let lightPoint
{
  const color = 0xFFFFFF;
  const intensity = 0.1;
  lightPoint = new THREE.PointLight(color, intensity);
  lightPoint.position.set(-1, 0, -4);
  lightSphere.add(lightPoint)
}

/// Анимации ///

const startAnimation = new AnimationMix(
  new Animation(lightAmbient).to({'intensity': 0.1}, 1500, 100,'ln'),
  new Animation(imagesPlane.position).to({'z': 6}, 1500, 100,'ln'),
)
startAnimation.start()


const scrollDown = new AnimationMix(
  new Animation(imagesPlane.position).to({'y': 10}, scrollTime, 100,'ln'),
  new Animation(scene.rotation).to({'x': 0.5}, scrollTime * 0.5, 100,'lineDown').to({'x': -0.5}, scrollTime * 2, 100,'lineDown'),
)

const scrollUp = scrollDown.reverse()

const startScrollDown = new AnimationMix(
  new Animation(imagesPlane.rotation).to({'x': 1, 'y': 1}, scrollTime, 100,'ln'),
  new Animation(scene.rotation).to({'x': -0.4}, scrollTime * 0.4, 100,'ln').to({'x': 0.4}, scrollTime * 2, 100,'ln'),
  new Animation(scene.position).to({'x': (canvas.clientWidth > 900 ? -3.5 : 0), 'y': 8, 'z': 10}, scrollTime, 100,'ln'),
  new Animation(lightSphere.position).to({'z': -3}, scrollTime, 100,'ln'),
  new Animation(lightPoint).to({'intensity': (canvas.clientWidth > 900 ? 1.3 : 0.7)}, scrollTime, 100,'ln'),
)

const startScrollUp = startScrollDown.reverse()

const endScrollDown = new AnimationMix(
  new Animation(lightSphere.position).to({'x': -15, 'y': -7}, scrollTime * 0.5, 100, 'lineUp')
)

const endScrollUp = new AnimationMix(
  new Animation(lightSphere.position).to({'x': 15, 'y': 7}, scrollTime * 0.5, 100, 'lineDown')
)


export function imagesScrollDown() {
  scrollDown.start()
}

export function imagesScrollUp() {
  scrollUp.start()
}

export function startImagesScrollDown() {
  startScrollDown.start()
}

export function startImagesScrollUp() {
  startScrollUp.start()
}

export function endImagesScrollDown() {
  scrollDown.start()
  endScrollDown.start()
}

export function endImagesScrollUp() {
  scrollUp.start()
  endScrollUp.start()
}



/// Рендер ///
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

let cam_z_start = camera.position.z
let cam_y_start = camera.position.y

function render(time) {
  time *= 0.001;  // конвертировать время в секунды
  
  if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
  }
  
  imagesObj.forEach(plane => {
      for (var c = 0; c < plane.geometry.vertices.length; c++) {
        plane.geometry.vertices[c].z = Math.sin((c  + time * 3) / 2) / 7
      }
      plane.geometry.verticesNeedUpdate = true;
  })

  {
    let k = 1
    let cam_delta_z_real = camera.position.z - cam_z_start
    let cam_delta_z = -k * 2 * (coordMouse.x - canvas.clientWidth / 2) / canvas.clientWidth
  
    camera.position.z += ((cam_delta_z - cam_delta_z_real) / (2 * k)) / 50
  }

  {
    let k = 0.3
    let cam_delta_y_real = camera.position.y - cam_y_start
    let cam_delta_y = -k * 2 * (coordMouse.y - canvas.clientHeight / 2) / canvas.clientHeight
  
    camera.position.y += ((cam_delta_y - cam_delta_y_real) / (2 * k)) / 50
  }

  renderer.render(scene, camera);
  
  requestAnimationFrame(render);
  
}

requestAnimationFrame(render);
