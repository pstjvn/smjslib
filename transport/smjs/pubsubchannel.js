goog.provide('smstb.transport.smjs.pubsub');

goog.require('goog.pubsub.PubSub');


/**
 * The channel for packages.
 * @type {goog.pubsub.PubSub}
 */
smstb.transport.smjs.pubsub.channel = new goog.pubsub.PubSub();


/**
 * The known topics for this channel.
 * @enum {string}
 */
smstb.transport.smjs.pubsub.Topic = {
  EVENT: 'key-event',
  PLAYER_EVENT: 'player-event',
  RESPONSE: 'response',
  MEDIA: 'media'
};
