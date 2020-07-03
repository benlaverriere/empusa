import VideoContext from "videocontext";
//import colorwheel from "colorwheel";

var canvas = document.getElementById("canvas");
const { CROSSFADE, MONOCHROME } = VideoContext.DEFINITIONS;

function rgbToOutputMix(r, g, b) {
  return [r / 255.0, g / 255.0, b / 255.0];
}

function colorOverlayEffectNode(r, g, b) {
  const effectNode = videoCtx.effect(MONOCHROME);

  // balance all inputs so we're doing a "flat" monochrome conversion
  effectNode.inputMix = [1.0 / 3, 1.0 / 3, 1.0 / 3];

  // overlay a color
  effectNode.outputMix = rgbToOutputMix(r, g, b);

  return effectNode;
}

function crossfadeNode() {
  var crossfadeEffect = videoCtx.transition(CROSSFADE);

  //Setup the transition. This will change the "mix" property of the cross-fade node from 0.0 to 1.0.
  //Transision mix value from 0.0 to 1.0 at time=8 over a period of 2 seconds to time=10.
  crossfadeEffect.transition(8.0, 10.0, 0.0, 1.0, "mix");
  return crossfadeEffect;
}

var videoCtx = new VideoContext(canvas);
var videoNode = videoCtx.video(
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  20, // start offset (seconds)
  4, // preload time (seconds)
  { volume: 0.2, loop: true }
);
videoNode.connect(videoCtx.destination);
videoNode.start(0);

const orangeGel = colorOverlayEffectNode(252, 115, 3);
const redGel = colorOverlayEffectNode(153, 23, 23);
const greenGel = colorOverlayEffectNode(17, 194, 97);
const blueGel = colorOverlayEffectNode(64, 110, 201);
const colorwheel = crossfadeNode();

// Set up the processing chain.
videoNode.connect(orangeGel);
videoNode.connect(redGel);
videoNode.connect(greenGel);
videoNode.connect(blueGel);

orangeGel.connect(colorwheel);
redGel.connect(colorwheel);

colorwheel.connect(videoCtx.destination);

videoCtx.play();
