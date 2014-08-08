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

  model: {
    lines: [],
    layer: {},
    rendered: {}
  },

  _init: function(){
    gcview.render.setSize(user.sizex, user.sizey);
    gcview.root.append(gcview.render.domElement);
    gcview.camera.position.x = printer.size.x / 2;
    gcview.camera.position.y = -printer.size.y / 2;
    gcview.camera.position.z = printer.size.z;

    printer.drawOutlines();

    gcview.buffer.camera.x = printer.size.x / 2;
    gcview.buffer.camera.y = printer.size.y / 2;
    gcview.buffer.camera.z = 0;

    gcview.control = new THREE.OrbitControls( gcview.camera );
    gcview.control.target = new THREE.Vector3(gcview.buffer.camera.x, gcview.buffer.camera.y, gcview.buffer.camera.z);

    gcview._animate();
    user._update();
  },

  _draw: function(){
    var linenum = gcview.model.lines.length,
        buff = {x:0,y:0,z:0,p:false,r:false},
        time = 0, // delay in ms
        zchg = 0; // changes on z value

    while(linenum--){
      if((user.ui.val.rendpathtot % 5000) == 0){ time++; }
      user.ui.val.rendpathtot++;
      window.setTimeout(function(){
        line = gcview.model.lines[user.ui.val.rendpathcur];
        user.ui.val.rendpathcur++;

        // select the right layer based on z-value
        if(line.z > buff.z) zchg++;
        if(gcview.model.layer[zchg] == undefined) gcview.model.layer[zchg] = new THREE.Geometry();

        // select print mode based on rapid/printing
        mode = 'move';
        if(line.p) mode = 'fill';
        if(line.r) mode = 'rapd';

        // push new vertices and colors to layer geometry
        gcview.model.layer[zchg].colors.push(gclib.colors[mode]);
        gcview.model.layer[zchg].colors.push(gclib.colors[mode]);
        gcview.model.layer[zchg].vertices.push(
          new THREE.Vector3(buff.x, buff.y, buff.z),
          new THREE.Vector3(line.x, line.y, line.z)
        );

        // save line to buffer
        buff = line;

        // Display model
        user._update();
        if(user.ui.val.rendpathcur == user.ui.val.rendpathtot){
          user.ui.val.fltlayermax = zchg;
          user._update();
          gcview._display();
        }
      }, time);
    }
  },

  /**
   * Render specific layers
   */
  renderLayers: function(min, max){
    $.each(gcview.model.layer, function(i, layer) {
      if(i >= min && i <= max) gcview.scene.add(gcview.model.rendered[i]);
      else gcview.scene.remove(gcview.model.rendered[i]);
    }); 
  },

  _display: function(){
    $.each(gcview.model.layer, function(i, layer) {
      gcview.model.rendered[i] = new THREE.Line( layer, gclib.materials.plain, THREE.LinePieces );
      gcview.scene.add(gcview.model.rendered[i]);
    }); 
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
