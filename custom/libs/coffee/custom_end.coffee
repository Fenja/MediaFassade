#   cfcoptions : { "out": "../js/"  }

###

The compiled custom_body.js will be included at the end of the html body section after the include of socket.io and stk-framework.
Define your functions here.

###

customLogger=(s)->
  console.log s
  
customLoggerT=()->
  ###customLogger "Timer"###
  update()
  clear()
  
customLoggerD=()->
  ###customLogger "Delay"###
  stk.framework.timer 100, customLoggerT
  
stk.framework.delay 500, customLoggerD

### Define your handler ###

# handler for events of draggable_keylistener #
draggable_keylistener_handler=(msg)->
  directionKey(msg)
  console.log 'Do something with msg: '+JSON.stringify msg

# handler for events of draggable_joystick #
draggable_joystick_handler=(msg)->
  directionJoystick(msg)
  console.log 'Do something with msg: '+JSON.stringify msg
  
  # handler for events of draggable_positionsensor #
draggable_positionsensor_handler=(msg)->
  console.log 'Do something with msg: '+JSON.stringify msg
  
### Register your handler ###
stk.framework.register_handler 'draggable_joystick', draggable_joystick_handler
stk.framework.register_handler 'draggable_keylistener', draggable_keylistener_handler
stk.framework.register_handler 'draggable_positionsensor', draggable_positionsensor_handler

###
Doing "onLoad"-Stuff
If you want a function be called after the last script (it is this script - custom_end.coffee/custom_end.js) is loaded, add your code here.
If it should be executed after the "loading..." animation ends, add a delay call of 1200 ms

###

console.log "ready"
readyAndGo=()->
  console.log "go"
stk.framework.delay 1200, readyAndGo

### own code ###

viewportHeight = window.innerHeight
viewportWidth = window.innerWidth

emailhash1 = "b99a950fa0b095ac59bec541a441b1b0"
emailhash2 = "4d6ab0c2e472248f4fa9bfd682345297"

fps = 50
running = true
tollerance = 5

gravity = 5
heaven = viewportHeight
bottom = 0
jumpHeight = 300

player1 = {
  name: "player1"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: 1
  height: bottom
  side: 50 #px
  influenceTime: 0
  dom: document.getElementById('player1')
  score: 0
  scoreDom: document.getElementById('score1')
  time: 0
}

player2 = {
  name: "player2"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: 1
  height: bottom
  side: 250
  influenceTime: 0
  dom: document.getElementById('player2')
  score: 0
  scoreDom: document.getElementById('score2')
  time: 0
}

player3 = {
  name: "player3"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: 1
  height: bottom
  side: 250
  influenceTime: 0
  dom: document.getElementById('player3')
  score: 0
  scoreDom: document.getElementById('score3')
  time: 0
}

player4 = {
  name: "player4"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: 1
  height: bottom
  side: 250
  influenceTime: 0
  dom: document.getElementById('player4')
  score: 0
  scoreDom: document.getElementById('score4')
  time: 0
}

player5 = {
  name: "player5"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: 1
  height: bottom
  side: 250
  influenceTime: 0
  dom: document.getElementById('player5')
  score: 0
  scoreDom: document.getElementById('score5')
  time: 0
}

player6 = {
  name: "player6"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: 1
  height: bottom
  side: 250
  influenceTime: 0
  dom: document.getElementById('player6')
  score: 0
  scoreDom: document.getElementById('score6')
  time: 0
}

playerMap = {}  
  
players = []
inactivePlayers = []
unregisteredPlayer = [player2, player1, player4, player5, player3, player6]
playerWidth = parseInt(getComputedStyle(player1.dom).width)
playerHeight = parseInt(getComputedStyle(player1.dom).height)
timeLimit = 60
fadeLimit = 55

object0 = 
  value: 0
  name: 'zero'
  height: heaven
  velo: 5
  side: 10
  dom: document.getElementById('zero')

object1 = 
  value: 1
  name: 'one'
  height: heaven
  velo: 5
  side: 40
  dom: document.getElementById('one')

object2 = 
  value: 2
  name: 'two'
  height: heaven
  velo: gravity
  side: 40
  dom: document.getElementById('two')
  
objectBomb =
  value: 0
  name: 'bomb'
  height: heaven
  velo: gravity
  side: 40
  dom: document.getElementById('bomb')

objectPower = 
  value: 0
  name: 'power'
  height: heaven
  velo: gravity
  side: 40
  dom: document.getElementById('power')

objectWidth = parseInt(getComputedStyle(object1.dom).width)

objectList = []
queue = [object0, object1, object2, objectBomb, objectPower]

fallCount = 0
fallRound = 30
columns = 12
columnWidth = viewportWidth / (2 + columns)
lastColumn = 0
bombTime = 50
powerTime = 75
bombSpeed = 0.5
powerSpeed = 2

### Own methods ###
getPlayer=(id)->
  if playerMap[id]? && playerMap[id] in players
    playerMap[id]
  else
    registerPlayer(id)
  
directionJoystick=(msg, player)->
  id = msg.envelop.clientid
  player = getPlayer(id)
  if (player?)
    x = msg.x
    y = msg.y
    type = msg.type
    if (y < 0.4 && y < x-0.1)
      player.up = true
    else if (x < 0.4 && x < y-0.1)
      player.left = true
    else if (x > 0.6 && x > y+0.1)
      player.right = true
  true
  
directionKey=(msg, player)->
  id = msg.envelop.clientid
  player = getPlayer(id)
  if (player?)
    keys = msg.keys
    for code in keys
      if (code == 37)
        player.left = true
      if (code == 38)
        player.up = true
      if (code == 39)
        player.right = true
  true
  
