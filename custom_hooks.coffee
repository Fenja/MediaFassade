#   cfcoptions : { "out": ".dev0/"  }

y=[0,0,0]
dy=0
lasty=0
px=0
lastxs=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]


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
        return true
      false
      #console.log msg.envelop.timestamp.ts
    ,draggable_accelerationsensor:(msg)->
      if Math.abs(msg.y)>1
        y=y.slice(1)
        y.push(msg.y)
        if y[0]>0 && y[1]>0 && y[2]>0
          dy=1
          lasty+=msg.y
        else if y[0]<0 && y[1]<0 && y[2]<0
          dy=-1
          lasty+=msg.y
        else
          dy=0
          
        sum=0
        for e,i in lastxs when i<11
          sum+=e
          
        lastxs=lastxs.slice(1)
        mrlasty=Math.round(lasty)
        if (sum>=0 && mrlasty>0) || (sum<=0 && mrlasty<0)
          lastxs.push(mrlasty)
        else
          lastxs.push(0)

        #console.log 'custom_hook for draggable_accelerationsensor,y:', lastxs,sum
        
      else
        y=y.slice(1)
        y.push(0)
        if lasty!=0 && y[0]+y[1]+y[2]==0
          lasty=Math.round(lasty/2)
          if Math.abs(lasty)<1
            lasty=0
        
        lastxs=lastxs.slice(1)
        lastxs.push(0)
        sum=0
        for e,i in lastxs when i<11
          sum+=e
          
        #console.log 'custom_hook for draggable_accelerationsensor,y:', lastxs,sum
        
      return sum
      
    ,state:(msg)->
      #console.log 'custom_hook for state', msg
    }