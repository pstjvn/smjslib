/**
 * @fileoverview Provides the player abstraction. We hide the player
 *   implementation in order to make it possible to play back any item on any
 *   device using one and same interface for interaction with the playback
 *   sub-system. This will also allow us to use extra features like continious
 *   playback, playback lists, password protection, dynamically switching
 *   players, payment etc.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.player.Player');
goog.provide('smstb.player.Player.EventType');
goog.provide('smstb.player.Player.QueryEvent');

goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('smstb.player.EventType');
goog.require('smstb.player.IPlayer');
goog.require('smstb.player.SMJSPlayer');



/**
 * Implements the player interface.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
smstb.player.Player = function() {
  goog.base(this);
  this.handler_ = new goog.events.EventHandler(this);
  this.player_ = smstb.player.Player.getImplementation_();
  goog.asserts.assertInstanceof(this.player_, goog.events.EventTarget,
      'The player instance should always be event target instance!');
  // make sure to pass the events our way
  this.player_.setParentEventTarget(this);
  /**
   * Points to the currently playing item.
   * @private
   * @type {pstj.ds.ListItem}
   */
  this.current_ = null;
  /**
   * If set should point to a playlist that should be iterated in continuous
   *   play mode.
   * @private
   * @type {pstj.ds.List}
   */
  this.playlist_ = null;
  /**
   * @private
   * @type {boolean}
   */
  this.repeat_ = false;
  /**
   * @private
   * @type {boolean}
   */
  this.shuffle_ = false;
  /**
   * @private
   * @type {boolean}
   */
  this.disableCam_ = false;
  this.attachEvents();
};
goog.inherits(smstb.player.Player, goog.events.EventTarget);
goog.addSingletonGetter(smstb.player.Player);


/**
 * Attaches the needed event listeners.
 * @protected
 */
smstb.player.Player.prototype.attachEvents = function() {
  this.handler_.listen(this, smstb.player.EventType.STOP, this.handleStop);
};


/**
 * Handles the stop event from the player.
 * @param {goog.events.Event} e The STOP player event.
 * @protected
 */
smstb.player.Player.prototype.handleStop = function(e) {
  var next = null;
  // if we should repeat
  if (this.repeat_) {
    // if there is a list set (remember to remove it on stop)
    if (!goog.isNull(this.playlist_) && !goog.isNull(this.current_)) {
      // if the list is empty there is nothing to play.
      if (this.playlist_.getCount() == 0) return;

      if (!this.shuffle_) {
        if (this.playlist_.getCurrentIndex() == (this.playlist_.getCount(
            ) - 1)) {
          next = this.playlist_.getByIndex(0);
        } else {
          next = this.playlist_.getNext();
        }
      } else {
        next = this.playlist_.getByIndex(pstj.math.utils.getRandomBetween(0,
            this.playlist_.getCount() - 1));
      }
      if (!goog.isNull(next)) {
        e.stopPropagation();
        this.playlist_.setCurrent(next);
        this.play(this.playlist_.getCurrent());
      }

    } else if (!goog.isNull(this.current_)) {
      // there is no playlist set, repeat the same item.
      this.play(this.current_);
    } else {
      this.repeat_ = false;
      this.shuffle_ = false;
      console.log(
          'Error: repeat is set but there is no current item nor list');
    }
  }
};


/**
 * Plays a record via the internal player.
 * @param {pstj.ds.ListItem} record The reocrd to play.
 * @param {boolean=} resume True if we should attempt to continue playback
 *   from the same point it was stopped.
 * @param {boolean=} should_record True if we should attempt to record the
 *   stream.
 * @param {string=} pass Optionally the password to unlock locked items.
 * @param {boolean=} allow_payment True if payment was explicitly allowed
 *   for this item.
 */