registerPlayer=(id)->
  if unregisteredPlayer.length > 0
    player = unregisteredPlayer.pop()
    inactivePlayers.push(player)
    activatePlayer(player)
    
    playerMap[id] = player
    console.log "register "+player.name+" for "+id
    
    player.dom.style.left = 10 +"px"
    index = unregisteredPlayer.indexOf(player)
    unregisteredPlayer.splice(index,1)
  true
  
activatePlayer=(player)->
  players.push(player)
  index = inactivePlayers.indexOf(player)
  inactivePlayers.splice(index)
  player.time = new Date().getTime() /1000
  player.score = 0
  player.dom.style.opacity = 1.0
  player.dom.style.zIndex = 5
  true
  
deactivatePlayer=(player)->
  inactivePlayers.push(player)
  index = players.indexOf(player)
  players.splice(index)
  player.dom.style.opacity = 0.3
  player.dom.style.zIndex = 2
  true

update=()->
  updatePlayers()
  updateObjects()
  checkCollisions()

updatePlayers=()->
  now = new Date().getTime() /1000
  for player in players
    updateTime(player, now)
    updatePlayer(player)
  true
  
updatePlayer=(player)->
  if ( player.left && player.side > 0 ) 
    player.side -= 10 * player.speed
  else if ( player.right && player.side + playerWidth < viewportWidth )
    player.side += 10*player.speed
  if (player.jumps || player.falls)
    jump(player)
  else if ( player.up )
    jump(player)
  player.dom.style.left = player.side + "px"
  updateInfluence(player)
  true
  
updateInfluence=(player)->
  if player.influence > 0
    player.influence -= 1
    if player.influence == 0
      player.speed = 1
  true
  
updateTime=(player, now)->
  if (now - player.time) >= timeLimit
    deactivatePlayer(player)
  else if (now - player.time) >= fadeLimit
    player.dom.style.opacity = 0.7    
  true
  
jump=(player)->
  if (player.height <= bottom)
    player.jumps = true
  else if (player.height >= jumpHeight + bottom)
    player.jumps = false
    player.falls = true

  if (player.jumps)
    player.height += 10 * player.speed
  else if (player.falls)
    player.height -= 10 * player.speed
    if (player.height <= bottom)
      player.falls = false   
      
  player.dom.style.bottom = player.height + "px"
  true
  
updateObjects=()->
  fallObjects()
  fillObjectList()
  true
  
fallObjects=()->
  for object in objectList
    falls(object)
  true
      
fillObjectList=()->
  if (queue.length > 0)
    fallCount += 1
    if ( fallCount >= fallRound && Math.floor(Math.random() * 3) >= 2 )
      object = queue[0]
      object.side = getNewColumn() * columnWidth + columnWidth
      object.dom.style.left = object.side + "px"
      objectList.push object
      index = queue.indexOf(object)
      queue.splice(index,1)
      fallCount = 0
  true
      
falls=(object)->
  object.height -= object.velo
  if (object.height <= bottom)
    objectDown(object)
  object.dom.style.bottom = object.height + "px"
  true
  
getNewColumn=()->
  Math.floor(Math.random() * 13)
  
checkCollisions=()->
  for object in objectList
    checkCollision(object)
  true
  
checkCollision=(object)->
  for player in players
    if ((player.height + playerHeight) >= (object.height + tollerance) &&
    player.side + tollerance <= object.side && 
    (player.side + playerWidth) >= (object.side + objectWidth + tollerance))
      collect(player, object)
  true
  
objectDown=(object)->
  object.height = heaven
  object.dom.style.bottom = heaven + "px"
  queue.push object
  index = objectList.indexOf(object)
  objectList.splice(index,1)
  calcSide(object)
  true
  
calcSide=(object)->
  object.dom.style.left = object.side + "px"
  true
  
collect=(player, object)->
  player.score += object.value
  player.scoreDom.innerHTML = player.score
  influencePlayer(player, object)
  objectDown(object)
  true
  
influencePlayer=(player, object)->
  if (object.name == 'bomb')
    player.influence = bombTime
    player.speed = bombSpeed
  else if (object == 'power')
    player.influence = powerTime
    player.speed = powerSpeed
  true
  
clear=()->
  for player in players
    player.up = false
    player.left = false
    player.right = false
  true
  
  ###
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

###

#stk.framework.addVibratePattern {id:"start1",timestamp:new Date().getTime()+200,list:[0,100,50,100]}

#stk.framework.addVibratePattern {id:"start2",timestamp:new Date().getTime()+3000,list:[0,12345]}

###
you may get your own cliendID via stk.framework.getClientID()
###
#console.log "My clientID:", stk.framework.getClientID()

###
With the 'custommessage' type  you can send your custom messages to all clients in your group
The 'custommessage' type is also capable to send messages to one ore more specific clients
If you provide an empty list to the sendTo attribute (or omit the sendTo attribute) your message will be broadcasted to any client in your group.
Otherwise, if you declare one or more client ids in the sendTo list, your message will be send only to the listed clients.

###
#stk.framework.sendMessage('custommessage',{type:'custommessage',sendTo:[stk.framework.getClientID()],txt:"This message goes only to myself "+stk.framework.getClientID()})
#
#stk.framework.sendMessage('custommessage',{type:'addVibratePattern',sendTo:[stk.framework.getClientID()],pattern:{id:"viacustommessage",timestamp:new Date().getTime()+2000,list:[0,2000,500,2000]}})

###
Doing "onLoad"-Stuff
If you want a function be called after the last script (it is this script - custom_end.coffee/custom_end.js) is loaded, add your code here.
If it should be executed after the "loading..." animation ends, add a delay call of 1200 ms

###