goog.provide('smstb.player.EventType');
goog.provide('smstb.player.State');

goog.require('goog.events');

/**
 * @fileoverview Provides the event enumeration for common events shared
 *   between player implementations.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides the default player events. Custom player implementation could have
 *   more events but those are guaranteed to be emited by all players, except
 *   the INFO event, which is not present for flash player in our
 *   implementation as well as the android player which is known to be an
 *   external application and we do not have control over it nor can we
 *   receive events from it.
 * @enum {string}
 */
smstb.player.EventType = {
  // Emitted when the player is ready to be used.
  READY: goog.events.getUniqueId('a'),
  // Emitted when the playback starts.
  START: goog.events.getUniqueId('b'),
  // Emitted when the playback stops.
  STOP: goog.events.getUniqueId('c'),
  // Emitted when the playback is paused.
  PAUSE: goog.events.getUniqueId('d'),
  // Emitted during playback with information about the progress.
  INFO: goog.events.getUniqueId('e')
};

/**
 * Enumarated the player states that we are interested in on abstraction
 *   level.
 * @enum {number}
 */
smstb.player.State = {
  STOPPED: 0,
  PLAYING: 1,
  PAUSED: 2
};
