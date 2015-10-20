#   cfcoptions : { "out": ".dev0/"  }

app = require('express')()

http = require('http').Server(app)
io = require('socket.io')(http)
url = require("url")

#stk_network=require('./modules/stk_network_n.js')()
#stk_network.showInterfaces()      

port=3000
http.listen port, () -> console.log "listening on *:#{port}"

  
getKey=(l=8)->
  s="acdefghknprstvwxyz23459"
  k=""
  t=0
  while k==""
    t++
    if t>15
      t=0
      l++
    for num in [1..l]
      k+=s[Math.floor(Math.random()*s.length)]
    #console.log "test key:"+key
    #console.log storage.getItem(key)
    if storage.getItem(k)!=undefined
      #console.log "duplicate key:"+key
      k=""
      
    #console.log "key:"+key
  k
  
sendFile=(res,p) ->
  console.log p
  res.sendFile p
  
sendLocalFile=(res,p) ->
  console.log __dirname + p
  res.sendFile __dirname + p

  
app.get('/*', (req, res)->
  console.log req._parsedUrl.path  
  sendLocalFile res, req._parsedUrl.pathname
)

## Socket connection

ioEmit=(msgType,msg)->
  if msg.envelop!=undefined && msg.envelop.emailhash!=undefined
    io.sockets.in(msg.envelop.emailhash).emit(msgType, msg)
  else
    io.emit msgType, msg

io.on('connection', (socket) ->
  console.log 'a user connected'
  
  socket.on 'join', (msg) ->
    socket.join msg.emailhash
    console.log "JOINING "+msg.emailhash    
    
  socket.on 'disconnect', () ->
    console.log 'user disconnected'
  
  socket.on 'touchmove', (msg) ->
    ioEmit 'touchmove', msg
    console.log 'touchmove', msg
    
  socket.on 'keyevent', (msg) ->
    ioEmit 'keyevent', msg
    console.log 'keyevent', msg
     
  socket.on 'deviceorientation', (msg) ->
    ioEmit 'deviceorientation', msg
    console.log 'deviceorientation', msg
    
  socket.on 'reset', (msg) ->
    ioEmit 'reset', msg
    console.log 'reset', msg
  
  requestqrscancode={}
  
  socket.on 'qrdecode', (msg) ->
    ioEmit 'qrdecode', msg
    console.log 'qrdecode', msg
    console.log JSON.stringify(requestqrscancode )
    if requestqrscancode[msg.text]!=undefined # && requestqrscancode[msg.text].timestamp!=undefined
      console.log 'qrdecode with timestamp ', requestqrscancode[msg.text]
    
  socket.on 'requestqrscan', (msg) ->
    requestqrscancode[msg.text]={text:msg.text,timestamp:(new Date()).getTime()}
    ioEmit 'requestqrscan', msg
    console.log 'requestqrscan', msg , JSON.stringify(requestqrscancode )
    
  socket.on 'getkey', (msg) ->
    k=getKey(4)
    ioEmit 'key', {key:k}
    console.log 'new key: '+k
          
  socket.error (msg)->
    console.log msg  
)