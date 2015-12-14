# handler for custom messages #
custom_message_handler=(msg)->
  register(msg)

# handler for events of draggable_orientationsensor #
draggable_orientationsensor_handler=(msg)->
  register(msg)

# handler for events of draggable_accelerationsensor #
draggable_accelerationsensor_handler=(msg)->
  register(msg)
  
# handler for events of draggable_touchpad #
draggable_touchpad_handler=(msg)->
  register(msg)
  
# handler for events of draggable_keylistener #
draggable_keylistener_handler=(msg)->
  register(msg)

  
### Register your handler ###
stk.framework.register_handler 'custommessage', custom_message_handler
stk.framework.register_handler 'draggable_orientationsensor', draggable_orientationsensor_handler
stk.framework.register_handler 'draggable_accelerationsensor', draggable_accelerationsensor_handler
stk.framework.register_handler 'draggable_touchpad', draggable_touchpad_handler
stk.framework.register_handler 'draggable_keylistener', draggable_keylistener_handler

stk.framework.timer 50, countDown

unregisteredPlayer = 6
registeredIDs = []
count = 30

register=(msg)->
  if unregisteredPlayer >= 1 && msg != undefined
    registerPlayer(msg.envelop.clientid)

registerPlayer=(id)->
  console.log registeredIDs.indexOf(id)
  if registeredIDs.indexOf(id) == -1
    registeredIDs.push(id)
    console.log "registerPlayer"
    id = "player" + (7 - unregisteredPlayer)
    $('#' + id).css('opacity', 1)
    unregisteredPlayer -= 1
    
countDown=()->
  if count >= 0
    count -= 1
    $('#countdown').innerHTML = count
  else
    console.log "start!"
  