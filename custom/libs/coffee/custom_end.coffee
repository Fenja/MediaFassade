#   cfcoptions : { "out": "../js/"  }

###

The compiled custom_body.js will be included at the end of the html body section after the include of socket.io and stk-framework.
Define your functions here.

###

customLogger=(s)->
  console.log "customLogger",s
  
customLoggerT=()->
  ###customLogger "Timer"###
  update()
  clear()
  
customLoggerD=()->
  ###customLogger "Delay"###
  #resize()
  stk.framework.timer 100, customLoggerT
  
stk.framework.delay 500, customLoggerD

### Define your handler ###

# handler for custom messages #
custom_message_handler=(msg)->
  console.log 'Do something with msg: '+JSON.stringify msg
  
# handler for events of draggable_keylistener #
draggable_keylistener_handler=(msg)->
  console.log 'Do something with msg: '+JSON.stringify msg
  directionKey(msg)

# handler for events of draggable_joystick #
draggable_joystick_handler=(msg)->
  console.log 'Do something with msg: '+JSON.stringify msg
  directionJoystick(msg)
  
# handler for events of draggable_orientationsensor #
draggable_orientationsensor_handler=(msg)->
  #console.log msg.isup
  upsideDownDevice(msg)
  
  directionOrientation(msg)

# handler for events of draggable_accelerationsensor #
draggable_accelerationsensor_handler=(msg)->
  #console.log "move it",msg.dev
  directionAcceleration(msg)
  #console.log 'Do something with msg: '+JSON.stringify msg
  
# handler for events of draggable_touchpad #
draggable_touchpad_handler=(msg)->
  id = msg.envelop.clientid
  player = playerMap[id]
  if player!=undefined
    activatePlayer(player)

  
### Register your handler ###
stk.framework.register_handler 'custommessage', custom_message_handler
stk.framework.register_handler 'draggable_joystick', draggable_joystick_handler
stk.framework.register_handler 'draggable_keylistener', draggable_keylistener_handler
stk.framework.register_handler 'draggable_orientationsensor', draggable_orientationsensor_handler
stk.framework.register_handler 'draggable_accelerationsensor', draggable_accelerationsensor_handler
stk.framework.register_handler 'draggable_touchpad', draggable_touchpad_handler

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

fps = 50
running = true
tollerance = -2

gravity = 5
heaven = parseInt($('#blend').css('height'),10)*5
bottom = 0
jumpHeight = 300

updownDefault=3
leftrightDefault=0.8

player1 = {
  name: "player1"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: {updown:updownDefault,leftright:leftrightDefault}
  height: bottom
  side: 50 #px
  influenceTime: 0
  dom: $('#player1')
  basketDom: $('#basket1')
  basketimageDom: $('#basketimage1')
  score: 0
  scoreDom: $('#score1')
  time: 0
  isActive:false
  basketTurnedOver:new Date().getTime() /1000
  waitForBasket:false
  timeout: $('#timeout1')
}

player2 = {
  name: "player2"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: {updown:updownDefault,leftright:leftrightDefault}
  height: bottom
  side: 250
  influenceTime: 0
  dom: $('#player2')
  basketDom: $('#basket2')
  basketimageDom: $('#basketimage2')
  score: 0
  scoreDom: $('#score2')
  time: 0
  isActive:false
  basketTurnedOver:new Date().getTime() /1000
  waitForBasket:false
  timeout: $('#timeout2')
}

player3 = {
  name: "player3"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: {updown:updownDefault,leftright:leftrightDefault}
  height: bottom
  side: 250
  influenceTime: 0
  dom: $('#player3')
  basketDom: $('#basket3')
  basketimageDom: $('#basketimage3')
  score: 0
  scoreDom: $('#score3')
  time: 0
  isActive:false
  basketTurnedOver:new Date().getTime() /1000
  waitForBasket:false
  timeout: $('#timeout3')
}

