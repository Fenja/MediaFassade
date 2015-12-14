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
  stk.framework.timer 100, customLoggerT
  
stk.framework.delay 500, customLoggerD

### Define your handler ###

# handler for custom messages #
custom_message_handler=(msg)->
  console.log 'Do something with msg: '+JSON.stringify msg

# handler for events of draggable_orientationsensor #
draggable_orientationsensor_handler=(msg)->

# handler for events of draggable_accelerationsensor #
draggable_accelerationsensor_handler=(msg)->
  true
  
# handler for events of draggable_touchpad #
draggable_touchpad_handler=(msg)->
  true
  
# handler for events of draggable_keylistener #
draggable_keylistener_handler=(msg)->
#  console.log 'Do something with msg: '+JSON.stringify msg
  directionKey(msg)

  
### Register your handler ###
stk.framework.register_handler 'custommessage', custom_message_handler
stk.framework.register_handler 'draggable_orientationsensor', draggable_orientationsensor_handler
stk.framework.register_handler 'draggable_accelerationsensor', draggable_accelerationsensor_handler
stk.framework.register_handler 'draggable_touchpad', draggable_touchpad_handler
stk.framework.register_handler 'draggable_keylistener', draggable_keylistener_handler

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


heaven = 1000# parseInt( $('#screen').css('height'), 10) * 5

### objects ###
class Element
  constructor: (defaultParameters = {}) ->
    @id = defaultParameters.id
    @value = defaultParameters.value or 0
    @name = defaultParameters.name or ''
    @height = defaultParameters.height or heaven
    @velo = 5
    @side = defaultParameters.side or 10
    @dom = defaultParameters.dom or document.getElementById(defaultParameters.id)
    
class Player
  constructor: (defaultParameters = {}) ->
    @name = defaultParameters.name or 'player'
    @up = false
    @left = false
    @right = false
    @jumps = false
    @falls = true
    @height = defaultParameters.height or bottom
    @speed =  {updown:updownDefault,leftright:leftrightDefault}
    @side = defaultParameters.side or 50
    @influenceTime = 0
    @dom = defaultParameters.dom
    @basketDom = defaultParameters.basketDom
    @score = 0
    @scoreDom = defaultParameters.scoreDom
    @time = 0
    @isActive = false
    @basketTurnedOver = new Date().getTime() /1000
    @waitForBasket = false 
    @timeout = defaultParameters.timeout

viewportHeight = window.innerHeight
viewportWidth = window.innerWidth

fps = 50
running = true
tollerance = -2

gravity = 5
bottom = 0
jumpHeight = 300

updownDefault=3
leftrightDefault=0.8

player1 = new Player(
  name: 'player1'
  side: 100
  dom: $('#player1')
  basketDom: $('#basket1')
  scoreDom: $('#score1')
  timeout: $('#timeout1')
)

playerMap = {}  
players = []
inactivePlayers = []
unregisteredPlayer = [player1]
playerWidth = parseInt(player1.dom.css('width'))
playerHeight = parseInt(player1.dom.css('height'))
basketTollerance = 20
timeLimit = 120
fadeLimit = 55

fallCount = 0
fallRound = 20
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
    
    
## Controller methods ##

directionAcceleration=(msg)->  
  player = getPlayer(msg.envelop.clientid)
  if player!=undefined
    if msg.dev.z>10
      player.jumps = true
  true


directionOrientation=(msg)->  
  player = getPlayer(msg.envelop.clientid)
  if player!=undefined && player.isActive
#    if Math.abs(msg.b)>10
#      player.speed.leftright=Math.abs(Math.max(50,msg.b))/10
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
  player = getPlayer(msg.envelop.clientid)
#  console.log player,id 
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
  
  
## Player Utils ##

registerPlayer=(id)->
  console.log "registerPlayer", unregisteredPlayer
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


## Element Utils ##

elementList = []
elementRandomList = ['bomb', 'power', 'one', 'one', 'two', 'two', 'zero', 'zero', 'one', 'one', 'two', 'two', 'zero', 'zero']
elementIDCount = {
  'bomb': 0,
  'power': 0,
  'zero': 0,
  'one': 0,
  'two': 0
  }
  
values = {
  'bomb': -2,
  'power': 3,
  'zero': 0,
  'one': 1,
  'two': 2
  }

