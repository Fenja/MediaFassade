// Generated by CoffeeScript 1.10.0

/*

The compiled custom_body.js will be included at the end of the html body section after the include of socket.io and stk-framework.
Define your functions here.
 */

(function() {
  var Element, Player, basketTollerance, bombSpeed, bombTime, bottom, calcSide, checkCollision, checkCollisions, clear, collect, columnWidth, columns, countDown, createNewElement, customLogger, customLoggerD, customLoggerT, custom_message_handler, destroyElement, directionAcceleration, directionJoystick, directionKey, directionOrientation, draggable_accelerationsensor_handler, draggable_keylistener_handler, draggable_orientationsensor_handler, draggable_touchpad_handler, elementDown, elementIDCount, elementList, elementRandomList, fadeLimit, fallCount, fallElements, fallRound, falls, fillElementList, fps, gameCountDown, gameOver, getClientID, getElementIDCount, getNewColumn, getPlayer, getValue, gravity, heaven, influencePlayer, initPlayer, jump, jumpHeight, lastColumn, leftrightDefault, mockupClientIDs, playerHeight, playerMap, playerStrings, playerWidth, players, powerSpeed, powerTime, readyAndGo, running, startCountDown, timeLimit, tollerance, update, updateElements, updateInfluence, updatePlayer, updatePlayers, updownDefault, upsideDownDevice, values, viewportHeight, viewportWidth,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  customLogger = function(s) {
    return console.log("customLogger", s);
  };

  customLoggerT = function() {

    /*customLogger "Timer" */
    update();
    return clear();
  };

  customLoggerD = function() {

    /*customLogger "Delay" */
    return stk.framework.timer(100, customLoggerT);
  };

  stk.framework.delay(500, customLoggerD);


  /* Define your handler */

  custom_message_handler = function(msg) {
    return console.log('Do something with msg: ' + JSON.stringify(msg));
  };

  draggable_orientationsensor_handler = function(msg) {};

  draggable_accelerationsensor_handler = function(msg) {
    return true;
  };

  draggable_touchpad_handler = function(msg) {
    return true;
  };

  draggable_keylistener_handler = function(msg) {
    return directionKey(msg);
  };


  /* Register your handler */

  stk.framework.register_handler('custommessage', custom_message_handler);

  stk.framework.register_handler('draggable_orientationsensor', draggable_orientationsensor_handler);

  stk.framework.register_handler('draggable_accelerationsensor', draggable_accelerationsensor_handler);

  stk.framework.register_handler('draggable_touchpad', draggable_touchpad_handler);

  stk.framework.register_handler('draggable_keylistener', draggable_keylistener_handler);


  /*
  Doing "onLoad"-Stuff
  If you want a function be called after the last script (it is this script - custom_end.coffee/custom_end.js) is loaded, add your code here.
  If it should be executed after the "loading..." animation ends, add a delay call of 1200 ms
   */

  console.log("ready");

  readyAndGo = function() {
    console.log("go");
    return initPlayer();
  };

  stk.framework.delay(1200, readyAndGo);

  gameCountDown = 30;

  countDown = function() {
    if (gameCountDown >= 0) {
      console.log(gameCountDown);
      return gameCountDown -= 1;
    } else {
      return gameOver;
    }
  };

  startCountDown = function() {
    return stk.framework.timer(1000, countDown);
  };

  stk.framework.delay(3000 * 60, startCountDown);

  gameOver = function() {
    console.log("GameOver");
    return location.href = "scores.html";
  };


  /* own code */

  heaven = 1000;

  bottom = 0;


  /* objects */

  Element = (function() {
    function Element(defaultParameters) {
      if (defaultParameters == null) {
        defaultParameters = {};
      }
      this.id = defaultParameters.id;
      this.value = defaultParameters.value || 0;
      this.name = defaultParameters.name || '';
      this.height = defaultParameters.height || heaven;
      this.velo = 5;
      this.side = defaultParameters.side || 10;
      this.dom = defaultParameters.dom || document.getElementById(defaultParameters.id);
    }

    return Element;

  })();

  Player = (function() {
    function Player(defaultParameters) {
      if (defaultParameters == null) {
        defaultParameters = {};
      }
      this.name = defaultParameters.name || 'player';
      this.up = false;
      this.left = false;
      this.right = false;
      this.jumps = false;
      this.falls = false;
      this.height = defaultParameters.height || bottom;
      this.speed = {
        updown: updownDefault,
        leftright: leftrightDefault
      };
      this.side = defaultParameters.side || 50;
      this.influenceTime = 0;
      this.dom = defaultParameters.dom;
      this.basketDom = defaultParameters.basketDom;
      this.score = 0;
      this.scoreDom = defaultParameters.scoreDom;
      this.time = 0;
      this.isActive = true;
    }

    return Player;

  })();

  viewportHeight = window.innerHeight;

  viewportWidth = window.innerWidth;

  fps = 50;

  running = true;

  tollerance = -2;

  gravity = 5;

  jumpHeight = 300;

  updownDefault = 3;

  leftrightDefault = 0.8;

  playerMap = {};

  players = [];

  playerWidth = 10;

  playerHeight = 10;

  basketTollerance = 20;

  timeLimit = 120;

  fadeLimit = 55;

  fallCount = 0;

  fallRound = 20;

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
    if (playerMap[id] !== void 0) {
      if (ref = playerMap[id], indexOf.call(players, ref) >= 0) {
        return playerMap[id];
      } else {
        return void 0;
      }
    }
  };

  directionAcceleration = function(msg) {
    var player;
    player = getPlayer(msg.envelop.clientid);
    if (player !== void 0) {
      if (msg.dev.z > 10) {
        player.jumps = true;
      }
    }
    return true;
  };

  directionOrientation = function(msg) {
    var player;
    player = getPlayer(msg.envelop.clientid);
    if (player !== void 0 && player.isActive) {
      if (msg.b > 10) {
        player.right = true;
      }
      if (msg.b < -10) {
        player.left = true;
      }
    }
    return true;
  };

  upsideDownDevice = function(msg) {
    var countdown, id, now, player;
    id = msg.envelop.clientid;
    player = playerMap[id];
    if (player !== void 0) {
      if (player.waitForBasket) {
        if (!player.isActive && !msg.isup) {
          player.basketTurnedOver = new Date().getTime() / 1000 + 10;
          player.waitForBasket = false;
          return console.log("BASKET TURNED OVER @ ", player.basketTurnedOver);
        }
      } else {
        now = new Date().getTime() / 1000;
        if (!player.isActive && !msg.isup) {
          console.log("BASKET TURNED OVER waiting ", player.basketTurnedOver, id, "wait", now, player.basketTurnedOver);
          countdown = Math.max(Math.floor(player.basketTurnedOver - now), 0);
          player.dom.css('opacity', 0.8);
          if (countdown < 5) {
            player.timeout.html(countdown + " Korb umdrehen !");
          } else {
            player.timeout.html(countdown);
          }
        }
        if (!player.isActive && msg.isup && player.basketTurnedOver <= now) {
          console.log("TURN ON PLAYER ", id);
          player.timeout.html("###");
          activatePlayer(player);
        }
        if (!player.isActive && msg.isup && player.basketTurnedOver > now) {
          console.log("TURN ON PLAYER ", id, "wait", player.basketTurnedOver - now);
          countdown = Math.max(Math.floor(player.basketTurnedOver - now), 0);
          player.dom.css('opacity', 0.8);
          return player.timeout.html(countdown);
        }
      }
    } else {
      return console.log("player " + id + "undefined", playerMap);
    }
  };

  directionJoystick = function(msg) {
    var player, type, x, y;
    player = getPlayer(msg.envelop.clientid);
    if (player !== void 0) {
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

  directionKey = function(msg) {
    var code, i, keys, len, player;
    player = getPlayer(msg.envelop.clientid);
    if (player !== void 0) {
      keys = msg.keys;
      for (i = 0, len = keys.length; i < len; i++) {
        code = keys[i];
        if (code === 37) {
          player.left = true;
        }
        if (code === 38) {
          player.up = true;
        }
        if (code === 39) {
          player.right = true;
        }
      }
    }
    return true;
  };

  mockupClientIDs = {
    'player1': 'xsctfyrh',
    'player2': 'd4sewseg'
  };

  playerStrings = ['player1', 'player2'];

  initPlayer = function() {
    playerObject;
    var clientID, div, i, len, player, playerObject, playerid;
    for (i = 0, len = playerStrings.length; i < len; i++) {
      player = playerStrings[i];
      clientID = mockupClientIDs[player];
      console.log(player + ": " + clientID);
      playerid = player.slice(-1);
      div = document.createElement('div');
      div.id = player;
      div.className = 'player';
      div.innerHTML = '<img id="' + player + '" src="images/chara0' + playerid + '.svg"><img id="basket' + playerid + '" class="basket" src="images/chara0' + playerid + '_basket.svg">';
      document.getElementById('player-div').appendChild(div);
      playerObject = new Player({
        name: player,
        side: 100,
        dom: $('#' + player),
        basketDom: $('#basket' + playerid),
        scoreDom: $('#score' + playerid),
        timeout: $('#timeout1')
      });
      playerMap[clientID] = playerObject;
      players.push(playerObject);
    }
    playerWidth = parseInt(playerObject.dom.css('width'));
    playerHeight = parseInt(playerObject.dom.css('height'));
    return true;
  };

  elementList = [];

  elementRandomList = ['bomb', 'power', 'one', 'one', 'two', 'two', 'zero', 'zero', 'one', 'one', 'two', 'two', 'zero', 'zero'];

  elementIDCount = {
    'bomb': 0,
    'power': 0,
    'zero': 0,
    'one': 0,
    'two': 0
  };

  values = {
    'bomb': -2,
    'power': 3,
    'zero': 0,
    'one': 1,
    'two': 2
  };

  createNewElement = function(element) {
    var div, elementWithID, newElement;
    div = document.createElement('div');
    elementWithID = element + getElementIDCount(element);
    div.id = elementWithID;
    div.className = 'element';
    div.innerHTML = '<img src="images/' + element + '.svg">';
    document.getElementById('element-div').appendChild(div);
    newElement = new Element({
      id: elementWithID,
      name: element,
      side: getNewColumn() * columnWidth + columnWidth,
      height: heaven,
      dom: $('#' + elementWithID),
      value: getValue(element)
    });
    newElement.dom.css('left', newElement.side + "px");
    return elementList.push(newElement);
  };

  getValue = function(element) {
    return values[element];
  };

  getElementIDCount = function(element) {
    var id;
    id = elementIDCount[element];
    elementIDCount[element] = id + 1 % 10;
    return id;
  };

  destroyElement = function(element) {
    var deadElem;
    deadElem = document.getElementById(element.id);
    return deadElem.parentNode.removeChild(deadElem);
  };

  update = function() {
    updatePlayers();
    updateElements();
    return checkCollisions();
  };

  updatePlayers = function() {
    var i, len, now, player;
    now = new Date().getTime() / 1000;
    for (i = 0, len = players.length; i < len; i++) {
      player = players[i];
      updatePlayer(player);
    }
    return true;
  };

  updatePlayer = function(player) {
    var basketLeft, playerLeft;
    playerLeft = parseInt(player.dom.css('left'));
    basketLeft = parseInt(player.basketDom.css('left'));
    if (player.left && player.side > 0) {
      player.side -= 5 * player.speed.leftright;
      if (basketLeft <= -1 * basketTollerance) {
        player.dom.css('left', player.side + "px");
      } else {
        player.basketDom.css('left', parseInt((player.side - playerLeft) / 2) + "px");
      }
    }
    if (player.right && player.side + playerWidth < viewportWidth) {
      player.side += 5 * player.speed.leftright;
      if (basketLeft >= basketTollerance) {
        player.dom.css('left', player.side + "px");
      } else {
        player.basketDom.css('left', parseInt((player.side - playerLeft) / 2) + "px");
      }
    }
    if (player.jumps || player.falls) {
      jump(player);
      player.dom.css('left', player.side + "px");
      player.basketDom.css('left', "0px");
    } else if (player.up) {
      jump(player);
      player.dom.css('left', player.side + "px");
      player.basketDom.css('left', "0px");
    }
    updateInfluence(player);
    return true;
  };

  updateInfluence = function(player) {
    if (player.influence > 0) {
      player.influence -= 1;
      if (player.influence === 0) {
        player.speed = {
          updown: updownDefault,
          leftright: leftrightDefault
        };
      }
    }
    return true;
  };

  updateElements = function() {
    fallElements();
    fillElementList();
    return true;
  };

  jump = function(player) {
    if (player.height <= bottom) {
      player.jumps = true;
    } else if (player.height >= jumpHeight + bottom) {
      player.jumps = false;
      player.falls = true;
    }
    if (player.jumps) {
      player.height += 5 * player.speed.updown;
    } else if (player.falls) {
      player.height -= 5 * player.speed.updown;
      if (player.height <= bottom) {
        player.falls = false;
      }
    }
    player.dom.css('bottom', player.height + "px");
    return true;
  };

  fallElements = function() {
    var element, i, len;
    for (i = 0, len = elementList.length; i < len; i++) {
      element = elementList[i];
      falls(element);
    }
    return true;
  };

  fillElementList = function() {
    var element, elementName;
    fallCount += 1;
    if (fallCount >= fallRound && Math.floor(Math.random() * 3) >= 2) {
      elementName = elementRandomList[Math.floor(Math.random() * elementRandomList.length) - 1];
      if (elementName !== void 0) {
        element = createNewElement(elementName);
        elementList.push(element);
        fallCount = 0;
      }
    }
    return true;
  };

  falls = function(object) {
    if (object !== void 0) {
      object.height -= object.velo;
      if (object.height <= bottom) {
        elementDown(object);
      }
      if (object.dom !== void 0) {
        object.dom.css('bottom', object.height + "px");
      }
    }
    return true;
  };

  getNewColumn = function() {
    return Math.floor(Math.random() * columns);
  };

  checkCollisions = function() {
    var i, len, object;
    for (i = 0, len = elementList.length; i < len; i++) {
      object = elementList[i];
      checkCollision(object);
    }
    return true;
  };

  checkCollision = function(object) {
    var basket, basketBottom, basketDomHeight, basketLeft, elem, elemBottom, elemLeft, i, len, lrtest, player, udtest;
    for (i = 0, len = players.length; i < len; i++) {
      player = players[i];
      if (object !== void 0 && player.isActive && object.dom !== void 0) {
        basket = player.basketDom;
        elem = object.dom;
        basketLeft = parseInt(basket.css('left')) + parseInt(player.dom.css('left'));
        basketBottom = parseInt(player.dom.css('bottom'));
        basketDomHeight = parseInt(basket.css('height'));
        elemLeft = parseInt(elem.css('left'));
        elemBottom = parseInt(elem.css('bottom'));
        lrtest = elemLeft >= basketLeft && elemLeft + parseInt(elem.css('width')) <= basketLeft + parseInt(basket.css('width'));
        udtest = elemBottom >= (basketBottom + basketDomHeight / 3) && elemBottom <= (basketBottom + basketDomHeight / 2);
        if (lrtest && udtest) {
          switch (object.name) {
            case 'bomb':
              player.dom.not(':animated').effect('shake', {
                times: 4
              }, 500, function() {});
              break;
            case 'power':
              player.dom.not(':animated').effect('highlight', {
                times: 4
              }, 500, function() {});
          }
          collect(player, object);
        }
      }
    }
    return true;
  };

  elementDown = function(object) {
    var index;
    console.log("element down: " + object.id);
    index = elementList.indexOf(object);
    elementList.splice(index, 1);
    destroyElement(object);
    return true;
  };

  calcSide = function(object) {
    object.dom.css('left', object.side + "px");
    return true;
  };

  collect = function(player, object) {
    console.log("Collected Object");
    player.score += object.value;
    player.scoreDom.html(player.score);
    influencePlayer(player, object);
    elementDown(object);
    return true;
  };

  influencePlayer = function(player, object) {
    if (object.name === 'bomb') {
      player.influence = bombTime;
      player.speed = {
        updown: bombSpeed,
        leftright: bombSpeed
      };
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
      player.speed = {
        updown: powerSpeed,
        leftright: powerSpeed
      };
    }
    return true;
  };

  clear = function() {
    var i, len, player;
    for (i = 0, len = players.length; i < len; i++) {
      player = players[i];
      player.up = false;
      player.left = false;
      player.right = false;
    }
    return true;
  };

  getClientID = function(player) {
    var i, id, len, results;
    results = [];
    for (i = 0, len = playerMap.length; i < len; i++) {
      id = playerMap[i];
      if (playerMap[id] === player) {
        results.push(id);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

}).call(this);
