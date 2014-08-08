/**
 * Liquid GCODE viewer
 *
 * module: user
 * Handle user interactions and display
 */

 var user = {
  sizex: window.innerWidth,
  sizey: window.innerHeight,

  ui: {
    elm: {
      readpathcur: $('#readpathcur'),
      readpathtot: $('#readpathtot'),
      rendpathcur: $('#rendpathcur'),
      rendpathtot: $('#rendpathtot'),
      tempextrude: $('#tempextrude'),
      tempheatbed: $('#tempheatbed')
    },
    val: {
      readpathcur: 0,
      readpathtot: 0,
      rendpathcur: 0,
      rendpathtot: 0,
      tempextrude: 0,
      tempheatbed: 0
    },
    filter: {
      fill: true,
      move: true,
      rapd: true
    }
  },

  /**
   * Update the user's UI
   */
  _update: function(){
    $.each(user.ui.val, function(index, value) {
      user.ui.elm[index].text(value);
    }); 
  },

  /**
   * Resize scene based on user's browser window resize
   */
  _resize: function(){
    user.sizex = window.innerWidth;
    user.sizey = window.innerHeight;
    gcview.render.setSize(user.sizex, user.sizey);
  }
}
