let colorwheel = {
  title: "colorwheel",
  description: "shine it on your aluminum christmas tree",
  vertexShader:
    "\
    attribute vec2 a_position;\
    attribute vec2 a_texCoord;\
    varying vec2 v_texCoord;\
    void main() {\
        gl_Position = vec4(vec2(2.0,2.0)*a_position-vec2(1.0, 1.0), 0.0, 1.0);\
        v_texCoord = a_texCoord;\
    }",
  fragmentShader:
    "\
    precision mediump float;\
    uniform sampler2D u_image;\
    uniform float r;\
    uniform float g;\
    uniform float b;\
    varying vec2 v_texCoord;\
    varying float v_mix;\
    void main(){\
        vec4 gel = vec4(vec3(r/255.0, g/255.0, b/255.0), 255.0);\
        vec4 color = texture2D(u_image, v_texCoord);\
        gl_FragColor = color * gel;\
    }",
  properties: {
    r: { type: "uniform", value: 255.0 },
    g: { type: "uniform", value: 255.0 },
    b: { type: "uniform", value: 255.0 },
  },
  inputs: ["u_image"],
};

export default colorwheel;
