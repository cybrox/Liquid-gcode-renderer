/**
 * Liquid GCODE viewer
 *
 * module: gcparse
 * Parse gcode and call respective printer actions
 */

var gcparse = {
  time: 0,
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
    $('#lcurr').text(gcparse.line.curr);
    $('#ltot').text(gcparse.line.tot);
  },

  parseLine: function(line, num){
    if(line.charAt(0) == ";" || line.length < 2) return;
    var parts = line.split(' ');

    var args = [];
    var comm = parts[0];
    var handler = printer[comm] || printer['default'];
    for(var i = 1; i < parts.length; i++) args.push(parts[i]);
    
    gcparse.time++;
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