createNewElement=(element)->
  div = document.createElement('div')
  elementWithID = element + getElementIDCount(element)
  div.id = elementWithID
  div.className = 'element'
  div.innerHTML = '<img src="images/' + element + '.svg">'
  document.getElementById('element-div').appendChild(div)
  
  newElement = new Element(
    id: elementWithID
    name: element
    side: getNewColumn() * columnWidth + columnWidth
    height: heaven
    dom: $('#' + elementWithID)
    value: getValue(element)
  )
  newElement.dom.css('left', newElement.side + "px")
  elementList.push newElement
  
getValue=(element)->
  values[element]

getElementIDCount=(element)->
  id = elementIDCount[element]
  elementIDCount[element] = id + 1 % 10
  id

destroyElement=(element)->
  deadElem = document.getElementById(element.id)
  deadElem.parentNode.removeChild(deadElem)


## Game Logic ##

## updates ##

update=()->
  updatePlayers()
  updateElements()
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
      player.side -= 5 * player.speed.leftright
      if (basketLeft <= -1 * basketTollerance)
        player.dom.css('left', player.side + "px")        
      else
        player.basketDom.css('left', parseInt((player.side - playerLeft)/2) + "px")
        
    if ( player.right && player.side + playerWidth < viewportWidth )
      player.side += 5 * player.speed.leftright
      if (basketLeft >= basketTollerance)
        player.dom.css('left', player.side + "px")
      else
        player.basketDom.css('left', parseInt((player.side - playerLeft)/2) + "px")
    
    if (player.jumps || player.falls)
      jump(player)
      player.dom.css('left', player.side + "px")
      player.basketDom.css('left', "0px")
    else if ( player.up )
      jump(player)
      player.dom.css('left', player.side + "px")
      player.basketDom.css('left', "0px")
      
    updateInfluence(player)
    
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
  
updateElements=()->
  fallElements()
  fillElementList()
  true
  
  
## Player Functions ##

jump=(player)->
  if (player.height <= bottom)
    player.jumps = true
  else if (player.height >= jumpHeight + bottom)
    player.jumps = false
    player.falls = true

  if (player.jumps)
    player.height += 5 * player.speed.updown
  else if (player.falls)
    player.height -= 5 * player.speed.updown
    if (player.height <= bottom)
      player.falls = false   
      
  player.dom.css('bottom', player.height + "px")
  true
  
## Element Functions ##

fallElements=()->
  for element in elementList
    falls(element)
  true
      
fillElementList=()->
  fallCount += 1
  if ( fallCount >= fallRound && Math.floor(Math.random() * 3) >= 2 )
#  if ( fallCount >= fallRound )
    elementName = elementRandomList[ Math.floor( Math.random() * elementRandomList.length ) - 1 ]
    if elementName != undefined
      element = createNewElement(elementName)
      elementList.push(element)
      fallCount = 0
  true
      
falls=(object)->
  if object != undefined
    object.height -= object.velo
    if (object.height <= bottom)
      elementDown(object)
    if object.dom != undefined
      object.dom.css('bottom', object.height + "px")
  true
  
getNewColumn=()->
  Math.floor(Math.random() * columns)
  
## Collision  

checkCollisions=()->
  for object in elementList
    checkCollision(object)
  true
  
checkCollision=(object)->
  for player in players
    if(object != undefined && player.isActive && object.dom != undefined)
      basket = player.basketDom
      elem = object.dom
      basketLeft = parseInt(basket.css('left')) + parseInt(player.dom.css('left'))
      basketBottom = parseInt(player.dom.css('bottom'))
      basketDomHeight = parseInt(basket.css('height'))
      elemLeft = parseInt(elem.css('left'))
      elemBottom = parseInt(elem.css('bottom'))
      
      lrtest= elemLeft >= basketLeft && elemLeft + parseInt(elem.css('width')) <= basketLeft + parseInt(basket.css('width'))
      udtest = elemBottom >= (basketBottom + basketDomHeight / 3) && elemBottom <= (basketBottom + basketDomHeight / 2)
#      console.log lrtest + " " + udtest
      
      if lrtest && udtest        
        switch object.name
          when 'bomb'
            player.dom.not(':animated').effect('shake', {times:4}, 500, ()-> )
          when 'power'
            player.dom.not(':animated').effect('highlight', {times:4}, 500, ()-> )
        collect(player, object)
       
       
  true
  
elementDown=(object)->
  console.log "element down: " + object.id
  index = elementList.indexOf(object)
  elementList.splice(index,1)
  destroyElement(object)
  true
  
calcSide=(object)->
  object.dom.css('left', object.side + "px")
  true
  
collect=(player, object)->
  console.log "Collected Object"
  player.score += object.value
  player.scoreDom.html(player.score)
  influencePlayer(player, object)
  elementDown(object)
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