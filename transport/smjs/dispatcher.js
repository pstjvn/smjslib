goog.provide('smstb.transport.smjs.Dispatcher');

goog.require('smstb.transport.smjs.Response');
goog.require('smstb.transport.smjs.pubsub');



/**
 * @constructor
 */
smstb.transport.smjs.Dispatcher = function() {
  /**
   * @private
   * @type {Object}
   */
  this.cache_ = {};
};
goog.addSingletonGetter(smstb.transport.smjs.Dispatcher);


/**
 * Flushes the buffers and processes the error that caused it.
 * @param {Error} err The error responsible for the flush.
 */
smstb.transport.smjs.Dispatcher.prototype.flush = function(err) {};


/**
 * We should only be called with objects! This method is also exported thus we
 *   do not have control over the parameters, thus we need to make some checks
 *   in the run time.
 * @param {Object} jobject The JSON object to process.
 */
smstb.transport.smjs.Dispatcher.prototype.process = function(jobject) {
  if (!goog.isObject(jobject)) {
    this.flush(new Error('Attempted to process non-object as Package'));
  }
  var response = new smstb.transport.smjs.Response(jobject);
  var tag = response.getTag();
  var topic;

  // broadcast the custom packet so all interested patries can match it.
  switch (response.getType()) {
    case 'event':
      if (response.getMethod() == 'player') {
        topic = smstb.transport.smjs.pubsub.Topic.PLAYER_EVENT;
      } else if (response.getMethod() == 'remote') {
        topic = smstb.transport.smjs.pubsub.Topic.EVENT;
      } else if (response.getMethod() == 'media') {
        topic = smstb.transport.smjs.pubsub.Topic.MEDIA;
      } else {
        throw new Error('Unknown event method: ' + response.getMethod());
      }
      break;
    case 'response':
      topic = smstb.transport.smjs.pubsub.Topic.RESPONSE;
      break;
    default:
      throw new Error('Unknown package type: ' + response.getType());
  }

  smstb.transport.smjs.pubsub.channel.publish(topic, response);

  if (response.getType() == 'response') {
    if (goog.isFunction(this.cache_[tag])) {
      // at this point we should treat it as regular response, so cast it
      this.cache_[tag](/** @type {smstb.transport.Response} */(response));
      delete this.cache_[tag];
    }
  }

  goog.dispose(response);
};


/**
 * Registers a new command that expectd response from the backend with a
 *   handler.
 * @param {!string} tag The tag id of the request to register.
 * @param {function(smstb.transport.Response): undefined} callback The callback
 *   to execute once we have an anwerd to the request.
 */
smstb.transport.smjs.Dispatcher.prototype.register = function(tag, callback) {
  this.cache_[tag] = callback;
};


/**
 * Checks internally if the package has designated resolved (added by matching
 *   the package ID) or not.
 * @private
 * @param {string} tag The tag ID of the package.
 * @return {boolean} True if there is a registered handler for this package
 *   ID.
 */
smstb.transport.smjs.Dispatcher.prototype.hasResolver_ = function(tag) {
  return true;
};