smstb.player.Player.prototype.play = function(record, resume, should_record, pass, allow_payment) {

  var uri = record.getProp(smstb.ds.Record.Property.PLAYURL);

  if (goog.isNull(uri)) {
    // if we are in continuouse mode just play next
    // else return
    return;
  }
  if (this.player_.isParentalLockSupported() &&
    record.getProp(smstb.ds.Record.Property.LOCKED)) {

    if (!goog.isString(pass) || !this.player_.passMatches(pass)) {
      // emit event that should notify interface implementation that we desire
      // to ask for pass.
      this.dispatchEvent(new smstb.player.Player.QueryEvent(
        smstb.player.Player.EventType.NEEDS_PASS,
        /**
         * @type {function(smstb.player.Player.QueryEvent.bos_): undefined}
         */
        (goog.bind(this.play, this, record, resume, should_record))));
      return;
    }
  }

  if (record.getProp(smstb.ds.Record.Property.COST) &&
    +record.getProp(smstb.ds.Record.Property.COST) > 0) {

    if (allow_payment != true) {
      this.dispatchEvent(new smstb.player.Player.QueryEvent(
        smstb.player.Player.EventType.NEEDS_PAYMENT_CONFIRMATION,
        /**
         * @type {function(smstb.player.Player.QueryEvent.bos_): undefined}
         */
        (goog.bind(this.play, this, record, resume, should_record, pass))));
      return;
    }
  }

  this.current_ = record;
  this.player_.play(record, resume, should_record, this.disableCam_);
};


/**
 * Play a whole list.
 * @param {pstj.ds.List} list The list of records to play.
 */
smstb.player.Player.prototype.playList = function(list) {
  this.playlist_ = list;
  this.play(this.playlist_.getCurrent());
  this.setRepeat(true);
};


/**
 * Stops the playback.
 */
smstb.player.Player.prototype.stop = function() {
  this.player_.stop();
  this.setRepeat(false);
  this.setShuffle(false);
};


/**
 * Enables continual playback.
 * @param {boolean} enable If true, enable continuous mode of playing.
 */
smstb.player.Player.prototype.setRepeat = function(enable) {
  this.repeat_ = enable;
};


/**
 * Enables / disables shuffle in playlist.
 * @param {boolean} enable If true enables shuffle.
 */
smstb.player.Player.prototype.setShuffle = function(enable) {
  this.shuffle_ = enable;
};


/**
 * Enables/disables the cam in playback. This option is only usable when
 * integrated with the movement detection implemented in webcam stream reads.
 * @param {boolean} nocam True to specifically set the cam to OFF.
 */
smstb.player.Player.prototype.disableCamera = function(nocam) {
  this.disableCam_ = nocam;
};


/**
 * Returns the currently played item. If the player is stopped state it will
 *   still return the last played item.
 * @return {pstj.ds.ListItem} The played record.
 */
smstb.player.Player.prototype.getCurrentItem = function() {
  return this.current_;
};


/**
 * Provides the event type from player that requires UI attention. This event
 *   is always demanding a sort of user input.
 * @constructor
 * @extends {goog.events.Event}
 * @param {smstb.player.Player.EventType} type The type of data requested.
 * @param {function(smstb.player.Player.QueryEvent.bos_): undefined} callback
 *   The callback to execute when the data is retrieved from the user.
 */
smstb.player.Player.QueryEvent = function(type, callback) {
  goog.base(this, type, smstb.player.Player.getInstance());
  this.callback = callback;
};
goog.inherits(smstb.player.Player.QueryEvent, goog.events.Event);


/**
 * @typedef {boolean|string}
 */
smstb.player.Player.QueryEvent.bos_;


/**
 * The event types that require input from the user.
 * @enum {string}
 */
smstb.player.Player.EventType = {
  NEEDS_PASS: goog.events.getUniqueId('a'),
  NEEDS_PAYMENT_CONFIRMATION: goog.events.getUniqueId('b')
};


/**
 * Attempts to guess the environment and returns a working implementation for
 *   playback or uses global configration to choose one.
 * @return {smstb.player.IPlayer} Return an instance that implements the
 *   player interface.
 * @private
 */
smstb.player.Player.getImplementation_ = function() {
  // for now just retrn the smjs player.
  return smstb.player.SMJSPlayer.getInstance();
};
