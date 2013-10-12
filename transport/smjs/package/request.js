/**
 * @fileoverview Provides the request structure for a package.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.transport.smjspackage.Request');

goog.require('smstb.transport.smjspackage.Header');



/**
 * @constructor
 * @param {Object} data The json request to generate (data).
 * @param {string=} opt_method The method to use.
 */
smstb.transport.smjspackage.Request = function(data, opt_method) {
  this['header'] = new smstb.transport.smjspackage.Header(opt_method);
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
