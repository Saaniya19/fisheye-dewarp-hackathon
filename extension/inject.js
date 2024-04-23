(async () => {
  const src = chrome.runtime.getURL('main.js');
  const contentScript = await import(src);
  console.log(contentScript)
  contentScript.main();
})();