"use strict";

class Baalti {
  constructor () {
    // Common variables
    this.objects = [];
    // Scene
    this.scene = new THREE.Scene();
    // Methods
    this.renderHelper(); // Rendering
    this.cameraHelper(); // Camera
    this.controlsHelper(); // Controls
    this.gridHelper(); // The Grid
    this.factoryHelper(625); // Create spheres
    this.dragControlsHelper(); // dragControls
    this.drawCirclesHelper(); // Draw circles...
    // Add the output of the renderer
    document.body.appendChild(this.renderer.domElement);
    // Events
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  renderHelper () {
    // Rendering
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xdb4437);
  }

  cameraHelper () {
    // Camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 100;
  }

  controlsHelper() {
    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
    // this.controls.maxZoom = 1;
    this.controls.staticMoving = true;
  }

  gridHelper () {
    // Grid
    this.grid = new THREE.GridHelper(50, 25, 0xffffff, 0xffffff);
    this.grid.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 * (Math.PI/180));
    this.scene.add(this.grid);
  }

  dragControlsHelper () {
    // dragControls
    this.dragControls = new THREE.DragControls(this.objects, this.camera, this.renderer.domElement);
    this.dragControls.addEventListener('dragstart', (event) => { this.controls.enabled = false; });
    this.dragControls.addEventListener('dragend', (event) => {
      let currObjectPosX, currObjectPosY;
      this.controls.enabled = true;
      event.object.position.z = 0;

      // Current object position and round()
      currObjectPosX = Math.round(event.object.position.x);
      currObjectPosY = Math.round(event.object.position.y);

      let fixedObjectPosX, fixedObjectPosY;

      console.log("X: " + currObjectPosX % 4);
      console.log("Y: " + currObjectPosY % 4);

      // X
      fixedObjectPosX = (currObjectPosX % 4) ===  1 ? currObjectPosX - (currObjectPosX % 4) : currObjectPosX + (currObjectPosX % 4);
      fixedObjectPosX = (currObjectPosX % 4) === -1 ? currObjectPosX + (currObjectPosX % 4) : currObjectPosX - (currObjectPosX % 4);

      fixedObjectPosX = (currObjectPosX % 4) ===  3 ? currObjectPosX - (currObjectPosX % 4) - 2 : currObjectPosX + (currObjectPosX % 4);
      fixedObjectPosX = (currObjectPosX % 4) === -3 ? currObjectPosX + (currObjectPosX % 4) + 2 : currObjectPosX - (currObjectPosX % 4);

      // Y
      fixedObjectPosY = (currObjectPosY % 4) ===  1 ? currObjectPosY - (currObjectPosY % 4) : currObjectPosY + (currObjectPosY % 4);
      fixedObjectPosY = (currObjectPosY % 4) === -1 ? currObjectPosY + (currObjectPosY % 4) : currObjectPosY - (currObjectPosY % 4);

      fixedObjectPosY = (currObjectPosY % 4) ===  3 ? currObjectPosY - (currObjectPosY % 4) - 2 : currObjectPosY + (currObjectPosY % 4);
      fixedObjectPosY = (currObjectPosY % 4) === -3 ? currObjectPosY + (currObjectPosY % 4) + 2 : currObjectPosY - (currObjectPosY % 4);

      // Prevent move outside of field
      fixedObjectPosX = fixedObjectPosX < -48 ? -48 : fixedObjectPosX;
      fixedObjectPosX = fixedObjectPosX >  48 ?  48 : fixedObjectPosX;

      fixedObjectPosY = fixedObjectPosY < -48 ? -48 : fixedObjectPosY;
      fixedObjectPosY = fixedObjectPosY >  48 ?  48 : fixedObjectPosY;

      event.object.position.x = fixedObjectPosX;
      event.object.position.y = fixedObjectPosY;
    });
  }

  factoryHelper (count) {
    let set, randPosition, randPositionLen;
    set = new Set();

    while (count--)
      set.add(Math.round(Math.random() * count));

    randPosition = Array.from(set);
    randPositionLen = randPosition.length - 1;

    let colors, colorsLen;
    colors = [0x333333, 0xed5e42, 0x3366FF, 0xCCCC00,
              0xCC6666, 0x999999, 0xCCCCCC, 0xCC3300,
              0x990000, 0x000033];
    colorsLen = colors.length - 1;

    for (let i = 0; i < randPositionLen; i++) {
      // Get random number
      let randColor, basicMaterial;
      randColor = Math.floor(Math.random() * colorsLen);

      // Set default basic material
      basicMaterial = {
        color: colors[randColor],
        transparent: true,
        wireframe: false
      };

      // Create new sphere
      let geometry, material, sphere;
      geometry = new THREE.SphereGeometry(2, 25, 25);
      material = new THREE.MeshBasicMaterial(basicMaterial);
      sphere   = new THREE.Mesh(geometry, material);

      // Add sphere position
      let shift, centering;
      shift = 48; // Shift relative to the center of the grid
      centering = 4;

      // set sphere position
      sphere.position.x = (randPosition[i] % 25) * centering - shift;
      sphere.position.y = Math.floor(randPosition[i] / 25) * centering - shift;

      // Add object on the scene
      this.scene.add(sphere);
      this.objects.push(sphere);
    }
  }

  drawCirclesHelper () {
    let colors, equalArr;

    // Array with colors
    colors = ["#333333", "#ed5e42", "#3366FF", "#CCCC00",
              "#CC6666", "#999999", "#CCCCCC", "#CC3300",
              "#990000", "#000033"];

    // Shuffle array with colors
    // Not return new array
    function shuffle(array) {
      let counter = array.length;

      // While there are elements in the array
      while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }

      return array;
    }

    // Init shuffle...
    shuffle(colors);

    // Create new array
    // TODO: Don't forget about it
    equalArr = [];

    for (let i = 0; i < colors.length; i++) {
      if (i % 2 === 0) {
        equalArr.push([colors[i], colors[i + 1]]);
      } else {
        continue;
      }
    }

    // Draw our circles...
    function drawCircles () {
      let circles = document.querySelectorAll(".circle");
      let setBack = function (elem, indx) {
        elem.style.background = colors[indx];
      };

      [].forEach.call(circles, setBack);
    }

    document.addEventListener('DOMContentLoaded', drawCircles);
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.render();
  }

  render () {
    this.renderer.render(this.scene, this.camera);
  }
}

new Baalti().animate();
