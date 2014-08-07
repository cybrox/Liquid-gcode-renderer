/**
 * Liquid GCODE viewer
 *
 * module: event
 * Handle events
 */

/* Window resize */
$(window).resize(function(){
  user._resize();
});

/* User camera move control */
$(window).keypress(function(e) {
  var k = e.which;
  
  if(k == 113) gcview.move('z', 5);   // q
  if(k == 101) gcview.move('z', -5);  // e
  if(k == 119) gcview.move('y', 5);   // w
  if(k == 115) gcview.move('y', -5);  // s
  if(k == 100) gcview.move('x', 5);   // d
  if(k == 97 ) gcview.move('x', -5);  // a

  if(k == 114) gcview.reset();        // r
});