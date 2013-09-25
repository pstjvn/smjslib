goog.provide('smstb.transport.smjspackage.Request');

goog.require('smstb.transport.smjspackage.Header');

/**
 * @fileoverview Provides the request structure for a package.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * @constructor
 * @param {Object} data The json request to generate (data).
 * @param {string=} method The method to use.
 */
smstb.transport.smjspackage.Request = function(data, method) {
  this['header'] = new smstb.transport.smjspackage.Header(method);
  this['request'] = data;
};

/**
 * Getter method for the tag, used to assign processor for the request's
 *   response.
 * @return {string} The tag ID of the package.
 */
smstb.transport.smjspackage.Request.prototype.getTag = function() {
  return this['header']['tag'];
};
