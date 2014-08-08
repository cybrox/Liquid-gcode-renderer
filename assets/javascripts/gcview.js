/**
 * Liquid GCODE viewer
 *
 * module: gcview
 * Setup, render and animate TREE scene for gcode rendering
 */

 var gcview = {
  root: $('#scene'),
  scene: new THREE.Scene(),
  render: new THREE.WebGLRenderer(),
  camera: new THREE.PerspectiveCamera(45, user.sizex / user.sizey, 1, 10000),
  control: null,

  buffer: {
    camera: {
      x: 0,
      y: 0,
      z: 0
    }
  },

  _init: function(){
    gcview.render.setSize(user.sizex, user.sizey);
    gcview.root.append(gcview.render.domElement);
    gcview.camera.position.x = printer.size.x / 2;
    gcview.camera.position.y = 0;
    gcview.camera.position.z = printer.size.z;

    printer.drawOutlines(materials.mark);

    gcview.buffer.camera.x = printer.size.x / 2;
    gcview.buffer.camera.y = printer.size.y / 2;
    gcview.buffer.camera.z = 0;

    gcview.control = new THREE.OrbitControls( gcview.camera );
    gcview.control.target = new THREE.Vector3(gcview.buffer.camera.x, gcview.buffer.camera.y, gcview.buffer.camera.z);

    gcview._animate();
    user._update();
  },

  _draw: function(lines){
    console.log(lines);

  },

  _animate: function(){
    gcview.control.update();
    gcview.render.render(gcview.scene, gcview.camera);
    requestAnimationFrame(function(){ gcview._animate(); });
  },

  reset: function(){
    gcview.camera.position.x = printer.size.x / 2;
    gcview.camera.position.y = 0;
    gcview.camera.position.z = 0;
    gcview.buffer.camera.x = printer.size.x / 2;
    gcview.buffer.camera.y = printer.size.y / 2;
    gcview.buffer.camera.z = printer.size.z / 2;
    gcview.control.reset();
    gcview.control.target = new THREE.Vector3(gcview.buffer.camera.x, gcview.buffer.camera.y, gcview.buffer.camera.z);
  },
}
