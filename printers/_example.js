/**
 * Liquid GCODE viewer
 *
 * module: printer
 * Gcode parser actions for <printer name> printer
 */

var printerk8200 = {
  name: "k8200",  // Printer name
  buffer: {},     // Empty buffer

  drawOutlines: function(material){
    // Draw printer outlines, if desired
  },

  drawContent: function(){
    // Finish arranging objects for drawing
  },

  default: function(args, comm){
    // Handle action if no method for GCODE command 'comm' was defined
  },

  G1: function(args){
    // Handle GCODE command 'G1' with arguments 'args'
  }
}
