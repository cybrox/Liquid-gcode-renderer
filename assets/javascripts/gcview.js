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
    render: {
      fill: null,
      move: null,
      rapd: null,
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

  _draw: function(){
    var linenum = gcview.model.lines.length,
        buff = {x:0,y:0,z:0},
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
        if(gcview.model.layer[zchg] == undefined) gcview.model.layer[zchg] = {};

        // select print mode based on rapid/printing
        mode = 'move';
        if(line.p) mode = 'fill';
        if(line.r) mode = 'rapd';

        // create line geometry
        obj = new THREE.Geometry();
        obj.vertices.push(
          new THREE.Vector3(buff.x, buff.y, buff.z),
          new THREE.Vector3(line.x, line.y, line.z)
        );

        // push created line to store
        if(gcview.model.layer[zchg][mode] == undefined) gcview.model.layer[zchg][mode] = obj;
        else gcview.model.layer[zchg][mode].merge(obj);

        // store line in buffer
        buff = line;

        // Display model
        user._update();
        if(user.ui.val.rendpathcur == user.ui.val.rendpathtot) gcview._display();
      }, time);
    }
  },

  _display: function(){
    $.each(gcview.model.layer, function(i, layer) {
      $.each(layer, function(mode, lines) {
        gcview.scene.add(new THREE.Line(lines, materials[mode]));
      }); 
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
