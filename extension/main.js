import { init } from "./webgl-main.js";
import * as transformFunctions from "../transforms.js";

function createSquare(func, transf) {
  const squareCanvas = document.createElement('canvas');
  squareCanvas.width = 640
  squareCanvas.height = 640
  // squareCanvas.style.zIndex = 0;
  squareCanvas.style.top = 0
  squareCanvas.style.right = 0
  squareCanvas.style.position = 'absolute'
  createTransformedView(
    squareCanvas,
    transf ? transf : transformFunctions["Circle"],
    func,
    (image) => nthParent(image, 7),
    true,
    true
  )
}

function createPano() {
  const panoCanvas = document.createElement('canvas');
  // panoCanvas.style.zIndex = 0;
  panoCanvas.width = 1300;
  panoCanvas.height = 1/3*panoCanvas.width;
  panoCanvas.style.transform = "scaleY(-1)"
  createTransformedView(
    panoCanvas,
    transformFunctions["Panorama"],
    () => document.querySelector(".mio-cv-viewImage"), 
    (image) => document.querySelector("body > mio-app-root > div > div > ng-component > div > div > mio-video-container > mio-card > div > mio-routed-tabs > mio-tab-group > div.mio-tab-group__content-container > mio-live-video > div > div.flex.gap-4.flex-wrap.mt-2"),
    false,
    false
  )
}

export function main() {
  createSquare(() => document.querySelector(".mio-cv-viewImage"));
  // createSquare(() => {
  //   const all = document.querySelectorAll(".mio-cv-viewImage");
  //   if (all.length > 1) {
  //     return all[1];
  //   }
  // });
  createPano();
}

function nthParent(node, n) {
  if (n <= 0) return node;
  return nthParent(node.parentNode, n-1);
}

function createTransformedView(canvas, transformClass, getSource, getInsertionNode, resize, deletePrev) {
  console.log(canvas);
  console.log("transform: " + transformClass)

  console.log("Starting main")


  document.body.appendChild(canvas);

  let onAnimationFrame = function () {
    const image = getSource();
    
    if (!image){
      // console.log("Image doesn't exist :(")
    } else {
      // parent.style.position = "relative";
      let drawImage

      try {
        // console.log("Trying to run init")

        drawImage = init(canvas, (new transformClass()).transform);

        // console.log("Ran init, drawImage type: " + typeof(drawImage))
      } catch (error) {

        // console.log("Failed to run init: " + error)
      }

      if (resize) {
        canvas.width = image.getAttribute("width");
        canvas.height = image.getAttribute("height");
      }

      const parent = getInsertionNode(image);
      if (deletePrev) {
        // parent.querySelectorAll("canvas").forEach((c) => c.remove());
      }
      parent.appendChild(canvas);

      const copy = new Image();

      // order does matter
      copy.onload = () => drawImage(copy)

      copy.src = image.getAttribute("href")
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  window.requestAnimationFrame(onAnimationFrame);
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  createSquare(() => document.querySelector(".mio-cv-viewImage"), transformFunctions[msg.transform]);
});