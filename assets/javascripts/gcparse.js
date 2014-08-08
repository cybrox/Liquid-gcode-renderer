/**
 * Liquid GCODE viewer
 *
 * module: gcparse
 * Parse gcode and call respective printer actions
 */

var gcparse = {
  time: 0,
  step: 0,
  line: {
    curr: 0,
    tot: 0
  },

  _parse: function(gcode){
    var lines = gcode.split('\n');
    for(var i = 0; i < lines.length; i++){
      gcparse.parseLine(lines[i], i);
    }
  },

  _updateUi: function(){
    user.ui.val.readpathcur = gcparse.line.curr;
    user.ui.val.readpathtot = gcparse.line.tot;
    user._update();
  },

  parseLine: function(line, num){
    if(line.charAt(0) == ";" || line.trim().length < 2) return;
    var parts = line.split(' ');

    var args = [];
    var comm = parts[0];
    var handler = printer[comm] || printer['default'];
    for(var i = 1; i < parts.length; i++) args.push(parts[i]);
    
    if((gcparse.step % 5000) == 0){
      gcparse.time++;
      gcparse.step = 0;
    }
    gcparse.step++;
    gcparse.line.tot++;
    window.setTimeout(function(){
      var res = handler(args, comm);
      gcparse.line.curr++;
      gcparse._updateUi();
      if(!res) console.log('Failed handling line: ' + gcparse.line.curr);
      if(gcparse.line.curr >= gcparse.line.tot) printer.drawContent();
    }, gcparse.time);
  }
}
