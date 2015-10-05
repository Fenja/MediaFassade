#   cfcoptions : { "out": "../js/"  }

###

The compiled custom_body.js will be included at the end of the html body section after the include of socket.io and stk-framework.
Define your functions here.

###

### Define your handler ###

# handler for events of draggable_background #
draggable_background_handler=(msg)->
  console.log 'Do something with msg: '+JSON.stringify msg

# handler for events of draggable_image #
draggable_image_handler=(msg)->
  console.log 'Do something with msg: '+JSON.stringify msg

# handler for events of draggable_joystick #
draggable_joystick_handler=(msg)->
  handle( direction(msg), msg.id )
  console.log 'Do something with msg: '+JSON.stringify msg
  
  

### Register your handler ###
stk.framework.register_handler 'draggable_background', draggable_background_handler
stk.framework.register_handler 'draggable_image', draggable_image_handler
stk.framework.register_handler 'draggable_joystick', draggable_joystick_handler


### Debug handler to test without remote control ###
window.onkeydown=(e)->
  code = if e.keyCode then  e.keyCode else e.which
  ascii = if e.charCode then e.charCode else e.which
  if (code == 37)
    handle("left",0)
  else if (code == 38)
    handle("up",0)
  else if (code == 39)
    handle("right",0)
  else if (ascii == 65)
    handle("left",1)
  else if (ascii == 87)
    handle("up",1)
  else if (ascii == 68)
    handle("right",1)
  #other keys for second player

### Own methods ###
direction=(msg)->
  x = msg.x
  y = msg.y
  type = msg.type
  dir = "none"
  if (y < 0.4 && y < x-0.1)
    dir = "up"
  else if (y > 0.6 && y > x+0.1)
    dir = "down"
  else if (x < 0.4 && x < y-0.1)
    dir = "left" 
  else if (x > 0.6 && x > y+0.1)
    dir = "right"
  dir
  
handle=(dir, id)->
  player = document.getElementById('player'+id)
  position = parseInt(getComputedStyle(player).left)
  if ( dir == "left" && position > 0 ) 
    position -= 10
  else if ( dir == "right" && position < window.innerWidth ) #this does not work, but should
    position += 10
  player.style.left = position + "px"
  document.getElementById('output').innerHTML = dir + " " + position