# Liquid : Gcode renderer
Liquid is a simple gcode renderer based on THREE.js using WebGL to render a 3D model of a given GCODE file. It has been built for displaying the gcode the Cura slicer for the Ultimaker 2 produces but it can be modified with custom printer / gcode values and methods.

### Development
Eventually, Liquid should display a camera view of the current print as well as the respective g-code overlay. However, it currently is in a 'first-try' stadium. The performance for bigger gcodes (> 40'000 lines) is pretty bad in this first attempt of rendering. 

### Controls
`left mouse` Rotate camera  
`right mouse` Drag camera
`r` Reset camera  
`q` Minimum Layer +1  
`a` Minumum Layer -1  
`w` Maximum Layer +1  
`s` Maximum Layer -1  
`e` Reset Layer  