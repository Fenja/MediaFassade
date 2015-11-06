#   cfcoptions : { "out": ".dev0/"  }
clientaccl={}

module.exports = () ->
  getHooks: () ->
    {touchstart:(msg)->
      console.log 'custom_hook for touchstart', msg
      a=a
    ,touchmove:(msg)->
      console.log 'custom_hook for touchmove', msg
      a=a
    ,touchend:(msg)->
      #console.log 'custom_hook for touchend', msg
      a=a
    ,keyevent:(msg)->
      console.log 'custom_hook for keyevent', msg
    ,draggable_orientationsensor:(msg)->
      #console.log 'custom_hook for draggable_orientationsensor', msg
      if msg.b>-20 && msg.b<20
        return true
      false
      #console.log msg.envelop.timestamp.ts
    ,draggable_accelerationsensor:(msg)->
      clientid=msg.envelop.clientid
      if clientaccl[clientid]==undefined
        clientaccl[clientid]={
          x:
            y:[0,0,0]
            dy:0
            lasty:0
            lastys:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
          ,y:
            y:[0,0,0]
            dy:0
            lasty:0
            lastys:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
          ,z:
            y:[0,0,0]
            dy:0
            lasty:0
            lastys:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
          ,lastupdated:new Date().getTime()  
        }
      
      ret={x:0,y:0,z:0}
      for r in ['x','y','z']
        sum=0
        c=clientaccl[clientid][r]
        if r=='z'
          msgV=msg.zraw
        else
          msgV=msg[r]
          
        c.lastupdated=new Date().getTime()
        
        

        if Math.abs(msgV)>1
          c.y=c.y.slice(1)
          c.y.push(msgV)
          if c.y[0]>0 && c.y[1]>0 && c.y[2]>0
            c.dy=1
            c.lasty+=msgV
          else if c.y[0]<0 && c.y[1]<0 && c.y[2]<0
            c.dy=-1
            c.lasty+=msgV
          else
            c.dy=0          

          for e,i in c.lastys when i<11
            sum+=e

          c.lastys=c.lastys.slice(1)
          mrlasty=Math.round(c.lasty)
          if (sum>=0 && mrlasty>0) || (sum<=0 && mrlasty<0)
            c.lastys.push(mrlasty)
          else
            c.lastys.push(0)

          #console.log 'custom_hook for draggable_accelerationsensor,y:', lastys,sum

        else
          c.y=c.y.slice(1)
          c.y.push(0)
          if c.lasty!=0 && c.y[0]+c.y[1]+c.y[2]==0
            c.lasty=Math.round(c.lasty/2)
            if Math.abs(c.lasty)<1
              c.lasty=0

          c.lastys=c.lastys.slice(1)
          c.lastys.push(0)

          for e,i in c.lastys when i<11
            sum+=e

          #console.log 'custom_hook for draggable_accelerationsensor,y:', lastys,sum
        ret[r]=sum 
         
      #console.log 'custom_hook for draggable_accelerationsensor ',clientid,ret
      
      return ret
      
    ,state:(msg)->
      #console.log 'custom_hook for state', msg
    }
