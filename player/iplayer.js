goog.provide('smstb.player.IPlayer');



/**
 * @interface
 */
smstb.player.IPlayer = function() {};


/**
 * Plays an object.
 * @param {pstj.ds.ListItem} object The object to play.
 * @param {boolean=} opt_resume Resume from last known position if supported.
 * @param {boolean=} opt_record Record the stream if supported.
 * @param {boolean=} opt_nocam If the cam should be disabled. It is enabled by
 *  default.
 */
smstb.player.IPlayer.prototype.play = function(object, opt_resume, opt_record,
    opt_nocam) {};


/**
 * Stops playback
 */
smstb.player.IPlayer.prototype.stop = function() {};


/**
 * Pause the playback.
 */
smstb.player.IPlayer.prototype.pause = function() {};


/**
 * Gets the state of the player
 * @return {smstb.player.State} The player state it is currently in.
 */
smstb.player.IPlayer.prototype.getState = function() {};


/**
 * Checks if the player supports resuming.
 * @return {boolean} True if the player supports recording the last known
 *   position and starts playing back from there. False otherwise.
 */
smstb.player.IPlayer.prototype.isResumeSupoprted = function() {};


/**
 * Checks if the player supports recording the stream it si playing.
 * @return {boolean} True if recording is supported.
 */
smstb.player.IPlayer.prototype.isRecordingSupported = function() {};


/**
 * Checks if the parental pass locking is supported.
 * @return {boolean} True if locking with pass is supported, false otherwise.
 */
smstb.player.IPlayer.prototype.isParentalLockSupported = function() {};


/**
 * Checks if the password matches the parental password stored for the player.
 * @param {string} pass The password string to check against.
 * @return {boolean} True if the passwords match. False otherwise.
 */
smstb.player.IPlayer.prototype.passMatches = function(pass) {};
