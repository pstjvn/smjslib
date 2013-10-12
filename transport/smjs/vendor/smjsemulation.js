/**
 * @fileoverview Provides emulation for the host object 'smjs'. Uses web
 *   socket and requires M* device with debug and web socket support enabled.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.vendor.ESmjs');

goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.json');
goog.require('goog.net.WebSocket');
goog.require('goog.net.WebSocket.EventType');
goog.require('goog.string');
goog.require('pstj.configure');
goog.require('smstb.transport.smjs.Dispatcher');



/**
 * @constructor
 */
smstb.vendor.ESmjs = function() {
  /**
   * Flag if the connection is dead.
   * @type {boolean}
   * @private
   */
  this.dead_ = false;
  /**
   * The web socket instance used.
   * @type {goog.net.WebSocket}
   * @private
   */
  this.socket_;
  /**
   * The bound handler used.
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_;
  /**
   * The message queue used to buffer messages initially.
   * @type {Array.<string>}
   * @private
   */
  this.queue_;
  this.handler_ = new goog.events.EventHandler(this);
  this.socket_ = new goog.net.WebSocket(false);
  this.queue_ = [];
};


/**
 * The default URI to use for web socket connection to debug device if none is
 *   configured at run time.
 * @define {string} The default URI to use for web socket connection to debug
 *   device if none is configured at run time.
 */
smstb.vendor.ESmjs.DEFAULT_DEBUG_DEVICE_URL = 'ws://192.168.2.64:7681';


/**
 * The configuration prefix path to use to find a run time device URI.
 * @define {string} The configuration prefix path to use to find a run time
 *   device URI.
 */
smstb.vendor.ESmjs.prefix = 'SYSMASTER.SMJS.VENDOR';


/**
 * The web socket protocol name to use for the STB. This will change rarely
 *   and thus does not need run time configuration.
 * @define {string} Protocol name for the socket.
 */
smstb.vendor.ESmjs.webSocketProtocolName = 'stb-json-protocol';


/**
 * The debug device URI to use when emulating the smjs object via web socket.
 * @type {string}
 */
smstb.vendor.ESmjs.DEBUG_DEVICE_URL = pstj.configure.getRuntimeValue(
    'DEBUG_DEVICE_URL', smstb.vendor.ESmjs.DEFAULT_DEBUG_DEVICE_URL,
    smstb.vendor.ESmjs.prefix).toString();


/**
 * The strings to use as socket initializer.
 * @type {string}
 * @private
 */
smstb.vendor.ESmjs.prototype.setHandlerString1_ = '{"header":{' +
    '"transport":"socket","mode":"async","method":"set_global_callback",' +
    '"type":"request","tag":"0000"},"request":{"name":"';


/**
 * The strings to use as socket initializer.
 * @type {string}
 * @private
 */
smstb.vendor.ESmjs.prototype.setHandlerString2_ = '"}}';


/**
 * Emulates the initapi method of the host object.
 */
smstb.vendor.ESmjs.prototype['initapi'] = function() {
  this.setupListeners_();
  try {
    this.socket_.open(smstb.vendor.ESmjs.DEBUG_DEVICE_URL,
        smstb.vendor.ESmjs.webSocketProtocolName);
  } catch (e) {
    if (goog.DEBUG) {
      console.log('Cannot open socket to host: ' +
          smstb.vendor.ESmjs.DEBUG_DEVICE_URL);
    }
    alert('WebSocket is not supported on this device.');
  }
};


/**
 * Sets up the listened for the socket. We do not clear those listeners ever
 *   as loosing connectivity will render the application disconnected anyway.
 * @private
 */
smstb.vendor.ESmjs.prototype.setupListeners_ = function() {
  this.handler_.listen(this.socket_, [goog.net.WebSocket.EventType.MESSAGE,
    goog.net.WebSocket.EventType.OPENED, goog.net.WebSocket.EventType.CLOSED,
    goog.net.WebSocket.EventType.ERROR], this.handleEvent_);
};


/**
 * Emulates the method of the host object.
 * @param {string} symbol The symbol name of the method to aprehend the
 *   packages.
 */
smstb.vendor.ESmjs.prototype['set_json_handler'] = function(symbol) {
  // we do not need to export the symbol, only attach ti to the socket handler.
  this.send_(smstb.vendor.ESmjs.prototype.setHandlerString1_ +
      symbol + smstb.vendor.ESmjs.prototype.setHandlerString2_);
};


/**
 * Emulates the host object method for sending commands to the STB.
 * @param {string} command The serialized command package.
 */
smstb.vendor.ESmjs.prototype['jsoncmd'] = function(command) {
  this.send_(command);
};


/**
 * Sends the string assuming it is understood at the other end of the socket.
 *   Uses buffering in case the socket is still not opened.
 * @param {string} json Serialized object.
 * @private
 */
smstb.vendor.ESmjs.prototype.send_ = function(json) {
  if (this.dead_) {
    if (goog.DEBUG) {
      console.log('WebSocket is dead, could not send package.');
    }
    return;
  }
  if (this.socket_.isOpen()) {
    this.socket_.send(json);
  } else if (!goog.isNull(this.queue_)) {
    this.queue_.push(json);
  } else {
    if (goog.DEBUG) {
      console.log('We should have never reached this condition: socket' +
          ' is not open but queue is deleted');
    }
    throw new Error('Unsupported condition');
  }
};


/**
 * Handles the incoming events from the web socket.
 * @param {goog.events.Event} e The Socket event.
 * @private
 */
smstb.vendor.ESmjs.prototype.handleEvent_ = function(e) {
  if (e.type == goog.net.WebSocket.EventType.MESSAGE) {
    this.handleMessage_(e.message);
  } else if (e.type == goog.net.WebSocket.EventType.OPENED) {
    if (this.queue_.length > 0) {
      goog.array.forEach(this.queue_, function(json) {
        this.send_(json);
      }, this);
    }
    this.clearQueue_();
  } else if (e.type == goog.net.WebSocket.EventType.ERROR) {
    this.dead_ = true;
    if (goog.DEBUG) {
      console.log('There was error opening the socket');
    }
    this.clearQueue_();
    throw new Error('WebSocket recieved error!');
  } else if (e.type == goog.net.WebSocket.EventType.CLOSED) {
    if (goog.DEBUG) {
      console.log('Socked was closed unexpectedly');
    }
    this.dead_ = true;
    this.clearQueue_();
    smstb.transport.smjs.Dispatcher.getInstance().flush(new Error(
        'WebSocket was closed unexpectedly'));
  }
};


/**
 * Handles the message posted over the web socket.
 * @param {string} message The JSON string.
 * @private
 */
smstb.vendor.ESmjs.prototype.handleMessage_ = function(message) {
  if (!goog.isString(message)) throw new Error('Expected string from socket,' +
      ' instead got' + goog.typeOf(message));
  if (goog.string.trim(message) == '') {
    throw new Error('Got empty string as message from socket');
  }
  try {
    var obj = goog.json.parse(message);
  } catch (e) {
    if (goog.DEBUG) {
      console.log('Could not parse string: ', message);
    }
  }
  if (!goog.isObject(obj)) {
    throw new Error('Could not parse response into object');
  }
  smstb.transport.smjs.Dispatcher.getInstance().process(/** @type {Object} */(
      obj));
};


/**
 * Clears the queue in case it cannot really be used anymore.
 * @private
 */
smstb.vendor.ESmjs.prototype.clearQueue_ = function() {
  goog.array.clear(this.queue_);
};
