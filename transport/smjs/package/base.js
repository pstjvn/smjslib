goog.provide('smstb.transport.smjspackage.Base');

goog.require('goog.Disposable');
goog.require('goog.json');
goog.require('smstb.transport.smjs.Dispatcher');
goog.require('smstb.transport.smjspackage.Request');
goog.require('smstb.vendor.Smjs');

/**
 * @fileoverview Provides a base package for communication over smjs protocols.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * @constructor
 * @param {Object} data The payload part of the package.
 * @param {string=} method Optional method to use for transport.
 * @extends {goog.Disposable}
 */
smstb.transport.smjspackage.Base = function(data, method) {
  goog.base(this);
  this.request = new smstb.transport.smjspackage.Request(data, method);
};
goog.inherits(smstb.transport.smjspackage.Base, goog.Disposable);

/**
 * Implements the sending sequence.
 * @param {function(smstb.transport.Response): undefined} callback The
 *   callback that handles the response package.
 */
smstb.transport.smjspackage.Base.prototype.send = function(callback) {
  smstb.transport.smjs.Dispatcher.getInstance().register(this.request.getTag(),
    (callback));
  smstb.vendor.Smjs.getInstance().cmd(this.getAsString());
};

/**
 * Utility method to convert the package to a string to be sent over.
 * @return {string} The resulting string.
 */
smstb.transport.smjspackage.Base.prototype.getAsString = function() {
  return goog.json.serialize(this.request);
};

/** @inheritDoc */
smstb.transport.smjspackage.Base.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.request;
};
