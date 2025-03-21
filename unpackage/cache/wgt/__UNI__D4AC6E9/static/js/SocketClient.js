// t-jian
export class SocketClient {
  constructor(options) {
    // 默认配置
    const defaultOptions = {
      url: '',
      reconnectLimit: 5,    // 最大重连次数
      reconnectInterval: 3000, // 重连间隔
      heartInterval: 15000   // 心跳间隔
    }

    this.options = Object.assign({}, defaultOptions, options)
    this.socketTask = null  // websocket 实例
    this.reconnectCount = 0 // 当前重连次数
    this.lockReconnect = false // 重连锁
    this.heartTimer = null  // 心跳定时器
    this.isManualClose = false // 是否主动关闭
    // 事件监听器
    this.listeners = {
      open: [],
      message: [],
      close: [],
      error: []
    }
  }

  // 添加事件监听
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback)
    }
    return this
  }

  // 触发事件
  emit(event, ...args) {
    this.listeners[event]?.forEach(cb => cb(...args))
  }

  // 初始化连接
  connect() {
    if (this.socketTask) return
    this.isManualClose = false
	let _this=this
	this.socketTask =uni.connectSocket({
	  url: this.options.url,
	  method: 'GET',
	  success: function() {
	    // 监听WebSocket连接打开事件
	    uni.onSocketOpen(function(res) {
		  //.NET core 的SignalR 提供的ws 需要追加下面的内容
	      // uni.sendSocketMessage({
	      //   data: `{"protocol":"json", "version":1}${String.fromCharCode(0x1e)}`
	      // });
	      console.log('WebSocket连接已打开！');
		  _this.handleConnect()
	    });
	  }, fail: (err) => this.handleError(err)
	});

    this.bindEvents()
  }

  // 绑定原生事件
  bindEvents() {
    this.socketTask.onOpen(() => {
      this.handleOpen()
      this.startHeartBeat()
    })

    this.socketTask.onMessage((res) => {
      this.handleMessage(res.data)
    })

    this.socketTask.onClose(() => {
      this.handleClose()
      this.stopHeartBeat()
    })

    this.socketTask.onError((err) => {
      this.handleError(err)
    })
  }
  handleConnect(){
	  
  }
  // 处理连接打开
  handleOpen() {
    this.reconnectCount = 0
    this.emit('open')
    console.log('WebSocket connected')
  }

  // 处理收到消息
  handleMessage(data) {
    try {
      //const message = JSON.parse(data)
	  if(data){
		  data=data.replace(String.fromCharCode(0x1e),'');
	  }
      this.emit('message',data)
    } catch (e) {
      console.error('Message parse error:', e)
    }
  }

  // 处理连接关闭
  handleClose() {
    this.socketTask = null
    this.emit('close')
    
    if (!this.isManualClose) {
      this.reconnect()
    }
  }

  // 处理错误
  handleError(err) {
    console.error('WebSocket error:', err)
    this.emit('error', err)
    this.reconnect()
  }

  // 发送消息
  send(data) {
    if (this.socketTask && this.socketTask.readyState === 1) {
      const payload = typeof data === 'string' ? data : JSON.stringify(data)
      this.socketTask.send({
        data: payload,
        success: () => {
          // 消息发送成功处理
        },
        fail: (err) => {
          this.emit('error', err)
        }
      })
    } else {
      console.warn('WebSocket is not connected')
    }
  }
  stop(data){
	  if (this.socketTask && this.socketTask.readyState === 1) {
	    this.socketTask.send({
	      data: JSON.stringify({"type":"interrupt"}),
	      success: (res) => {
	        // 消息发送成功处理
			console.log(res,'stop')
	      },
	      fail: (err) => {
	        this.emit('error', err)
	      }
	    })
	  } else {
	    console.warn('WebSocket is not connected')
	  }
  }
  // 手动关闭连接
  disconnect() {
    this.isManualClose = true
    this.reconnectCount = this.options.reconnectLimit
    if (this.socketTask) {
      this.socketTask.close()
    }
  }

  // 自动重连
  reconnect() {
    if (this.lockReconnect || this.isManualClose) return
    
    if (this.reconnectCount < this.options.reconnectLimit) {
      this.lockReconnect = true
      setTimeout(() => {
        this.connect()
        this.reconnectCount++
        this.lockReconnect = false
      }, this.options.reconnectInterval)
    } else {
      console.error('Reconnect failed after maximum attempts')
    }
  }

  // 心跳检测
  startHeartBeat() {
    this.heartTimer = setInterval(() => {
     // this.send({ type: 'heartbeat' })
    }, this.options.heartInterval)
  }

  stopHeartBeat() {
    clearInterval(this.heartTimer)
    this.heartTimer = null
  }
}