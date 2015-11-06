var STKMediawallFramework, delay, getState, pause, play, receiver, restart, sendState, start, tick, timer, unSchedule;

STKMediawallFramework = {
  id: "unknown",
  connection: {
    mode: "postMessage",
    parentURI: '*'
  },
  state: "loading"
};


/*
mode:"direct","postMessage"
state:"loading","prepareing","ready","running","paused","stopped"
 */

sendState = function() {
  var message;
  switch (STKMediawallFramework.connection.mode) {
    case "direct":
      return true;
    case "postMessage":
      if (STKMediawallFramework.id !== "unknown") {
        message = '{"id":"' + STKMediawallFramework.id + '","kind":"state","state":"' + STKMediawallFramework.state + '"}';
        return parent.postMessage(message, STKMediawallFramework.connection.parentURI);
      }
  }
};

unSchedule = function() {
  var message;
  switch (STKMediawallFramework.connection.mode) {
    case "direct":
      return true;
    case "postMessage":
      if (STKMediawallFramework.id !== "unknown") {
        message = '{"id":"' + STKMediawallFramework.id + '","kind":"unschedule"}';
        return parent.postMessage(message, STKMediawallFramework.connection.parentURI);
      }
  }
};

getState = function() {
  return STKMediawallFramework.connection.state;
};

tick = function() {
  console.log("tick");
  return true;
};

receiver = function(e) {
  var data, message;
  STKMediawallFramework.connection.mode = "postMessage";
  data = JSON.parse(e.data);
  switch (data.kind) {
    case "tick":
      if (data.id !== void 0) {
        STKMediawallFramework.id = data.id;
      }
      message = '{"kind":"tack"}';
      parent.postMessage(message, STKMediawallFramework.connection.parentURI);
      break;
    case "restart":
      restart();
      break;
    case "pause":
      pause();
  }
  if (e.origin === '*') {

  }
};

delay = function(ms, fn) {
  return setTimeout(fn, ms);
};

timer = function(ms, fn) {
  return setInterval(fn, ms);
};

window.addEventListener('message', receiver, false);

sendState();

STKMediawallFramework.state = "ready";

timer(10000, sendState);

play = function() {};

pause = function() {};

start = function() {
  return restart();
};

restart = function() {};
