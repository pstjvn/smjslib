/**
 * @fileoverview Provides the interface for a query object allowing the
 *   transport scheduler to work with them across different transport layers.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.transport.Query');



/**
 * The query interface. Implementers are guaranteed to work with the Transport
 *   abstraction class.
 * @interface
 * @param {string|Object|smstb.transport.Resource} source Source object to
 *   retrieve. Different implementation have different source object types.
 */
smstb.transport.Query = function() {};


/**
 * Method to send the query to its destination.
 * @param {function(smstb.transport.Response): undefined} callback The function
 *   that will handle the response.
 */
smstb.transport.Query.prototype.send = function(callback) {};
