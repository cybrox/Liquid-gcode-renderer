/**
 * Liquid GCODE viewer
 *
 * module: user
 * Handle user interactions and display
 */

 var user = {
  sizex: window.innerWidth,
  sizey: window.innerHeight,

  /**
   * Resize scene based on user's browser window resize
   */
  _resize: function(){
    user.sizex = window.innerWidth;
    user.sizey = window.innerHeight;
    gcview.render.setSize(user.sizex, user.sizey);
  }
}
