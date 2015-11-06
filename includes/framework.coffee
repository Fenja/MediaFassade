STKMediawallFramework={id:"unknown", connection:{mode:"postMessage", parentURI:'*'}, state:"loading"}
###
mode:"direct","postMessage"
state:"loading","prepareing","ready","running","paused","stopped"
###

#console.log "URI:"+STKMediawallFramework.connection.parentURI
sendState=()->
  switch STKMediawallFramework.connection.mode
    when "direct" then return true
    when "postMessage"
      if STKMediawallFramework.id!="unknown"
        message='{"id":"'+STKMediawallFramework.id+'","kind":"state","state":"'+STKMediawallFramework.state+'"}'
        parent.postMessage(message,STKMediawallFramework.connection.parentURI)
        
unSchedule=()->
  switch STKMediawallFramework.connection.mode
    when "direct" then return true
    when "postMessage"
      if STKMediawallFramework.id!="unknown"
        message='{"id":"'+STKMediawallFramework.id+'","kind":"unschedule"}'
        parent.postMessage(message,STKMediawallFramework.connection.parentURI)
      
getState=()->
  return STKMediawallFramework.state

tick=()->
  console.log "tick"
  return true
  
receiver=(e) ->
  STKMediawallFramework.connection.mode="postMessage"
  data=JSON.parse(e.data)
  switch data.kind
    when "tick"
      if data.id != undefined
        STKMediawallFramework.id=data.id
      message='{"kind":"tack"}'
      parent.postMessage(message, STKMediawallFramework.connection.parentURI)
    when "restart"
      restart()
    when "pause"
      pause()
      
  if e.origin == '*'
    return

delay = (ms, fn)-> setTimeout(fn, ms)
timer = (ms, fn)-> setInterval(fn, ms)

window.addEventListener('message', receiver, false)

sendState()

#$(document).ready(() ->
  #console.log "Framework ready"
STKMediawallFramework.state="ready"
timer 10000, sendState
#)

play=()->  
  
pause=()->  

start=()->  
  restart()

restart=()->  