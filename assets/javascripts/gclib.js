/**
 * Liquid GCODE viewer
 *
 * module: gclib
 * Contains material and parameter definitions
 */

var gclib = {
  // materials: {
  // },

  materials: {
    mark: new THREE.MeshBasicMaterial({ color: 0x8B1C62 }),
    plain: new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3, vertexColors: THREE.VertexColors } )
  },

  colors: {
    move: new THREE.Color(0x8470FF),
    fill: new THREE.Color(0xFF7F24),
    rapd: new THREE.Color(0x0000CD),
    mark: new THREE.Color(0x8B1C62)
  }
}