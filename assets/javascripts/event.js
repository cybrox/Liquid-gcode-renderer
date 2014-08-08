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
  if(k == 113) user.changeLayer('fltlayermin', 1); // q
  if(k == 97 ) user.changeLayer('fltlayermin', -1); // a
  if(k == 119) user.changeLayer('fltlayermax', 1); // w
  if(k == 115) user.changeLayer('fltlayermax', -1); // s
  if(k == 101) user.resetLayer();

  if(k == 114) gcview.reset();        // r
});

/* User interface inputs */
$('.ui-input').change(function(){
  user.ui.filter[$(this).attr('id').replace('ui-input-', '')] = $(this).val();
  user.ui.filterUpdated();
});

/* User interface checkboxes */
$('.ui-checkbox').change(function(){
  var cb = $(this).attr('id').replace('ui-checkbox-', '');

  if(gcview.rendering.show[cb]) gcview.scene.remove(printer.lines[cb]);
  else gcview.scene.add(printer.lines[cb]);

  gcview.rendering.show[cb] = !gcview.rendering.show[cb];
});