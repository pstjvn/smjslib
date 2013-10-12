goog.provide('smstb.Remote');
goog.provide('smstb.Remote.Event');
goog.provide('smstb.Remote.EventType');
goog.provide('smstb.Remote.Keys');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('smstb.transport.smjs.pubsub');



/**
 * The remote control abstraction. It should hide the kbd/remote.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
smstb.Remote = function() {
  goog.base(this);

  smstb.transport.smjs.pubsub.channel.subscribe(
      smstb.transport.smjs.pubsub.Topic.EVENT, goog.bind(
          this.handleEvents, this));

  var kbdhandler = new goog.events.KeyHandler();

  goog.events.listen(kbdhandler, goog.events.KeyHandler.EventType.KEY,
      goog.bind(this.handleKeyboardKey, this));

  kbdhandler.attach(document);
};
goog.inherits(smstb.Remote, goog.events.EventTarget);
goog.addSingletonGetter(smstb.Remote);


/**
 * @param {goog.events.KeyEvent} e The keyhandler event.
 * @protected
 */
smstb.Remote.prototype.handleKeyboardKey = function(e) {
  if (goog.DEBUG) console.log(e.keyCode, e.charCode);
  e.preventDefault();
  switch (e.keyCode) {
    case goog.events.KeyCodes.UP:
      this.dispatchEvent(new smstb.Remote.Event(smstb.Remote.Keys.UP));
      break;
    case goog.events.KeyCodes.DOWN:
      this.dispatchEvent(new smstb.Remote.Event(smstb.Remote.Keys.DOWN));
      break;
    case goog.events.KeyCodes.LEFT:
      this.dispatchEvent(new smstb.Remote.Event(smstb.Remote.Keys.LEFT));
      break;
    case goog.events.KeyCodes.RIGHT:
      this.dispatchEvent(new smstb.Remote.Event(smstb.Remote.Keys.RIGHT));
      break;
    case goog.events.KeyCodes.ENTER:
      this.dispatchEvent(new smstb.Remote.Event(smstb.Remote.Keys.OK));
      break;
    case goog.events.KeyCodes.PAGE_UP:
      this.dispatchEvent(new smstb.Remote.Event(smstb.Remote.Keys.CHANNEL_UP));
      break;
    case goog.events.KeyCodes.PAGE_DOWN:
      this.dispatchEvent(new smstb.Remote.Event(
          smstb.Remote.Keys.CHANNEL_DOWN));
      break;
    case goog.events.KeyCodes.HOME:
      this.dispatchEvent(new smstb.Remote.Event(smstb.Remote.Keys.HOME));
      break;
    case 80:
      this.dispatchEvent(new smstb.Remote.Event(smstb.Remote.Keys.PLAY));
      break;
  }
};


/**
 * Handles the pubsub event topic broadcast.
 * @protected
 * @param {smstb.transport.smjs.Response} resp The pub sub channel is used
 *   only by the smjs dispatcher this we know that the broadcast will have
 *   only this type of messages on it.
 */
smstb.Remote.prototype.handleEvents = function(resp) {
  if (goog.isString(resp.getEvent()['key'])) {
    this.dispatchEvent(new smstb.Remote.Event(
        goog.array.indexOf(smstb.Remote.KeysNames, resp.getEvent()['key'])));
  }
};


/**
 * Provides the event type for the command keys (remote or kbd)
 * @enum {string}
 */
smstb.Remote.EventType = {
  KEY: goog.events.getUniqueId('key')
};


/**
 * Provides the numerical named keys from the remote.
 * @enum {number}
 */
smstb.Remote.Keys = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  POWER: 10,
  MUTE: 11,
  VOLUME_UP: 12,
  VOLUME_DOWN: 13,
  RECALL: 14,
  DISPLAY: 15,
  CHANNEL_UP: 16,
  CHANNEL_DOWN: 17,
  HOME: 18,
  RETURN: 19,
  REWIND: 20,
  FORWARD: 21,
  STOP: 22,
  PLAY: 23,
  PHONE: 24,
  CAMERA: 25,
  VIDEO: 26,
  AUDIO: 27,
  SAVE: 28,
  DELETE: 29,
  SETUP: 30,
  RECORD: 31,
  WEB: 32,
  EMAIL: 33,
  CHAT: 34,
  HOTEL: 35,
  INFO: 36,
  OK: 37,
  UP: 38,
  DOWN: 39,
  LEFT: 40,
  RIGHT: 41,
  POUND: 42,
  STAR: 43
};


/**
 * The key names as they come from the raw event object.
 * @type {Array.<string>}
 */
smstb.Remote.KeysNames = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'power',
  'mute',
  'volup',
  'voldown',
  'recall',
  'display',
  'chup',
  'chdown',
  'home',
  'return',
  'rw',
  'ff',
  'stop',
  'play',
  'phone',
  'camera',
  'video',
  'audio',
  'save',
  'delete',
  'setup',
  'rec',
  'web',
  'email',
  'chat',
  'hotel',
  'info',
  'ok',
  'up',
  'down',
  'left',
  'right',
  'pound',
  'star'
];



/**
 * Provides the remote key pressed high order event.
 * @constructor
 * @extends {goog.events.Event}
 * @param {number} key The actual key pressed.
 */
smstb.Remote.Event = function(key) {
  goog.base(this, smstb.Remote.EventType.KEY, smstb.Remote.getInstance());
  this.key = key;
};
goog.inherits(smstb.Remote.Event, goog.events.Event);
