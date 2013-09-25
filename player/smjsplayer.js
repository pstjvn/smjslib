goog.provide('smstb.player.SMJSPlayer');
goog.provide('smstb.player.SMJSPlayer.InfoEvent');

goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('smstb.Remote');
goog.require('smstb.ds.Record');
goog.require('smstb.player.EventType');
goog.require('smstb.player.IPlayer');
goog.require('smstb.player.State');
goog.require('smstb.serverconfig.Section');
goog.require('smstb.serverconfig.Section.EventType');
goog.require('smstb.transport.smjs.pubsub');
goog.require('smstb.transport.smjspackage.Base');

/**
 * @fileoverview Provides the smjs hardware player wrapper. The player
 *   requires some 'setting up' before it could be useful and this is why it
 *   extends the EventTarget class, once all the subsystems for it are ready
 *   it will emit the READY event. Should code need to initialize later and
 *   access the player it could check its state as well so the preffered
 *   pattern is.
 *
 * <pre> if (!smstb.player.SMJSPlayer.getInstance().isReady()) {
 *   goog.events.listenOnce(smstb.player.SMJSPlayer.getInstance(),
 *   smstb.player.SMJSPlayer.EventType.READY, function() { console.log('Player
 *   can now be used!'); }) } </pre>
 *
 * This particular player implementation has many capabilities that are not
 *   present in other implementation and as wuch should be used directly if
 *   all cababilities are to be used.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * The SMJS based hardware player abstraction. Note that most of the methods
 *   are not easily asbtracted to all players and as such the player cannot be
 *   completely hidden behind a higher abstrsaction. Users that need access to
 *   all capabilities used by this implementation should require it explicitly
 *   instead of relying on auto detection and thus using the common player
 *   interface
 * @constructor
 * @implements {smstb.player.IPlayer}
 * @extends {goog.events.EventTarget}
 */
smstb.player.SMJSPlayer = function() {
  goog.base(this);
  /**
   * Referrence to the internal state.
   * @type {smstb.player.State}
   * @private
   */
  this.internalState_ = smstb.player.State.STOPPED;
  /**
   * @private
   * @type {goog.events.EventHandler}
   */
  this.eventHandler_ = null;
  this.parentalPass_ = '';
  this.getParentalPass_();

  // listen for updates as well.
  this.getHandler().listen(smstb.serverconfig.Section.getSection('streaming'),
    smstb.serverconfig.Section.EventType.CHANGE, this.getParentalPass_);

  // always listen for stop
  this.getHandler().listen(smstb.Remote.getInstance(),
    smstb.Remote.EventType.KEY, this.handleRemoteKey_);

  // Listen for player events coming from socket and sync wrapper with it.
  smstb.transport.smjs.pubsub.channel.subscribe(
      smstb.transport.smjs.pubsub.Topic.PLAYER_EVENT, goog.bind(
        this.handlePlayerEvent_, this));

  // Listen for the media events (playing, stopped etc)
  smstb.transport.smjs.pubsub.channel.subscribe(
    smstb.transport.smjs.pubsub.Topic.MEDIA, goog.bind(this.handleMediaEvent_,
      this));

};
goog.inherits(smstb.player.SMJSPlayer, goog.events.EventTarget);
goog.addSingletonGetter(smstb.player.SMJSPlayer);

/**
 * Translates the DSP states to the global player states.
 * @private
 * @param {string} stateName The DSP state name.
 * @return {smstb.player.State} The corresponding state, translated to
 *   intrinsic values.
 */
smstb.player.SMJSPlayer.prototype.translateState_ = function(stateName) {
  switch (stateName) {
    case 'stopped':
    case 'finished':
    case 'nodata':
    case 'error':
      return smstb.player.State.STOPPED;
    case 'started':
    case 'unpaused':
    case 'buffering':
    case 'playing':
      return smstb.player.State.PLAYING;
    case 'paused':
      return smstb.player.State.PAUSED;
    default:
      throw new Error('Unknown state name from DSP player: ' + stateName);
  }
};

/**
 * Sets the internal state of this player's implementation.
 * @param {string} stateName The state name as reported by the DSP event.
 * @private
 */
smstb.player.SMJSPlayer.prototype.setState_ = function(stateName) {
  // first figure out the new state based on the server provided name.
  var new_state = this.translateState_(stateName);
  if (new_state != this.internalState_) {
    this.internalState_ = new_state;
    this.emitStateChangeEvent_();
  }
};

/**
 * Emits an event on state change. The event is meant to be matching the
 *   wrapped scope events and does not check for actual change. The method is
 *   strictly private.
 * @private
 */
smstb.player.SMJSPlayer.prototype.emitStateChangeEvent_ = function() {
  if (this.internalState_ == smstb.player.State.PLAYING) {
    this.dispatchEvent(smstb.player.EventType.START);
  } else if (this.internalState_ == smstb.player.State.PAUSED) {
    this.dispatchEvent(smstb.player.EventType.PAUSE);
  } else {
    this.dispatchEvent(smstb.player.EventType.STOP);
  }
};

/**
 * Handles the response package that contains media event.
 * @param {smstb.transport.smjs.Response} pack The package of the event.
 * @private
 */
