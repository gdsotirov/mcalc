function calcNewCommand() {
  alert("Not yet implemented!");
}

function calcQuitCommand() {
  return closeWindow();
}

function helpContentsCommand() {
  alert("Not yet implemented!");
}

function helpAboutCommand() {
  window.open("mcalc_help.xul", "About", "chrome");
}

function helpCloseCommand() {
  return closeWindow();
}

function closeWindow() {
  window.close();
  return;
}
