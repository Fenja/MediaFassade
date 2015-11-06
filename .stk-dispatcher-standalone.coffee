#   cfcoptions : { "out": ".dev0/"  }

fs = require('fs')

port=3000
hooks={}

console.log "Arguments:"
process.argv.forEach((val, index, array)->
  console.log(index + ': ' + val);
  switch val
    when "port"
      port=array[index+1]
    when "hooks"
      fs.access(array[index+1], fs.R_OK, (err)->
        if not err
          custom_hooks=require(array[index+1])()
          hooks=custom_hooks.getHooks()
        else
          console.log 'No custom hooks @ '+array[index+1]+' available'
        console.log 'hooks:',hooks
      )      
)
console.log "You may set following arguments, separate key and value by space"
console.log "port PORTNUMBER                            listen on port"
console.log "hooks PathToJavaScriptOrCoffeScriptFile    file with custom hooks for touchstart,touchmove,touchend,keyevent,"
console.log "                                           draggable_orientationsensor,draggable_accelerationsensor,state"

app = require('express')()
compress = require('compression')
app.use(compress())
http = require('http').Server(app)
io = require('socket.io')(http)
url = require("url")

#stk_network=require('./modules/stk_network_n.js')()
#stk_network.showInterfaces()

users={}
clients={}

addClient = (id,socket) ->
  clients[id]={id:id,socket:socket}
  
getClientsList=()->
  Object.keys(clients)

addUser = (emailhash,socket) ->
  if emailhash!=undefined
    if users[emailhash] == undefined
      users[emailhash]=[socket]
    else
      if users[emailhash].indexOf(socket)<0
        users[emailhash].push socket
      
removeUser = (emailhash) ->
  if users[emailhash] != undefined
    delete users[emailhash]

showUsers=()->
  for emailhash, sockets in users
    console.log emailhash, ":", sockets
    
getUsersList=()->
  Object.keys(users)
    
removeSocket=(socket)->
  for emailhash, sockets in users
    sockets.splice(sockets.indexOf(socket),1)
      
sendToUser=(id,msg) ->
  for socket in users[id]
    socket.emit('receivedMessage', msg)

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

ioEmit=(socket,msgType,msg)->
  if msg.envelop!=undefined && msg.envelop.emailhash!=undefined
    msg.envelop.servertimestamp=new Date().getTime()
    if msg.envelop.timestamp!=undefined
      msg.envelop.timestampdifference=msg.envelop.servertimestamp-msg.envelop.timestamp.ts
    else
      msg.envelop.timestampdifference=undefined
    msg.envelop.socket={}
    msg.envelop.socket.id=socket.conn.id
    msg.envelop.socket.remoteaddress=socket.conn.remoteAddress
    #msg.envelop.session={key:req.session.key}
    io.sockets.in(msg.envelop.emailhash).emit(msgType, msg)
  else if msg.envelop!=undefined
    msg.envelop.servertimestamp=new Date().getTime()    
    if msg.envelop.timestamp!=undefined
      msg.envelop.timestampdifference=msg.envelop.servertimestamp-msg.envelop.timestamp.ts
    else
      msg.envelop.timestampdifference=undefined
    msg.envelop.socket={}
    msg.envelop.socket.id=socket.conn.id
    msg.envelop.socket.remoteaddress=socket.conn.remoteAddress
    #msg.envelop.session={key:req.session.key}
    io.emit msgType, msg
  else
    msg.envelop={}
    msg.envelop.servertimestamp=new Date().getTime()    
    msg.envelop.timestampdifference=undefined
    msg.envelop.socket={}
    msg.envelop.socket.id=socket.conn.id
    msg.envelop.socket.remoteaddress=socket.conn.remoteAddress
    #msg.envelop.session={key:req.session.key}
    io.emit msgType, msg
    
ioEmitToClients=(toClients,msgType,msg)->
  for c in toClients
    if clients[c]!=undefined
      if msg.envelop==undefined
        msg.envelop={}
      msg.envelop.socket={}
      msg.envelop.socket.id=clients[c].socket.conn.id
      msg.envelop.socket.remoteaddress=clients[c].socket.conn.remoteAddress
      #msg.envelop.session={key:req.session.key}
      console.log "Do sending", msgType, msg
      
      (clients[c].socket).emit(msgType, msg)

