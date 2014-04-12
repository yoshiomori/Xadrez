#ifdef GL_ES
precision mediump float;
#endif GL_ES
varying vec4 v_Color;
void main() {
     // To do: Desenvolver o algorítimo do fragment shader
  gl_FragColor = v_Color;
}

