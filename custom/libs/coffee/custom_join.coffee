customLoggerD=()->
  ###customLogger "Delay"###
  stk.framework.timer 1000, counter
  
stk.framework.delay 500, customLoggerD

# handler for custom messages #
custom_message_handler=(msg)->
  register(msg)

# handler for events of draggable_orientationsensor #
draggable_orientationsensor_handler=(msg)->
  register(msg)

# handler for events of draggable_accelerationsensor #
draggable_touchpad_handler=(msg)->
  register(msg)
    
# handler for events of draggable_accelerationsensor #
draggable_keylistener_handler=(msg)->
  console.log msg
  register(msg)
  
### Register your handler ###
stk.framework.register_handler 'custommessage', custom_message_handler
stk.framework.register_handler 'draggable_touchpad', draggable_touchpad_handler
stk.framework.register_handler 'draggable_keylistener', draggable_keylistener_handler

unregisteredPlayer = 6
count = 30
registeredIDs = []

register=(msg)->
  if unregisteredPlayer >= 1 && msg != undefined
    registerPlayer(msg.envelop.clientid)

registerPlayer=(clientid)->
  console.log "try to register", clientid
  if registeredIDs.indexOf(clientid) <= -1
    registeredIDs.push(clientid)
    id = "player" + (7 - unregisteredPlayer)
    stk.framework.storeData({id:clientid},true)
    $('#' + id).css('opacity', 1)
    unregisteredPlayer -= 1
    console.log "registerPlayer", clientid
    console.log stk.framework.getData(true)
    
counter=()->
  if unregisteredPlayer < 6
    if count > 0
      count -= 1
      $('#countdown').html(count)
    else
      console.log "start!"
      location.href = "index.html"
  true
