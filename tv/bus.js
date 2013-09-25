goog.provide('smstb.tv.Topic');
goog.provide('smstb.tv.bus');

goog.require('goog.pubsub.PubSub');

/**
 * Provides the message bug for the TV infrastructure
 * @type {goog.pubsub.PubSub}
 */
smstb.tv.bus = new goog.pubsub.PubSub();
/**
 * Provides the topics on the bus
 * @enum {string}
 */
smstb.tv.Topic = {
  FOCUSED: 'tvcfocused'
};