io.on('connection', (socket) ->
  console.log 'a user connected'
  console.log 'hooks:',hooks
  
  socket.on 'join', (msg) ->
    socket.join msg.emailhash
    console.log "JOINING "+msg.emailhash
    addUser msg.emailhash, socket
    ioEmit socket,'users', {users:getUsersList()}

  socket.on 'disconnect', () ->
    console.log 'user disconnected'
    removeSocket socket
    ioEmit socket,'users', {users:getUsersList()}
    
  socket.on 'join_client', (msg) ->
    console.log "JOINING Client", msg.clientid
    addClient msg.clientid, socket
    ioEmit socket,'clients', {clients:getClientsList()}  
    
  socket.on 'custommessage', (msg) ->
    console.log "custommessage", msg
    if msg.type==undefined then msg.type='custommessage'
    if msg.sendTo==undefined || msg.sendTo.length==0
      console.log "ioEmit", msg.sendTo
      ioEmit socket,'custommessage', msg  
    else
      console.log "ioEmitToClients"
      ioEmitToClients msg.sendTo,'custommessage', msg 

  if hooks['touchstart']==undefined
    hooks['touchstart']=(msg)->
      console.log 'touchstart', msg
  socket.on 'touchstart', (msg) ->
    ioEmit socket,'touchstart', msg
    hooks['touchstart'](msg)
  
  if hooks['touchmove']==undefined
    hooks['touchmove']=(msg)->
      console.log 'touchmove', msg
  socket.on 'touchmove', (msg) ->
    ioEmit socket,'touchmove', msg
    hooks['touchmove'](msg)
  
  if hooks['touchend']==undefined
    hooks['touchend']=(msg)->
      console.log 'touchend', msg
  socket.on 'touchend', (msg) ->
    ioEmit socket,'touchend', msg
    hooks['touchend'](msg)
  
  if hooks['keyevent']==undefined
    hooks['keyevent']=(msg)->
      console.log 'keyevent', msg
  socket.on 'keyevent', (msg) ->
    ioEmit socket,'keyevent', msg
    hooks['keyevent'](msg)
    
  socket.on 'vibration.isSupported', (msg) ->
    ioEmit socket,'vibration.isSupported', msg
    console.log 'vibration.isSupported', msg
    
  socket.on 'vibration.support', (msg) ->
    ioEmit socket,'vibration.support', msg
    console.log 'vibration.support', msg

  socket.on 'vibration.addVibratePattern', (msg) ->
    ioEmit socket,'vibration.addVibratePattern', msg
    console.log 'vibration.addVibratePattern', msg

  socket.on 'vibration.removeVibratePattern', (msg) ->
    ioEmit socket,'vibration.removeVibratePattern', msg
    console.log 'vibration.removeVibratePattern', msg

  if hooks['draggable_orientationsensor']==undefined
    hooks['draggable_orientationsensor']=(msg)->
      console.log 'draggable_orientationsensor', msg
  socket.on 'draggable_orientationsensor', (msg) ->
    msg.isup=hooks['draggable_orientationsensor'](msg)    
    ioEmit socket,'draggable_orientationsensor', msg
    
  if hooks['draggable_accelerationsensor']==undefined
    hooks['draggable_accelerationsensor']=(msg)->
      console.log 'draggable_accelerationsensor', msg
  socket.on 'draggable_accelerationsensor', (msg) ->
    msg.dev=hooks['draggable_accelerationsensor'](msg)
    ioEmit socket,'draggable_accelerationsensor', msg
    
  socket.on 'reset', (msg) ->
    ioEmit socket,'reset', msg
    console.log 'reset', msg
    
  if hooks['state']==undefined
    hooks['state']=(msg)->
      console.log 'state', msg
  socket.on 'state', (msg) ->
    ioEmit socket,'state', msg
    hooks['state'](msg)
  
  socket.on 'getkey', (msg) ->
    k=getKey(4)
    ioEmit socket,'key', {key:k}
    console.log 'new key: '+k

  requestqrscancode={}

  socket.on 'qrdecode', (msg) ->
    ioEmit socket,'qrdecode', msg
    console.log 'qrdecode', msg
    console.log JSON.stringify(requestqrscancode )
    if requestqrscancode[msg.text]!=undefined # && requestqrscancode[msg.text].timestamp!=undefined
      console.log 'qrdecode with timestamp ', requestqrscancode[msg.text]
    
  socket.on 'requestqrscan', (msg) ->
    requestqrscancode[msg.text]={text:msg.text,timestamp:(new Date()).getTime()}
    ioEmit socket,'requestqrscan', msg
    console.log 'requestqrscan', msg , JSON.stringify(requestqrscancode )
    
  socket.error (msg)->
    console.log msg  
)