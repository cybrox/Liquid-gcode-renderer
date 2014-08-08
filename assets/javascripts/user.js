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
      tempheatbed: $('#tempheatbed'),
      fltlayermin: $('#fltlayermin'),
      fltlayermax: $('#fltlayermax')
    },
    val: {
      readpathcur: 0,
      readpathtot: 0,
      rendpathcur: 0,
      rendpathtot: 0,
      tempextrude: 0,
      tempheatbed: 0,
      fltlayermin: 0,
      fltlayermax: 0
    },
    cache: {
      fltlayermin: undefined,
      fltlayermax: undefined
    }
  },

  changeLayer: function(layer, value){
    if(user.ui.cache.fltlayermax == undefined){
      user.ui.cache.fltlayermin = user.ui.val.fltlayermin;
      user.ui.cache.fltlayermax = user.ui.val.fltlayermax;
    }
    user.ui.val[layer] += value;
    if(user.ui.val[layer] < 0 || user.ui.val[layer] > user.ui.cache.fltlayermax || user.ui.val.fltlayermin > user.ui.val.fltlayermax){
      user.ui.val[layer] -= value;
    }
    gcview.renderLayers(user.ui.val.fltlayermin, user.ui.val.fltlayermax);
    user._update();
  },

  resetLayer: function(){
    user.ui.val.fltlayermin = user.ui.cache.fltlayermin;
    user.ui.val.fltlayermax = user.ui.cache.fltlayermax;
    gcview.renderLayers(user.ui.val.fltlayermin, user.ui.val.fltlayermax);
    user._update();
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
