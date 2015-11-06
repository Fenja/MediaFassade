
/*

The compiled custom_body.js will be included at the end of the html body section after the include of socket.io and stk-framework.
Define your functions here.
 */
var activatePlayer, bombSpeed, bombTime, bottom, calcSide, checkCollision, checkCollisions, clear, collect, columnWidth, columns, customLogger, customLoggerD, customLoggerT, deactivatePlayer, directionAcceleration, directionJoystick, directionKey, draggable_accelerationsensor_handler, draggable_joystick_handler, draggable_keylistener_handler, draggable_orientationsensor_handler, fadeLimit, fallCount, fallObjects, fallRound, falls, fillObjectList, fps, getClientID, getNewColumn, getPlayer, gravity, heaven, inactivePlayers, influencePlayer, jump, jumpHeight, lastColumn, object0, object1, object2, objectBomb, objectDown, objectList, objectPower, objectWidth, objects, player1, player2, player3, player4, player5, player6, playerHeight, playerMap, playerWidth, players, powerSpeed, powerTime, queue, readyAndGo, registerPlayer, resize, running, timeLimit, tollerance, unregisteredPlayer, update, updateInfluence, updateObjects, updatePlayer, updatePlayers, updateTime, viewportHeight, viewportWidth,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

<<<<<<< HEAD
(function() {
  var activatePlayer, basketTollerance, bombSpeed, bombTime, bottom, calcSide, checkCollision, checkCollisions, clear, collect, columnWidth, columns, customLogger, customLoggerD, customLoggerT, deactivatePlayer, directionJoystick, directionKey, draggable_joystick_handler, draggable_keylistener_handler, draggable_positionsensor_handler, fadeLimit, fallCount, fallObjects, fallRound, falls, fillObjectList, fps, getClientID, getNewColumn, getPlayer, gravity, heaven, inactivePlayers, influencePlayer, jump, jumpHeight, lastColumn, object0, object1, object2, objectBomb, objectDown, objectList, objectPower, objectWidth, objects, player1, player2, player3, player4, player5, player6, playerHeight, playerMap, playerWidth, players, powerSpeed, powerTime, queue, readyAndGo, registerPlayer, resize, running, timeLimit, tollerance, unregisteredPlayer, update, updateInfluence, updateObjects, updatePlayer, updatePlayers, updateTime, viewportHeight, viewportWidth,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
=======
customLogger = function(s) {
  return console.log(s);
};
>>>>>>> 800157461f207f47e9e0b1642e8b961adf56a83a

customLoggerT = function() {

  /*customLogger "Timer" */
  update();
  return clear();
};

customLoggerD = function() {

  /*customLogger "Delay" */
  resize();
  return stk.framework.timer(100, customLoggerT);
};


/* Define your handler */

draggable_keylistener_handler = function(msg) {
  directionKey(msg);
  return console.log('Do something with msg: ' + JSON.stringify(msg));
};

draggable_joystick_handler = function(msg) {
  directionJoystick(msg);
  return console.log('Do something with msg: ' + JSON.stringify(msg));
};

draggable_orientationsensor_handler = function(msg) {
  return console.log('Do something with msg: ' + JSON.stringify(msg));
};

draggable_accelerationsensor_handler = function(msg) {
  directionAcceleration(msg);
  return console.log('Do something with msg: ' + JSON.stringify(msg));
};


/* Register your handler */

stk.framework.register_handler('draggable_joystick', draggable_joystick_handler);

stk.framework.register_handler('draggable_keylistener', draggable_keylistener_handler);

stk.framework.register_handler('draggable_orientationsensor', draggable_orientationsensor_handler);

stk.framework.register_handler('draggable_accelerationsensor', draggable_accelerationsensor_handler);


/*
Doing "onLoad"-Stuff
If you want a function be called after the last script (it is this script - custom_end.coffee/custom_end.js) is loaded, add your code here.
If it should be executed after the "loading..." animation ends, add a delay call of 1200 ms
 */

console.log("ready");

readyAndGo = function() {
  return console.log("go");
};

stk.framework.delay(1200, readyAndGo);


/* own code */

viewportHeight = window.innerHeight;

viewportWidth = window.innerWidth;

fps = 50;

running = true;

tollerance = 5;

gravity = 5;

heaven = viewportHeight;

bottom = 0;

jumpHeight = 300;

player1 = {
  name: "player1",
  up: false,
  left: false,
  right: false,
  jumps: false,
  falls: false,
  speed: 1,
  height: bottom,
  side: 50,
  influenceTime: 0,
  dom: document.getElementById('player1'),
  score: 0,
  scoreDom: document.getElementById('score1'),
  time: 0
};

player2 = {
  name: "player2",
  up: false,
  left: false,
  right: false,
  jumps: false,
  falls: false,
  speed: 1,
  height: bottom,
  side: 250,
  influenceTime: 0,
  dom: document.getElementById('player2'),
  score: 0,
  scoreDom: document.getElementById('score2'),
  time: 0
};

player3 = {
  name: "player3",
  up: false,
  left: false,
  right: false,
  jumps: false,
  falls: false,
  speed: 1,
  height: bottom,
  side: 250,
  influenceTime: 0,
  dom: document.getElementById('player3'),
  score: 0,
  scoreDom: document.getElementById('score3'),
  time: 0
};

player4 = {
  name: "player4",
  up: false,
  left: false,
  right: false,
  jumps: false,
  falls: false,
  speed: 1,
  height: bottom,
  side: 250,
  influenceTime: 0,
  dom: document.getElementById('player4'),
  score: 0,
  scoreDom: document.getElementById('score4'),
  time: 0
};

player5 = {
  name: "player5",
  up: false,
  left: false,
  right: false,
  jumps: false,
  falls: false,
  speed: 1,
  height: bottom,
  side: 250,
  influenceTime: 0,
  dom: document.getElementById('player5'),
  score: 0,
  scoreDom: document.getElementById('score5'),
  time: 0
};

player6 = {
  name: "player6",
  up: false,
  left: false,
  right: false,
  jumps: false,
  falls: false,
  speed: 1,
  height: bottom,
  side: 250,
  influenceTime: 0,
  dom: document.getElementById('player6'),
  score: 0,
  scoreDom: document.getElementById('score6'),
  time: 0
};

playerMap = {};

players = [];

inactivePlayers = [];

unregisteredPlayer = [player2, player1, player4, player5, player3, player6];

playerWidth = parseInt(getComputedStyle(player1.dom).width);

playerHeight = parseInt(getComputedStyle(player1.dom).height);

timeLimit = 60;

fadeLimit = 55;

object0 = {
  value: 0,
  name: 'zero',
  height: heaven,
  velo: 5,
  side: 10,
  dom: document.getElementById('zero')
};

object1 = {
  value: 1,
  name: 'one',
  height: heaven,
  velo: 5,
  side: 40,
  dom: document.getElementById('one')
};

object2 = {
  value: 2,
  name: 'two',
  height: heaven,
  velo: gravity,
  side: 40,
  dom: document.getElementById('two')
};

objectBomb = {
  value: 0,
  name: 'bomb',
  height: heaven,
  velo: gravity,
  side: 40,
  dom: document.getElementById('bomb')
};

objectPower = {
  value: 0,
  name: 'power',
  height: heaven,
  velo: gravity,
  side: 40,
  dom: document.getElementById('power')
};

objectWidth = parseInt(getComputedStyle(object1.dom).width);

objects = [object0, object1, object2, objectBomb, objectPower];

objectList = [];

queue = [object0, object1, object2, objectBomb, objectPower];

fallCount = 0;

fallRound = 30;

columns = 12;

columnWidth = viewportWidth / (2 + columns);

lastColumn = 0;

bombTime = 50;

powerTime = 75;

bombSpeed = 0.5;

powerSpeed = 2;


/* Own methods */

getPlayer = function(id) {
  var _ref;
  console.log(playerMap[id]);
  if ((playerMap[id] != null) && (_ref = playerMap[id], __indexOf.call(players, _ref) >= 0)) {
    return playerMap[id];
  } else {
    return registerPlayer(id);
  }
};

resize = function() {
  var object, player, score, scores, _i, _j, _k, _len, _len1, _len2;
  console.log("resize");
  viewportHeight = window.innerHeight;
  heaven = viewportHeight;
<<<<<<< HEAD

  bottom = 0;

  jumpHeight = 300;

  player1 = {
    name: "player1",
    up: false,
    left: false,
    right: false,
    jumps: false,
    falls: false,
    speed: 1,
    height: bottom,
    side: 50,
    influenceTime: 0,
    dom: document.getElementById('player1'),
    basketDom: document.getElementById('basket1'),
    score: 0,
    scoreDom: document.getElementById('score1'),
    time: 0
  };

  player2 = {
    name: "player2",
    up: false,
    left: false,
    right: false,
    jumps: false,
    falls: false,
    speed: 1,
    height: bottom,
    side: 250,
    influenceTime: 0,
    dom: document.getElementById('player2'),
    basketDom: document.getElementById('basket2'),
    score: 0,
    scoreDom: document.getElementById('score2'),
    time: 0
  };

  player3 = {
    name: "player3",
    up: false,
    left: false,
    right: false,
    jumps: false,
    falls: false,
    speed: 1,
    height: bottom,
    side: 250,
    influenceTime: 0,
    dom: document.getElementById('player3'),
    basketDom: document.getElementById('basket3'),
    score: 0,
    scoreDom: document.getElementById('score3'),
    time: 0
  };

  player4 = {
    name: "player4",
    up: false,
    left: false,
    right: false,
    jumps: false,
    falls: false,
    speed: 1,
    height: bottom,
    side: 250,
    influenceTime: 0,
    dom: document.getElementById('player4'),
    basketDom: document.getElementById('basket4'),
    score: 0,
    scoreDom: document.getElementById('score4'),
    time: 0
  };

  player5 = {
    name: "player5",
    up: false,
    left: false,
    right: false,
    jumps: false,
    falls: false,
    speed: 1,
    height: bottom,
    side: 250,
    influenceTime: 0,
    dom: document.getElementById('player5'),
    basketDom: document.getElementById('basket5'),
    score: 0,
    scoreDom: document.getElementById('score5'),
    time: 0
  };

  player6 = {
    name: "player6",
    up: false,
    left: false,
    right: false,
    jumps: false,
    falls: false,
    speed: 1,
    height: bottom,
    side: 250,
    influenceTime: 0,
    dom: document.getElementById('player6'),
    basketDom: document.getElementById('basket6'),
    score: 0,
    scoreDom: document.getElementById('score6'),
    time: 0
  };

  playerMap = {};

  players = [];

  inactivePlayers = [];

  unregisteredPlayer = [player2, player4, player5, player3, player6, player1];

  playerWidth = parseInt(getComputedStyle(player1.dom).width);

  playerHeight = parseInt(getComputedStyle(player1.dom).height);

  basketTollerance = 20;

  timeLimit = 60;

  fadeLimit = 55;

  object0 = {
    value: 0,
    name: 'zero',
    height: heaven,
    velo: 5,
    side: 10,
    dom: document.getElementById('zero')
  };

  object1 = {
    value: 1,
    name: 'one',
    height: heaven,
    velo: 5,
    side: 40,
    dom: document.getElementById('one')
  };

  object2 = {
    value: 2,
    name: 'two',
    height: heaven,
    velo: gravity,
    side: 40,
    dom: document.getElementById('two')
  };

  objectBomb = {
    value: 0,
    name: 'bomb',
    height: heaven,
    velo: gravity,
    side: 40,
    dom: document.getElementById('bomb')
  };

  objectPower = {
    value: 0,
    name: 'power',
    height: heaven,
    velo: gravity,
    side: 40,
    dom: document.getElementById('power')
  };

  objectWidth = parseInt(getComputedStyle(object1.dom).width);

  objects = [object0, object1, object2, objectBomb, objectPower];

  objectList = [];

  queue = [object0, object1, object2, objectBomb, objectPower];

  fallCount = 0;

  fallRound = 30;

  columns = 12;

  columnWidth = viewportWidth / (2 + columns);

  lastColumn = 0;

  bombTime = 50;

  powerTime = 75;

  bombSpeed = 0.5;

  powerSpeed = 2;


  /* Own methods */

  getPlayer = function(id) {
    var ref;
    if (playerMap[id] != null) {
      if (ref = playerMap[id], indexOf.call(players, ref) >= 0) {
        return playerMap[id];
      } else {
        return void 0;
      }
    } else {
      return registerPlayer(id);
    }
  };

  resize = function() {
    var i, j, k, len, len1, len2, object, player, score, scores;
    console.log("resize");
    viewportHeight = window.innerHeight;
    viewportWidth = window.innerWidth;
    heaven = viewportHeight;
    columnWidth = viewportWidth / (2 + columns);
    for (i = 0, len = objects.length; i < len; i++) {
      object = objects[i];
      object.dom.style.width = columnWidth + "px";
      object.dom.style.height = columnWidth + "px";
      object.dom.style.backgroundSize = columnWidth + "px " + columnWidth + "px";
      object.height = heaven;
    }
    for (j = 0, len1 = unregisteredPlayer.length; j < len1; j++) {
      player = unregisteredPlayer[j];
      player.dom.style.width = (columnWidth * 2) + "px";
      player.dom.style.height = (columnWidth * 4) + "px";
      player.dom.style.backgroundSize = (columnWidth * 2) + "px " + (columnWidth * 4) + "px";
      player.basketDom.style.width = (columnWidth * 2) + "px";
      player.basketDom.style.height = (columnWidth * 4) + "px";
      player.basketDom.style.backgroundSize = (columnWidth * 2) + "px " + (columnWidth * 4) + "px";
    }
    scores = document.getElementsByClassName('highscore');
    for (k = 0, len2 = scores.length; k < len2; k++) {
      score = scores[k];
      score.style.left = columnWidth + "px";
      score.style.top = (columnWidth * 2.25) + "px";
    }
    objectWidth = columnWidth;
    playerWidth = parseInt(getComputedStyle(player1.dom).width);
    return playerHeight = parseInt(getComputedStyle(player1.dom).height);
  };

  directionJoystick = function(msg, player) {
    var id, type, x, y;
    id = msg.envelop.clientid;
    player = getPlayer(id);
    if ((player != null)) {
      x = msg.x;
      y = msg.y;
      type = msg.type;
      if (y < 0.4 && y < x - 0.1) {
        player.up = true;
      } else if (x < 0.4 && x < y - 0.1) {
=======
  columnWidth = viewportWidth / (2 + columns);
  for (_i = 0, _len = objects.length; _i < _len; _i++) {
    object = objects[_i];
    object.dom.style.width = columnWidth + "px";
    object.dom.style.height = columnWidth + "px";
    object.dom.style.backgroundSize = columnWidth + "px " + columnWidth + "px";
  }
  for (_j = 0, _len1 = unregisteredPlayer.length; _j < _len1; _j++) {
    player = unregisteredPlayer[_j];
    player.dom.style.width = (columnWidth * 2) + "px";
    player.dom.style.height = (columnWidth * 4) + "px";
    player.dom.style.backgroundSize = (columnWidth * 2) + "px " + (columnWidth * 4) + "px";
  }
  scores = document.getElementsByClassName('highscore');
  for (_k = 0, _len2 = scores.length; _k < _len2; _k++) {
    score = scores[_k];
    score.style.left = columnWidth + "px";
    score.style.top = (columnWidth * 2.25) + "px";
  }
  return objectWidth = columnWidth;
};

directionAcceleration = function(msg, player) {
  console.log(msg.dev);
  player = getPlayer(msg.envelop.clientid);
  if ((player != null)) {
    if (msg.dev.z > 10) {
      player.up = true;
    }
  }
  return true;
};

directionJoystick = function(msg, player) {
  var id, type, x, y;
  id = msg.envelop.clientid;
  player = getPlayer(id);
  if ((player != null)) {
    x = msg.x;
    y = msg.y;
    type = msg.type;
    if (y < 0.4 && y < x - 0.1) {
      player.up = true;
    } else if (x < 0.4 && x < y - 0.1) {
      player.left = true;
    } else if (x > 0.6 && x > y + 0.1) {
      player.right = true;
    }
  }
  return true;
};

directionKey = function(msg, player) {
  var code, id, keys, _i, _len;
  id = msg.envelop.clientid;
  player = getPlayer(id);
  if ((player != null)) {
    keys = msg.keys;
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      code = keys[_i];
      if (code === 37) {
>>>>>>> 800157461f207f47e9e0b1642e8b961adf56a83a
        player.left = true;
      }
      if (code === 38) {
        player.up = true;
      }
<<<<<<< HEAD
    }
    return true;
  };

  updatePlayer = function(player) {
    var basketLeft, playerLeft;
    playerLeft = parseInt(getComputedStyle(player.dom).left);
    basketLeft = parseInt(getComputedStyle(player.basketDom).left);
    if (player.left && player.side > 0) {
      player.side -= 10 * player.speed;
      if (basketLeft <= -1 * basketTollerance) {
        player.dom.style.left = player.side + "px";
      } else {
        player.basketDom.style.left = (player.side - playerLeft) + "px";
      }
    } else if (player.right && player.side + playerWidth < viewportWidth) {
      player.side += 10 * player.speed;
      player.dom.style.left = player.side + "px";
      if (basketLeft >= basketTollerance) {
        player.dom.style.left = player.side + "px";
      } else {
        player.basketDom.style.left = (player.side - playerLeft) + "px";
      }
    }
    if (player.jumps || player.falls) {
      jump(player);
      player.dom.style.left = player.side + "px";
      player.basketDom.style.left = "0px";
    } else if (player.up) {
      jump(player);
      player.dom.style.left = player.side + "px";
      player.basketDom.style.left = "0px";
    }
    updateInfluence(player);
    return true;
  };

  updateInfluence = function(player) {
    if (player.influence > 0) {
      player.influence -= 1;
      if (player.influence === 0) {
        player.speed = 1;
      }
    }
    return true;
  };

  updateTime = function(player, now) {
    if ((now - player.time) >= timeLimit) {
      deactivatePlayer(player);
      return false;
    } else if ((now - player.time) >= fadeLimit) {
      player.dom.style.opacity = 0.7;
      return true;
    } else {
      return true;
=======
      if (code === 39) {
        player.right = true;
      }
    }
  }
  return true;
};

registerPlayer = function(id) {
  var index, player;
  if (unregisteredPlayer.length > 0) {
    player = unregisteredPlayer.pop();
    inactivePlayers.push(player);
    activatePlayer(player);
    playerMap[id] = player;
    player.dom.style.left = 10 + "px";
    index = unregisteredPlayer.indexOf(player);
    unregisteredPlayer.splice(index, 1);
  }
  return true;
};

activatePlayer = function(player) {
  var index;
  players.push(player);
  index = inactivePlayers.indexOf(player);
  inactivePlayers.splice(index);
  player.time = new Date().getTime() / 1000;
  player.score = 0;
  player.dom.style.opacity = 1.0;
  player.dom.style.zIndex = 5;
  return true;
};

deactivatePlayer = function(player) {
  var index;
  inactivePlayers.push(player);
  index = players.indexOf(player);
  players.splice(index);
  player.dom.style.opacity = 0.3;
  player.dom.style.zIndex = 2;
  return true;
};

update = function() {
  updatePlayers();
  updateObjects();
  return checkCollisions();
};

updatePlayers = function() {
  var now, player, _i, _len;
  now = new Date().getTime() / 1000;
  for (_i = 0, _len = players.length; _i < _len; _i++) {
    player = players[_i];
    if (updateTime(player, now)) {
      updatePlayer(player);
>>>>>>> 800157461f207f47e9e0b1642e8b961adf56a83a
    }
  }
  return true;
};

updatePlayer = function(player) {
  if (player.left && player.side > 0) {
    player.side -= 10 * player.speed;
  } else if (player.right && player.side + playerWidth < viewportWidth) {
    player.side += 10 * player.speed;
  }
  if (player.jumps || player.falls) {
    jump(player);
  } else if (player.up) {
    jump(player);
  }
  player.dom.style.left = player.side + "px";
  updateInfluence(player);
  return true;
};

updateInfluence = function(player) {
  if (player.influence > 0) {
    player.influence -= 1;
    if (player.influence === 0) {
      player.speed = 1;
    }
  }
  return true;
};

updateTime = function(player, now) {
  if ((now - player.time) >= timeLimit) {
    deactivatePlayer(player);
    return true;
  } else if ((now - player.time) >= fadeLimit) {
    player.dom.style.opacity = 0.7;
    return false;
  } else {
    return true;
  }
};

jump = function(player) {
  if (player.height <= bottom) {
    player.jumps = true;
  } else if (player.height >= jumpHeight + bottom) {
    player.jumps = false;
    player.falls = true;
  }
  if (player.jumps) {
    player.height += 10 * player.speed;
  } else if (player.falls) {
    player.height -= 10 * player.speed;
    if (player.height <= bottom) {
      player.falls = false;
    }
  }
  player.dom.style.bottom = player.height + "px";
  return true;
};

updateObjects = function() {
  fallObjects();
  fillObjectList();
  return true;
};

fallObjects = function() {
  var object, _i, _len;
  for (_i = 0, _len = objectList.length; _i < _len; _i++) {
    object = objectList[_i];
    falls(object);
  }
  return true;
};

fillObjectList = function() {
  var index, object;
  if (queue.length > 0) {
    fallCount += 1;
    if (fallCount >= fallRound && Math.floor(Math.random() * 3) >= 2) {
      object = queue[0];
      object.side = getNewColumn() * columnWidth + columnWidth;
      object.dom.style.left = object.side + "px";
      objectList.push(object);
      index = queue.indexOf(object);
      queue.splice(index, 1);
      fallCount = 0;
    }
  }
  return true;
};

falls = function(object) {
  object.height -= object.velo;
  if (object.height <= bottom) {
    objectDown(object);
  }
  object.dom.style.bottom = object.height + "px";
  return true;
};

getNewColumn = function() {
  return Math.floor(Math.random() * 13);
};

checkCollisions = function() {
  var object, _i, _len;
  for (_i = 0, _len = objectList.length; _i < _len; _i++) {
    object = objectList[_i];
    checkCollision(object);
  }
  return true;
};

checkCollision = function(object) {
  var player, _i, _len;
  for (_i = 0, _len = players.length; _i < _len; _i++) {
    player = players[_i];
    if ((player.height + playerHeight) >= (object.height + tollerance) && player.side + tollerance <= object.side && (player.side + playerWidth) >= (object.side + objectWidth + tollerance)) {
      collect(player, object);
    }
  }
  return true;
};

objectDown = function(object) {
  var index;
  object.height = heaven;
  object.dom.style.bottom = heaven + "px";
  queue.push(object);
  index = objectList.indexOf(object);
  objectList.splice(index, 1);
  calcSide(object);
  return true;
};

calcSide = function(object) {
  object.dom.style.left = object.side + "px";
  return true;
};

collect = function(player, object) {
  player.score += object.value;
  player.scoreDom.innerHTML = player.score;
  influencePlayer(player, object);
  objectDown(object);
  return true;
};

influencePlayer = function(player, object) {
  if (object.name === 'bomb') {
    player.influence = bombTime;
    player.speed = bombSpeed;
    stk.framework.sendMessage('custommessage', {
      type: 'addVibratePattern',
      sendTo: [getClientID(player)],
      pattern: {
        id: "viacustommessage",
        timestamp: new Date().getTime() + 2000,
        list: [0, 2000, 500, 2000]
      }
    });
  } else if (object === 'power') {
    player.influence = powerTime;
    player.speed = powerSpeed;
  }
  return true;
};

clear = function() {
  var player, _i, _len;
  for (_i = 0, _len = players.length; _i < _len; _i++) {
    player = players[_i];
    player.up = false;
    player.left = false;
    player.right = false;
  }
  return true;
};

getClientID = function(player) {
  var id, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = playerMap.length; _i < _len; _i++) {
    id = playerMap[_i];
    if (playerMap[id] === player) {
      _results.push(id);
    } else {
      _results.push(void 0);
    }
  }
  return _results;

  /*
  stk.framework
  
  stk.framework.timer [TIME_IN_MS as int, FUNCTION_NAME]
  every TIME_IN_MS milli seconds repeat FUNCTION_NAME 
  
  stk.framework.delay TIME_IN_MS, FUNCTION_NAME
  after TIME_IN_MS milli seconds execute FUNCTION_NAME once
  
  stk.framework.isVibrationSupported
  returns [true | false]
  
  stk.framework.addVibratePattern pattern
  pattern={id:STRING,timestamp:[timestamp|0],list:[PAUSE_MS,VIBRATE_MS,PAUSE_MS,VIBRATE_MS,...,PAUSE_MS,VIBRATE_MS]}
  id: identifier of a pattern
  timstamp: starttime as local timestamp.
          if the timestamp lays in the past list will be truncated by the difference of timestamp to local time
          if the timestamp till the time of the last ms of the last VIBRATE_MS lays bevore the local time the pattern will be dropped
          if timestamp == 0 the pattern will be started immediately
          if a new pattern starts while another pattern runs, the runnig pattern will be played and the part of new pattern that lasts longer than the playing pattern will be played subsequent to end of the running pattern. No pattern mixing occurs 
  Example
  pattern={id:"whge",timestamp:new Date().getTime()+2200,list:[500,1000,200,300]}
  
  stk.framework.removeVibratePattern id
  removes a pattern from scheduling
  if the pattern is playing it will be stopped
  succeeding pattern will be left unchanged, notably beforehand truncated patten will NOT be brought to their original state, there will be a pause in the amount of time the removed pattern would have been played
   */
};


/*
you may get your own cliendID via stk.framework.getClientID()
 */


/*
With the 'custommessage' type  you can send your custom messages to all clients in your group
The 'custommessage' type is also capable to send messages to one ore more specific clients
If you provide an empty list to the sendTo attribute (or omit the sendTo attribute) your message will be broadcasted to any client in your group.
Otherwise, if you declare one or more client ids in the sendTo list, your message will be send only to the listed clients.
 */


/*
Doing "onLoad"-Stuff
If you want a function be called after the last script (it is this script - custom_end.coffee/custom_end.js) is loaded, add your code here.
If it should be executed after the "loading..." animation ends, add a delay call of 1200 ms
 */
