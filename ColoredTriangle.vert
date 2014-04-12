attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
void main() {
     // To do: Desenvolver o Algoritmo do vertex shader

  gl_Position = a_Position;
  v_Color = a_Color;
}
