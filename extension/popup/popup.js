import * as transformFunctions from "../transforms.js";

main();

function main() {

  const transform_selector = document.querySelector('#transform-selector')

  transform_selector.onchange = () => {
    // ...query for the active tab...
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', transform: transform_selector.options[transform_selector.selectedIndex].text});
    });
  }

  Object.getOwnPropertyNames(transformFunctions).forEach((transform_name) => {
    if (transform_name == "Panorama") return;
    const option = document.createElement("option");
    const text = document.createTextNode((new transformFunctions[transform_name]).name);
    option.appendChild(text);
    option.value = transform_name;
    transform_selector.prepend(option);
  })

}