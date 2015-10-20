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

fps = 50
running = true

bottom = 250 #px
jumpHeight = 300

player1 = {
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  height: bottom
  side: 50 #px
  dom: document.getElementById('player0')
}

player2 = {
  up: false
  left: false
  right: false
  jumps: false
  falls: false
  height: bottom
  side: 250
  dom: document.getElementById('player1')
}

players = [player1, player2]

gravity = 5
heaven = 1000

object0 = 
  value: 0
  name: 'zero'
  height: 1000
  velo: 5
  dom: document.getElementById('zero')

object1 = 
  value: 1
  name: 'one'
  height: 1000
  velo: 5
  dom: document.getElementById('one')

###object2 = 
  value: 2
  name: 'two'
  height: heaven
  velo: gravity
  dom: document.getElementById(name)
  
objectBomb =
  value: 0
  name: 'bomb'
  height: heaven
  velo: gravity
  dom: document.getElementById(name)

objectPower = 
  value: 0
  name: "power"
  height: heaven
  velo: gravity
  dom: document.getElementById(name)###


objectList = [object0]
queue = [object1]

fallCount = 0
fallRound = 30

### Debug handler to test without remote control ###
window.onkeydown=(e)->
  console.log 'key down'
  code = if e.keyCode then  e.keyCode else e.which
  ascii = if e.charCode then e.charCode else e.which
  if (code == 37)
    player1.left = true
  if (code == 38)
    player1.up = true
  if (code == 39)
    player1.right = true
  if (ascii == 65)
    player2.left = true
  if (ascii == 87)
    player2.up = true
  if (ascii == 68)
    player2.right = true
  true

### Own methods ###
directionJoystick=(msg)->
  x = msg.x
  y = msg.y
  type = msg.type
  if (y < 0.4 && y < x-0.1)
    player1.up = true
  else if (x < 0.4 && x < y-0.1)
    player1.left = true
  else if (x > 0.6 && x > y+0.1)
    player1.right = true
  true
  
directionKey=(msg)->
  keys = msg.keys
  for code in keys
    if (code == 37)
      player1.left = true
    if (code == 38)
      player1.up = true
    if (code == 39)
      player1.right = true
    ###if (ascii == 65)
      player2Keys.left = true
    if (ascii == 87)
      player2Keys.up = true
    if (ascii == 68)
      player2Keys.right = true###
  true
  

update=()->
  updatePlayers()
  updateObjects()
  checkCollision()

updatePlayers=()->
  for player in players
    updatePlayer(player)
  true
  
updatePlayer=(player)->
  if ( player.left && player.side > 0 ) 
    player.side -= 10
  else if ( player.right && player.side < window.innerWidth ) #this does not work, but should
    player.side += 10
  if (player.jumps || player.falls)
    jump(player)
  else if ( player.up )
    jump(player)
  player.dom.style.left = player.side + "px"
  true
  
jump=(player)->
  if (player.height <= bottom)
    player.jumps = true
  else if (player.height >= jumpHeight + bottom)
    player.jumps = false
    player.falls = true

  if (player.jumps)
    player.height += 10
  else if (player.falls)
    player.height -= 10
    if (player.height <= bottom)
      player.falls = false   
      
  player.dom.style.bottom = player.height + "px"
  true
  
updateObjects=()->
  for object in objectList
    falls(object)
  fallCount += 1
  if ( fallCount >= fallRound && queue.length > 0 && Math.floor(Math.random() * 3) >= 2 )
    objectList[objectList.length] = queue[0]  
    queue.splice(0)
  true
      
falls=(object)->
  object.height -= object.velo
  if (object.height <= bottom)
    object.height = heaven
    objectList.remove(object)
    queue[queue.length] = object
  object.dom.style.bottom = object.height + "px"
  true
  
checkCollision=()->
  for object in objectList
    checkCollision(object)
  true
  
checkCollision=(object)->
  true

clear=()->
  player1.up = false
  player1.left = false
  player1.right = false
  player2.up = false
  player2.left = false
  player2.right = false
  true