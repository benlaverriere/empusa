import VideoContext from "videocontext";

var canvas = document.getElementById("canvas");
const { MONOCHROME: monochromeEffect } = VideoContext.DEFINITIONS;

function rgbToOutputMix(r, g, b) {
  return [r / 255.0, g / 255.0, b / 255.0];
}

function colorOverlayEffectNode(r, g, b) {
  const effectNode = videoCtx.effect(monochromeEffect);

  // balance all inputs so we're doing a "flat" monochrome conversion
  effectNode.inputMix = [1.0 / 3, 1.0 / 3, 1.0 / 3];

  // overlay a color
  effectNode.outputMix = rgbToOutputMix(r, g, b);

  return effectNode;
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

const gelEffectNode = colorOverlayEffectNode(252, 115, 3);

// Set up the processing chain.
videoNode.connect(gelEffectNode);
gelEffectNode.connect(videoCtx.destination);

videoCtx.play();
