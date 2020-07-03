import VideoContext from "videocontext";
import COLORWHEEL from "./colorwheel";

var canvas = document.getElementById("canvas");
const { MONOCHROME } = VideoContext.DEFINITIONS;

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

var videoCtx = new VideoContext(canvas);
var videoNode = videoCtx.video(
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  20, // start offset (seconds)
  4, // preload time (seconds)
  { volume: 0.0, loop: true }
);
videoNode.connect(videoCtx.destination);
videoNode.start(0);

const orangegel = [252, 115, 3];
const redgel = [153, 23, 23];
const greengel = [17, 194, 97];
const bluegel = [64, 110, 201];
const colorcycle = [orangegel, redgel, greengel, bluegel];
let colorIndex = 0;

const colorwheel = videoCtx.transition(COLORWHEEL);
colorwheel.r = colorcycle[colorIndex][0];
colorwheel.g = colorcycle[colorIndex][1];
colorwheel.b = colorcycle[colorIndex][2];
const fromTime = 0.0;
const maxDuration = 3.0; // durations vary because of imprecision, but we should have a certain amount of "hang time" on each color
const cycleTime = 5.0 * 1000;

setInterval(() => {
  const fromColor = colorcycle[colorIndex];
  colorIndex = (colorIndex + 1) % colorcycle.length;
  const toColor = colorcycle[colorIndex];
  const toTime = fromTime + Math.random() * maxDuration;
  console.log(
    `[transition] ${fromColor} ---[${toTime - fromTime}]--> ${toColor}`
  );
  colorwheel.transition(fromTime, toTime, fromColor[0], toColor[0], "r");
  colorwheel.transition(fromTime, toTime, fromColor[1], toColor[1], "g");
  colorwheel.transition(fromTime, toTime, fromColor[2], toColor[2], "b");
}, cycleTime);

// Set up the processing chain.
videoNode.connect(colorwheel);
colorwheel.connect(videoCtx.destination);

videoCtx.play();