smstb.player.SMJSPlayer.prototype.handleMediaEvent_ = function(pack) {
  var ev = /** @type {SMJSJson.MediaEvent} */ (pack.getEvent());
  this.setState_(ev.state);
};

/**
 * Handles the event from the player subsistem on m* devices.
 * @param {smstb.transport.smjs.Response} resp The server generated player
 *   event.
 * @private
 */
smstb.player.SMJSPlayer.prototype.handlePlayerEvent_ = function(resp) {
  var ev = /** @type {!SMJSJson.PlayerEvent} */(resp.getEvent());
  this.dispatchEvent(new smstb.player.SMJSPlayer.InfoEvent(ev));
};

/**
 * Handles the abstracted remote keys coming to the system. Those are
 *   broadcasted so we should not be too aggresive. While the events are
 *   broadcasted from the socket / SMJS instance, the KEY events are converted
 *   to standard event and bubble and can be prevented. Depending on the order
 *   of subscribers hoever the 'default prevents' can not be used as
 *   indication if the event has been taken care of. For this reason it is
 *   best to listen for those in the controllers and only call methods in the
 *   widgets/components. However the player is an exception and we want it to
 *   always react to the 'stop' key.
 * @param {smstb.Remote.Event} e The remote control event.
 * @private
 */
smstb.player.SMJSPlayer.prototype.handleRemoteKey_ = function(e) {
  if (e.key == smstb.Remote.Keys.STOP) {
    // we should always try to stop if the stop key is pressed, no matter what
    this.stop();
  }
};

/**
 * Dummy function just to satisfy the compiler.
 * @param {smstb.transport.Response} arg Dead end response.
 * @private
 */
smstb.player.SMJSPlayer.prototype.dummyFunction_ = function(arg) {
};

/**
 * Getter for the parental passwork directly from the back end config system.
 * @private
 */
smstb.player.SMJSPlayer.prototype.getParentalPass_ = function() {
  smstb.serverconfig.Section.getSection('streaming').get('lockpass',
    goog.bind(function(pass) {
      this.parentalPass_ = pass;
      this.dispatchEvent(smstb.player.EventType.READY);
    }, this));
};

/**
 * Getter for the handler instance bound to the player itself.
 * @return {goog.events.EventHandler} The handler.
 * @protected
 */
smstb.player.SMJSPlayer.prototype.getHandler = function() {
  if (goog.isNull(this.eventHandler_)) {
    this.eventHandler_ = new goog.events.EventHandler(this);
  }
  return this.eventHandler_;
};


/**
 * Plays a video object.
 * @param {pstj.ds.ListItem} obj The record object to play.
 * @param {boolean=} resume If the player should attempt to resume the
 *  playback.
 * @param {boolean=} record True if recording should be performed.
 * @param {boolean=} nocam True if the web cam should be active durring
 *  playback.
 */
smstb.player.SMJSPlayer.prototype.play = function(obj, resume, record, nocam) {
  var isAudio = false;
  var uri = obj.getProp(smstb.ds.Record.Property.PLAYURL);

  // at this point we should have both pass and allow payment confirmation
  // and we can safely play the item.
  (new smstb.transport.smjspackage.Base({
    'url': uri,
    'resume': !!resume,
    'audio': isAudio,
    'nocam': !!nocam
  }, 'play')).send(this.dummyFunction_);
};

/**
 * Stops the playback. This is basically calling the stop at the backend.
 */
smstb.player.SMJSPlayer.prototype.stop = function() {
  (new smstb.transport.smjspackage.Base({}, 'stop')).send(this.dummyFunction_);
};

/**
 * Implements the pause command.
 */
smstb.player.SMJSPlayer.prototype.pause = function() {};

/**
 * Implements the interface.
 * @return {smstb.player.State} The current internal state.
 */
smstb.player.SMJSPlayer.prototype.getState = function() {
  return this.internalState_;
};

/**
 * Implements the interface call.
 * @return {boolean} True if resuming is supported.
 */
smstb.player.SMJSPlayer.prototype.isResumeSupoprted = function() {
  return true;
};

/**
 * Implementation of the interface.
 * @return {boolean} For now always be false.
 */
smstb.player.SMJSPlayer.prototype.isRecordingSupported = function() {
  return false;
};
/**
 * Implements the interface.
 * @return {boolean} True if supported.
 */
smstb.player.SMJSPlayer.prototype.isParentalLockSupported = function() {
  return true;
};

/**
 * Implements the pass matching.
 * @param {string} pass The pass to match.
 * @return {boolean} True if pass is correct.
 */
smstb.player.SMJSPlayer.prototype.passMatches = function(pass) {
  return (pass == this.parentalPass_);
};

/**
 * Special info event for playback.
 * @param {SMJSJson.PlayerEvent} ev The player event directly.
 * @constructor
 * @extends {goog.events.Event}
 */
smstb.player.SMJSPlayer.InfoEvent = function(ev) {
  goog.base(this, smstb.player.EventType.INFO,
    smstb.player.SMJSPlayer.getInstance());
  this.playbackInfo = ev;
};
goog.inherits(smstb.player.SMJSPlayer.InfoEvent, goog.events.Event);
