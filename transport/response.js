goog.provide('smstb.transport.Response');

/**
 * @fileoverview Provide the Response interface to allow the transport
 *   dispatcher to work with all different type of transpot mechnizms.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * @interface
 */
smstb.transport.Response = function() {};

/**
 * Getter for the last error in the list of errors if any.
 * @return {Error} The last recorded error.
 */
smstb.transport.Response.prototype.getLastError = function() {};

/**
 * Checks if there are errors recorded.
 * @return {boolean} True if there are errors in the response.
 */
smstb.transport.Response.prototype.hasErrors = function() {};

/**
 * Returns the response content if there are no errors, otherwise returns
 *   null.
 * @return {Object|Array|string} The response or if there are errors returns
 *  null.
 */
smstb.transport.Response.prototype.getResponseContent = function() {};
