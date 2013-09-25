goog.provide('smstb.transport.jsonp.Query');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.net.Jsonp');
goog.require('smstb.transport.jsonp.Response');
goog.require('smstb.transport.xhr.Query');

/**
 * @fileoverview Implements the Query interface for the JSONP layer.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * The JSONP query object.
 * @implements {smstb.transport.Query}
 * @extends {smstb.transport.xhr.Query}
 * @constructor
 * @param {string|Object|smstb.transport.Resource} source_name The source name
 *   to obtain.
 */
smstb.transport.jsonp.Query = function(source_name) {
  goog.base(this, source_name);
};
goog.inherits(smstb.transport.jsonp.Query, smstb.transport.xhr.Query);

/** @inheritDoc */
smstb.transport.jsonp.Query.prototype.send = function(callback) {
  this.jsonp_ = new goog.net.Jsonp(this.uri);
  this.bound_ = goog.bind(this.handleComplete, this, callback);
  this.jsonp_.send(null, this.bound_, this.bound_);
};

/**
 * Handles the status of the JSONP request.
 * @param {function(smstb.transport.Response):undefined} callback The original
 *   handler supplied to the query send method.
 * @param {Object|Array} result The result of the jsonp request or null.
 * @protected
 */
smstb.transport.jsonp.Query.prototype.handleComplete = function(callback,
  result) {
  var response = new smstb.transport.jsonp.Response(result);
  callback(response);
  goog.dispose(response);
  goog.dispose(this);
};

/** @inheritDoc */
smstb.transport.jsonp.Query.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.jsonp_ = null;
  this.bound_ = null;
};