player4 = {
  name: "player4"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: {updown:updownDefault,leftright:leftrightDefault}
  height: bottom
  side: 250
  influenceTime: 0
  dom: $('#player4')
  basketDom: $('#basket4')
  basketimageDom: $('#basketimage4')
  score: 0
  scoreDom: $('#score4')
  time: 0
  isActive:false
  basketTurnedOver:new Date().getTime() /1000
  waitForBasket:false
  timeout: $('#timeout4')
}

player5 = {
  name: "player5"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: {updown:updownDefault,leftright:leftrightDefault}
  height: bottom
  side: 250
  influenceTime: 0
  dom: $('#player5')
  basketDom: $('#basket5')
  basketimageDom: $('#basketimage5')
  score: 0
  scoreDom: $('#score5')
  time: 0
  isActive:false
  basketTurnedOver:new Date().getTime() /1000
  waitForBasket:false
  timeout: $('#timeout5')
}

player6 = {
  name: "player6"
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  speed: {updown:updownDefault,leftright:leftrightDefault}
  height: bottom
  side: 250
  influenceTime: 0
  dom: $('#player6')
  basketDom: $('#basket6')
  basketimageDom: $('#basketimage6')
  score: 0
  scoreDom: $('#score6')
  time: 0
  isActive:false
  basketTurnedOver:new Date().getTime() /1000
  waitForBasket:false
  timeout: $('#timeout6')
}

playerMap = {}  
  
players = []
inactivePlayers = []
unregisteredPlayer = [player2, player1, player4, player5, player3, player6]
playerWidth = parseInt(player1.dom.css('width'))
playerHeight = parseInt(player1.dom.css('height'))
basketTollerance = 20
timeLimit = 10
fadeLimit = 55

object0 = 
  value: 0
  name: 'zero'
  height: heaven
  velo: 5
  side: 10
  dom: $('#zero')

object1 = 
  value: 1
  name: 'one'
  height: heaven
  velo: 5
  side: 40
  dom: $('#one')

object2 = 
  value: 2
  name: 'two'
  height: heaven
  velo: gravity
  side: 40
  dom: $('#two')
  
objectBomb =
  value: -1
  name: 'bomb'
  height: heaven
  velo: gravity
  side: 40
  dom: $('#bomb')

objectPower = 
  value: 1
  name: 'power'
  height: heaven
  velo: gravity
  side: 40
  dom: $('#power')

objectWidth = parseInt(object1.dom.css('width'))

objects = [object0, object1, object2, objectBomb, objectPower]
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
  if playerMap[id]!=undefined
    if playerMap[id] in players
      playerMap[id]
    else
      undefined
  else
    registerPlayer(id)
    
directionAcceleration=(msg)->  
  player = getPlayer(msg.envelop.clientid)
  if player!=undefined
    if msg.dev.z>10
      player.jumps = true
  true


directionOrientation=(msg)->  
  player = getPlayer(msg.envelop.clientid)
  if player!=undefined && player.isActive
    if Math.abs(msg.b)>10
      player.speed.leftright=Math.abs(Math.max(50,msg.b))/10
    if msg.b>10
      player.right = true
    if msg.b<-10
      player.left = true
  true

upsideDownDevice=(msg)->
  id = msg.envelop.clientid
  
  player = playerMap[id]
  if player!=undefined 
    
    if player.waitForBasket
    
      if !player.isActive && !msg.isup
        player.basketTurnedOver=new Date().getTime() /1000+10
        player.waitForBasket=false
        console.log "BASKET TURNED OVER @ ",player.basketTurnedOver
        
        
    else
      now=new Date().getTime() /1000
      
      if !player.isActive && !msg.isup
        console.log "BASKET TURNED OVER waiting ",player.basketTurnedOver,id,"wait",now,player.basketTurnedOver
        countdown=Math.max(Math.floor(player.basketTurnedOver-now),0)
        player.dom.css('opacity', 0.8)
        if countdown<5
          player.timeout.html(countdown+" Korb umdrehen !")
        else
          player.timeout.html(countdown)
    
      if !player.isActive && msg.isup && player.basketTurnedOver<=now
        console.log "TURN ON PLAYER ",id
        player.timeout.html("###")
        activatePlayer(player)
      if !player.isActive && msg.isup && player.basketTurnedOver>now
        console.log "TURN ON PLAYER ",id,"wait",player.basketTurnedOver-now
        countdown=Math.max(Math.floor(player.basketTurnedOver-now),0)
        player.dom.css('opacity', 0.8)
        player.timeout.html(countdown)
      
      
      
  else
    console.log "player "+id+"undefined",playerMap
  
