#   cfcoptions : { "out": ".dev0/"  }

module.exports = () ->
  getHooks: () ->
    {touchstart:(msg)->
      console.log 'custom_hook for touchstart', msg
    ,touchmove:(msg)->
      console.log 'custom_hook for touchmove', msg
    ,touchend:(msg)->
      console.log 'custom_hook for touchend', msg
    ,keyevent:(msg)->
      console.log 'custom_hook for keyevent', msg
    ,draggable_orientationsensor:(msg)->
      #console.log 'custom_hook for draggable_orientationsensor', msg
      if msg.b>-20 && msg.b<20
        console.log "up"      
    ,draggable_accelerationsensor:(msg)->
      #console.log 'custom_hook for draggable_accelerationsensor', msg    
    }
