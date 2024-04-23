import * as webglUtils from './webglutils.js';
import { fileContents } from './helper.js';

main();

async function main() {
  var vertexShaderSource = await fileContents("vertex_shader.glsl");
  var fragmentShaderSource = await fileContents("fragment_shader.glsl");

  const {gl, program} = setup(vertexShaderSource, fragmentShaderSource);

  try {
    run(gl, program);
  } catch (e) {
    alert(e);
  }
}

function setup(vertexShaderSource, fragmentShaderSource) {

              /* SETUP HTML CONTEXT */

  const canvas = document.querySelector("#glcanvas");

  // Initialize the GL context
  const gl = canvas.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
  }

  
              /* SETUP THE CANVAS */
  
  // There's two sizes:
  //     1) drawingbuffer -> virtual drawable space (set by us)
  //     2) display size -> actually displayed space (set by CSS)
  // To make things work, we usually want to set the drawingbuffer size to match the display size, thereby allowing CSS to take precedent
  // See https://webgl2fundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL the size of our screen so that it knows how to convert from clip space to screen space
  //    x: (-1, +1) -> (0, gl.canvas.width)
  //    y: (-1, +1) -> (0, gl.canvas.height)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


              /* SETUP THE GLSL PROGRAM */

  // For determining the attributes (e.g. position) of vertices, as well as their links: geometric structure
  var vertexShader = webglUtils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  // For determining the post-process following rasterization: pixel apperance
  var fragmentShader = webglUtils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Create a GLSL program by linking the vertex and fragment shaders
  var program = webglUtils.createProgram(gl, vertexShader, fragmentShader);


              /* SETUP THE POSITION BUFFER */

  // Obtain the location of the `a_position` attribute in the program
  // a_position is defined as a vec4: {x: 0, y: 0, z: 0, w: 1}
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer for the `a_position` attribute to access state from
  // Bind the buffer to a global access point so that the GLSL program can access data that we supply
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  

              /* PLACE CONTENTS IN THE BUFFER */

  // Place some data in the buffer
  var positions = [
    0, 0,  // *NOTE 1* we obtain 2 out at a time because that's our convention for x and y pairs. The other two fields on a vec4 (z,w) remain as their default
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,  // Store the data in the buffer we binded to `gl.ARRAY_BUFFER` (in this case, `positionBuffer`)
    new Float32Array(positions),  // WebGL needs strongly-typed data
    gl.STATIC_DRAW  // Hint for how we'll be using the data so that WebGL can optimize
  );

  // Create a "vertex array object": a collection of attribute state
  // Set that object as the currently active vertex array
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);


              /* RETRIEVE CONTENTS FROM THE BUFFER */

  // Turn on the `a_position` attribute: tells WebGL we want to use data from a buffer to update it; otherwise, attributes stay constant
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Specify how the program should retrieve data from the buffer
  var size = 2;          // 2 components per iteration (see *NOTE 1*)
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data - to within a range?
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer

  // This function binds the attribute to the currently active ARRAY_BUFFER (positionBuffer). I.e., it sets the attribute and we're done!
  // So, we're now free to use the ARRAY_BUFFER bind point for something else
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

  return {gl, program};
}

function run(gl, program) {
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  var primitiveType = gl.LINE_LOOP;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);

  // // Set clear color to black, fully opaque
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // // Clear the color buffer with specified clear color
  // gl.clear(gl.COLOR_BUFFER_BIT);
}


// ffmpeg -y -i input.mp4 -vf "v360=fisheye:e:pitch=90, crop=iw:ih/2:0:ih/2" -filter_complex "[0:v]crop=iw:ih/3[v2];[0:v]crop=iw:ih/3[v3];[v2][v3]hstack" -t 00:00:30 output.mp4