/**
 * Liquid GCODE viewer
 *
 * module: printer
 * Gcode parser actions for Velleman k8200 printer
 */

var p = {
  name: "Ultimaker 2",
  size: {
    x: 230,
    y: 225,
    z: 205,
    u: null,
    a: true
  },
  lines: {  // line geometry arrays, used for toggle
    fill: null,
    move: null,
    rapd: null
  },
  b: { // buffer
    x: 0,
    y: 0,
    z: 0,
    e: 0,
    p: false,
    lines: []
  },
  l: 0, // helper for rendering

  drawOutlines: function(material){
    var printer = new THREE.Geometry();
    printer.vertices.push(
      new THREE.Vector3( 000, 225, 205 ),
      new THREE.Vector3( 230, 225, 205 ),
      new THREE.Vector3( 230, 000, 205 ),
      new THREE.Vector3( 000, 000, 205 ),
      new THREE.Vector3( 000, 225, 205 ),
      new THREE.Vector3( 000, 225, 000 ),
      new THREE.Vector3( 000, 000, 000 ),
      new THREE.Vector3( 230, 000, 000 ),
      new THREE.Vector3( 230, 225, 000 ),
      new THREE.Vector3( 230, 225, 205 ),
      new THREE.Vector3( 000, 225, 205 ),
      new THREE.Vector3( 000, 000, 205 ),
      new THREE.Vector3( 000, 000, 000 ),
      new THREE.Vector3( 230, 225, 000 ),
      new THREE.Vector3( 000, 225, 000 ),
      new THREE.Vector3( 000, 225, 205 ),
      new THREE.Vector3( 000, 000, 205 ),
      new THREE.Vector3( 230, 000, 205 ),
      new THREE.Vector3( 230, 000, 000 ),
      new THREE.Vector3( 000, 225, 000 )
    );

    gcview.scene.add( new THREE.Line( printer, materials.mark ) );
  },

  drawContent: function(){
    var geo = {
      move: new THREE.Geometry(),
      fill: new THREE.Geometry(),
      rapd: new THREE.Geometry()
    }
    var time = 0,
        step = 0;
    for(var i = 0; i < (p.b.lines.length - 1); i++){
      if((step % 5000) == 0){
        time++;
        step = 0;
      }
      step++;
      user.ui.val.rendpathtot++;
      window.setTimeout(function(){ 
        user.ui.val.rendpathcur++;
        user._update();

        /*
        object.vertices.push(
          new THREE.Vector3(p.b.lines[p.l]['x'], p.b.lines[p.l]['y'], p.b.lines[p.l]['z'])
        );
        p.l++;
        */

        var a = p.b.lines[p.l];
        p.l++;
        var b = p.b.lines[p.l];
        var m = 'move';
        if(b.p) m = 'fill';
        if(b.r) m = 'rapd';

        var o = new THREE.Geometry();
        o.vertices.push(
          new THREE.Vector3(a.x, a.y, a.z),
          new THREE.Vector3(b.x, b.y, b.z)
        );

        geo[m].merge(o);

        if(user.ui.val.rendpathcur == user.ui.val.rendpathtot){
          p.lines.move = new THREE.Line(geo.move, materials.move);
          p.lines.fill = new THREE.Line(geo.fill, materials.fill);
          p.lines.rapd = new THREE.Line(geo.rapd, materials.rapd);

          gcview.scene.add( p.lines.move );
          gcview.scene.add( p.lines.fill );
          gcview.scene.add( p.lines.rapd );
        }
      }, time);
    }
  },

  default: function(args, comm){
    console.log("No method handled command "+comm+" ("+args.join(',')+") for printer "+printer.name);
  },

  /* G0 - Move fast -> perform normal move with rapid param*/
  G0: function(args){
    p.G1(args, true, true);
    return true;
  },

  /* G1 - Move */
  G1: function(args, useless, rapid){
    var c = ['x','y','z','e','p']; // buffer chars
    var t = {} // tempbuffer
        t.r = rapid || false;

    // write buffer to temp buffer
    for(var i = 0; i < c.length; i++){ t[c[i]] = p.b[c[i]]; }

    for(var j = 0; j < args.length; j++){
      var v = args[j];
      if(v.charAt(0).toLowerCase() == 'f') continue; // skip feedrate
      t[v.charAt(0).toLowerCase()] = parseFloat(v.replace(v.charAt(0), ''));
    }

    // Set p (extruding) true if e t > e buff and no rapid move
    t.p = (t.e > p.b.e && !rapid) ? true : false;

    // write temp buffer to buffer
    for(var i = 0; i < c.length; i++){ p.b[c[i]] = t[c[i]]; }

    p.b.lines.push(t);
    return true;
  },

  /* G21 - Set units to millimeters */
  G21: function(args){
    p.size.u = 'mm';
    return true;
  },

  /* G28 - Move to origin -> redirect to normal move */
  G28: function(args) { p.G1(args); },

  /* G90 - Use absolute positioning */
  M82: function(args) { p.G90(args); },
  G90: function(args){
    p.size.a = true;
    return true;
  },

  /* M107 - Start with fan off */
  M107: function(args){ return true; },

  /* M109 - Set extruder temperature and wait */
  M109: function(args){
    if(args.length != 2) return false;
    user.ui.val.tempextrude = (args[1]).replace('S', '');
    return true;
  },

  /* M117 - Display message */
  M117: function(args){ return true; },


  /* M140 - Bed temperature (fast) */
  M140: function(args){
    if(args.length != 1) return false;
    user.ui.val.tempheatbed = (args[0]).replace('S', '');
    return true;
  },

  /* M190 - Wait for bed temperature */
  M190: function(args){ return true; }
}

printerultimaker2 = p;