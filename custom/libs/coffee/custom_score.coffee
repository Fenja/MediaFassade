restart=()->
  console.log "Restart"
  location.href = "start.html"
    
stk.framework.delay 6000, restart

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
