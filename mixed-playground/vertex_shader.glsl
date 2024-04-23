#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
// 
in vec4 a_position;
in vec2 a_texcoord;
 
// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = vec4(a_position.x, -a_position.y, a_position.z, a_position.w);

  v_texcoord = a_texcoord;
}