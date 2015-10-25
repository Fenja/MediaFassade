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
  
### Register your handler ###
stk.framework.register_handler 'draggable_joystick', draggable_joystick_handler
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

viewportHeight = window.innerHeight
viewportWidth = window.innerWidth

emailhash1 = "b99a950fa0b095ac59bec541a441b1b0"
emailhash2 = "4d6ab0c2e472248f4fa9bfd682345297"

fps = 50
running = true
tollerance = 5

bottom = 250 #px
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
  dom: document.getElementById('player0')
  score: 0
  scoreDom: document.getElementById('score1')
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
  dom: document.getElementById('player1')
  score: 0
  scoreDom: document.getElementById('score2')
}

players = [player1, player2]
playerWidth = parseInt(getComputedStyle(player1.dom).width)
playerHeight = parseInt(getComputedStyle(player1.dom).height)

gravity = 5
heaven = viewportHeight

object0 = 
  value: 10
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
columnWidth = viewportWidth / columns
lastColumn = 0
bombTime = 50
powerTime = 75
bombSpeed = 0.5
powerSpeed = 2

### Own methods ###
getPlayer=(emailhash)->
  if (emailhash == emailhash2)
    player1
  else
    player2
  
directionJoystick=(msg, player)->
  player = getPlayer(msg.envelop.emailhash)
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
  player = getPlayer(msg.envelop.emailhash)
  keys = msg.keys
  for code in keys
    if (code == 37)
      player.left = true
    if (code == 38)
      player.up = true
    if (code == 39)
      player.right = true
  true
  

update=()->
  updatePlayers()
  updateObjects()
  checkCollisions()

updatePlayers=()->
  for player in players
    updatePlayer(player)
  true
  
updatePlayer=(player)->
  updateInfluence(player)
  if ( player.left && player.side > 0 ) 
    player.side -= 10 * player.speed
  else if ( player.right && player.side + playerWidth < viewportWidth )
    player.side += 10*player.speed
  if (player.jumps || player.falls)
    jump(player)
  else if ( player.up )
    jump(player)
  player.dom.style.left = player.side + "px"
  true
  
updateInfluence=(player)->
  if (player.influence > 0)
    player.influence -= 1
  else
    player.speed = 1
    console.log 'speed: ' + player.speed
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
      object.side = getNewColumn() * columnWidth
      object.dom.style.left = object.side + "px"
      objectList.push object
      index = queue.indexOf(object)
      queue.splice(index,1)
      fallCount = 0
  true
      
falls=(object)->
  object.height -= object.velo
#  if (object.height <= bottom)
  if (object.height <= 0)
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
    console.log 'speed: ' + player.speed
  else if (object == 'power')
    player.influence = powerTime
    player.speed = powerSpeed
    console.log 'speed: ' + player.speed
  true
  
clear=()->
  for player in players
    player.up = false
    player.left = false
    player.right = false
  true