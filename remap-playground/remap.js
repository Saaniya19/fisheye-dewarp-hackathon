import Dot from "./dot.js";
import * as transformFunctions from "./transforms.js";

main();

function main() {
  const transform_selector = document.querySelector('#transform-selector')

  function resize_canvases(canvases, width, height) {
    canvases.forEach((canvas) => {
      const attrs = {width, height};
      for (let key in attrs) {
        canvas.setAttribute(key, attrs[key]);
      }
    })
  }

  Object.getOwnPropertyNames(transformFunctions).forEach((transform_name) => {
    const option = document.createElement("option");
    const text = document.createTextNode((new transformFunctions[transform_name]).name);
    option.appendChild(text);
    option.value = transform_name;
    transform_selector.prepend(option);
  })

  // Start the forever loop.
  updateImage();
}

function updateImage() {
  const input = document.querySelector("#input-canvas");
  const output = document.querySelector("#output-canvas")
  const num_dots_slider = document.querySelector("#num-dots")
  const input_image = document.querySelector("#input-image");
  const input_image_canvas = document.querySelector("#input-image-canvas");
  const output_image_canvas = document.querySelector("#output-image-canvas");
  const transform_selector = document.querySelector('#transform-selector')

  input_image_canvas.getContext("2d").drawImage(input_image, 0, 0, input_image.width, input_image.height);

  const imgData = input_image_canvas.getContext('2d').getImageData(0, 0, input_image_canvas.width, input_image_canvas.height);
  const items = imgData.data;
  var size = 4, colours = [];
  for ( var i = 0 ; i < items.length ; i+= size ) {
    colours.push(items.slice(i,i+size));
  }
  let pixels = [];
  for (let i = 0; i < input_image_canvas.height; i++) {
    pixels.push(colours.slice(i*input_image_canvas.width, (i+1)*input_image_canvas.width));
  }

  const transformer = selectTransform(transform_selector.value);
  output_image_canvas.width = transformer.width;
  output_image_canvas.height = transformer.height;

  const transform = (dot) => {
    const [u, v] = transformer.transform(dot.x, dot.y);
    return new Dot(u, v, dot.colour);
  }
  run(input, output, transform, num_dots_slider.value, output_image_canvas, pixels);
  // Loop forever.
  window.requestAnimationFrame(updateImage);
}

function selectTransform(transform_name) {
  if (!(transform_name in transformFunctions)) {
    throw new Error(`Unknown transform "${transform_name}"`)
  }

  const transformer = new transformFunctions[transform_name];
  return transformer;
}

function draw_dots(canvas, dots, size) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(dot => {
    ctx.fillStyle = dot.colour;
    const x = (dot.x+1)/2 * canvas.width;
    const y = (dot.y+1)/2 * canvas.height;

    ctx.fillRect(
      x-size/2,
      y-size/2,
      size,
      size
    );
  });
}

function getColour(pixels, x, y) {
  if (isNaN(x) || isNaN(y)) {
    return [0, 0, 0, 0];
  }
  const newX = Math.max(Math.floor((x+1)/2*pixels.length), 0);
  const newY = Math.max(Math.floor((y+1)/2*pixels[0].length), 0);
  if (newY >= pixels.length || newX >= pixels[newY].length) {
    return [0, 0, 0, 0];
  }
  return pixels[newY][newX]
}

function run(input, output, transform, nDots, output_image_canvas, pixels) {
  // Note: prior to drawing, the coordinates are normalized from -1 -> 1 on both axis
  let xStepSize = 1 / (nDots-1);
  let yStepSize = 1 / (nDots-1);

  let dots = [];
  for (let i = 0; i < nDots; i++) {
    for (let j = 0; j < nDots; j++) {
      const x = i*xStepSize*2-1;
      const y = j*yStepSize*2-1;
      dots.push(new Dot(
        x,
        y,
        `rgb(${255*y} ${200*x} ${200*(x+y)/2})`
      ));
    }
  }

  draw_dots(input, dots, 2);
  draw_dots(output, dots.map(transform), 2);

  nDots = output_image_canvas.width;

  xStepSize = 1 / (nDots-1);
  yStepSize = 1 / (nDots-1);

  let points = [];
  for (let i = 0; i < nDots; i++) {
    for (let j = 0; j < nDots; j++) {
      const x = i*xStepSize*2-1;
      const y = j*yStepSize*2-1;
      const dot = new Dot(x, y);

      const transformedDot = transform(dot);
      const [r,g,b,a] = getColour(pixels, transformedDot.x, transformedDot.y);
      dot.colour = `rgb(${r} ${g} ${b})`;

      points.push(dot);
    }
  }

  draw_dots(output_image_canvas, points, 1);
}