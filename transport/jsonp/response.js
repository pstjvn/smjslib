goog.provide('smstb.transport.jsonp.Response');

goog.require('smstb.transport.xhr.Response');



/**
 * Implements the Response interface for the JSONP layer.
 * @param {*} result The result object from the query.
 * @extends {smstb.transport.xhr.Response}
 * @constructor
 */
smstb.transport.jsonp.Response = function(result) {
  goog.base(this, result);
};
goog.inherits(smstb.transport.jsonp.Response, smstb.transport.xhr.Response);


/** @inheritDoc */
smstb.transport.jsonp.Response.prototype.processResult = function(result) {
  if (goog.isNull(result)) {
    this.errors.push(new Error('The response was null, request did not' +
        ' succeed'));
  } else {
    if (!goog.isObject(result) || !goog.isArray(result)) {
      this.errors.push(new Error('The response should be object or array,' +
          ' instead we got ' + goog.typeOf(result)));
    } else {
      this.response = result;
    }
  }
};