directionJoystick=(msg)->
  player = getPlayer(msg.envelop.clientid)
  if player!=undefined
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
  
directionKey=(msg)->
  id = msg.envelop.clientid

  player = getPlayer(id)
  console.log player,id 
  if player!=undefined
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
  console.log "registerPlayer",unregisteredPlayer
  if (unregisteredPlayer.length > 0)
    player = unregisteredPlayer.pop()
    inactivePlayers.push(player)
    activatePlayer(player)
    
    playerMap[id] = player
    console.log "playerMap",playerMap
    player.dom.css('left', 10 +"px")
    player
  else
    undefined
    
activatePlayer=(player)->
  players.push(player)
  index = inactivePlayers.indexOf(player)
  inactivePlayers=inactivePlayers.splice(index)
  player.time = new Date().getTime() /1000
  player.score = 0
  player.dom.css('opacity', 1.0)
  player.dom.css('zIndex', 5)
  player.isActive=true
  player.basketTurnedOver=new Date().getTime() /1000 
  true
  
deactivatePlayer=(player)->
  if player.isActive
    inactivePlayers.push(player)
    index = players.indexOf(player)
    players=players.splice(index)
    player.dom.css('opacity', 0.3)
    player.dom.css('zIndex', 2)
    player.isActive=false
    player.waitForBasket=true
    player.timeout.html("10")
    player.height=bottom
    player.dom.css('bottom', player.height + "px")
    console.log "deactivatePlayer",JSON.stringify(player)    
  ###else
    console.log "player is not active",JSON.stringify(player)###
  true

update=()->
  updatePlayers()
  updateObjects()
  checkCollisions()

updatePlayers=()->
  now = new Date().getTime() /1000
  for player in players
    if updateTime(player, now)
      updatePlayer(player)
  true

updatePlayer=(player)->
  playerLeft = parseInt(player.dom.css('left'))
  basketLeft = parseInt(player.basketDom.css('left'))
  if player.isActive
    if ( player.left && player.side > 0 ) 
      player.side -= 10 * player.speed.leftright
      if (basketLeft <= -1 * basketTollerance)
        player.dom.css('left', player.side + "px")        
      else
        player.basketDom.css('left', (player.side - playerLeft) + "px")
        
    else if ( player.right && player.side + playerWidth < viewportWidth )
      player.side += 10*player.speed.leftright
      player.dom.css('left', player.side + "px")
      if (basketLeft >= basketTollerance)
        player.dom.css('left', player.side + "px")
      else
        player.basketDom.css('left', (player.side - playerLeft) + "px")
    
    if (player.jumps || player.falls)
      jump(player)
      player.dom.css('left', player.side + "px")
      player.basketDom.css('left', "0px")
    else if ( player.up )
      jump(player)
      player.dom.css('left', player.side + "px")
      player.basketDom.css('left', "0px")
      
    updateInfluence(player)
    
      
  else if (player.jumps || player.falls)
    jump(player)
    player.basketDom.css('left', player.side + "px")
    player.basketDom.css('left', "0px")
  
  
  true
  
updateInfluence=(player)->
  if player.influence > 0
    player.influence -= 1
    if player.influence == 0
      player.speed = {updown:updownDefault,leftright:leftrightDefault}
  true
  
updateTime=(player, now)->  
  if (now - player.time) >= timeLimit
    deactivatePlayer(player)
    false
  else if (now - player.time) >= fadeLimit
    player.dom.css('opacity', 0.7)
    true
  else
    timeleft=Math.max(0,timeLimit-Math.floor(now-player.time))
    if timeleft<21
      player.timeout.html("Noch "+timeleft+"s")
    if timeleft<6 && timeleft>0
      player.dom.not(':animated').effect('pulsate', {times:4}, 500, ()-> )
      player.timeout.html("Noch "+timeleft+"s")    
    else
      player.timeout.html("")
    true
  
jump=(player)->
  if (player.height <= bottom)
    player.jumps = true
  else if (player.height >= jumpHeight + bottom)
    player.jumps = false
    player.falls = true

  if (player.jumps)
    player.height += 10 * player.speed.updown
  else if (player.falls)
    player.height -= 10 * player.speed.updown
    if (player.height <= bottom)
      player.falls = false   
      
  player.dom.css('bottom', player.height + "px")
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
    #if ( fallCount >= fallRound && Math.floor(Math.random() * 3) >= 2 )
    if ( fallCount >= fallRound )
      object = queue[0]
      object.side = getNewColumn() * columnWidth + columnWidth
      object.dom.css('left', object.side + "px")
      objectList.push object
      index = queue.indexOf(object)
      queue.splice(index,1)
      fallCount = 0
  true
      
falls=(object)->
  if object != undefined
    object.height -= object.velo
    if (object.height <= bottom)
      objectDown(object)
    object.dom.css('bottom',object.height + "px")
  true
  
getNewColumn=()->
  Math.floor(Math.random() * columns)
  
checkCollisions=()->
  for object in objectList
    checkCollision(object)
  true
  
checkCollision=(object)->
  for player in players
    if(object!=undefined && player.isActive)
      #console.log JSON.stringify(player.basketimageDom)
      playerPos = player.basketimageDom.offset()
      playerPos.top=parseInt(playerPos.top,10)
      playerPos.left=parseInt(parseInt(playerPos.left,10)/10*9)
      playerPos.right=playerPos.left+parseInt(player.basketimageDom.css('width'),10)
      playerPos.right=parseInt(playerPos.right/10*11)
      playerPos.bottom=playerPos.top+parseInt(player.basketimageDom.css('height'),10)
      
      objPos = object.dom.offset()
      objPos.top=parseInt(objPos.top,10)
      objPos.left=parseInt(objPos.left,10)
      objPos.right=objPos.left+parseInt(player.dom.css('width'),10)
      objPos.bottom=objPos.top+parseInt(player.dom.css('height'),10)
      objPos.middle=parseInt((objPos.right-objPos.left)/2+objPos.left,10)
      
      #console.log JSON.stringify(playerPos)
      lrtest=objPos.middle>=playerPos.left && objPos.middle<=playerPos.right
      udtest=objPos.bottom>=playerPos.top && objPos.bottom<=playerPos.bottom 
      
      if lrtest && udtest        
        switch object.name
          when 'bomb'
            player.dom.not(':animated').effect('shake', {times:4}, 500, ()-> )
          when 'power'
            player.dom.not(':animated').effect('highlight', {times:4}, 500, ()-> )
        collect(player, object)
       
       
  true
  
objectDown=(object)->
  object.height = heaven
  object.dom.css('bottom', heaven + "px")
  queue.push object
  index = objectList.indexOf(object)
  objectList.splice(index,1)
  calcSide(object)
  true
  
calcSide=(object)->
  object.dom.css('left', object.side + "px")
  true
  
collect=(player, object)->
  console.log "Collected Object"
  player.score += object.value
  player.scoreDom.html(player.score)
  influencePlayer(player, object)
  objectDown(object)
  true
  
influencePlayer=(player, object)->
  if (object.name == 'bomb')
    player.influence = bombTime
    player.speed = {updown:bombSpeed,leftright:bombSpeed}
    stk.framework.sendMessage('custommessage',{type:'addVibratePattern',sendTo:[getClientID(player)],pattern:{id:"viacustommessage",timestamp:new Date().getTime()+2000,list:[0,2000,500,2000]}}) 
  else if (object == 'power')
    player.influence = powerTime
    player.speed = {updown:powerSpeed,leftright:powerSpeed}
  true
  
clear=()->
  for player in players
    player.up = false
    player.left = false
    player.right = false
  true
  
getClientID=(player)->
  for id in playerMap
    if playerMap[id] == player
      id
  
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
