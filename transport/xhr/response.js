goog.provide('smstb.transport.xhr.Response');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.json');
goog.require('goog.json.NativeJsonProcessor');
goog.require('pstj.configure');
goog.require('smstb.transport.Response');
goog.require('smstb.transport.config');

/**
 * @fileoverview Implements the Response interface for the XHR layer.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Implementation of the Response interface for the XHR layer.
 * @param {*} result The result from the xhr.
 * @implements {smstb.transport.Response}
 * @constructor
 * @extends {goog.Disposable}
 */
smstb.transport.xhr.Response = function(result) {
  this.errors = [];
  this.response = null;
  this.processResult(result);
};
goog.inherits(smstb.transport.xhr.Response, goog.Disposable);

/**
 * @typedef {Object|Array}
 */
smstb.transport.xhr.Response.Type;

/**
 * Reference to a native json processor.
 * @type {goog.json.NativeJsonProcessor}
 * @private
 */
smstb.transport.xhr.Response.jsp_ = new goog.json.NativeJsonProcessor();

/**
 * List of errors recorded in the life cycle of the response.
 * @type {Array.<Error>}
 */
smstb.transport.xhr.Response.prototype.errors;

/**
 * The actual server response or null. Should not be used directly to
 *   safeguard the interface
 * @type {smstb.transport.xhr.Response.Type}
 * @protected
 */
smstb.transport.xhr.Response.prototype.response;

/**
 * Implements the has error method from interface.
 * @return {boolean} True if there were errors in the response.
 */
smstb.transport.xhr.Response.prototype.hasErrors = function() {
  return this.errors.length > 0;
};

/**
 * Implements the method from interface.
 * @return {Error} The last error recorded.
 */
smstb.transport.xhr.Response.prototype.getLastError = function() {
  if (this.hasErrors()) {
    return this.errors[this.errors.length - 1];
  }
  return null;
};

/**
 * Implements method from interface.
 * @return {smstb.transport.xhr.Response.Type} The actual server response or
 *   null if there were errors.
 */
smstb.transport.xhr.Response.prototype.getResponseContent = function() {
  return this.response;
};

/**
 * Attempts to parse the json string into an actual object.
 * @param {*} result The server response text.
 * @protected
 */
smstb.transport.xhr.Response.prototype.processResult = function(result) {
  if (!goog.isString(result)) {
    this.errors.push(new Error('The expected response should have been string' +
      ' intead we have got' + goog.typeOf(result)));
    return;
  }
  if (result == '') {
    this.errors.push(new Error('The response was empty string and cannot be' +
      ' parsed into object'));
    return;
  }
  var parsed = null;
  if (!!pstj.configure.getRuntimeValue('USE_SAFE_JSON_PARSE', true,
  smstb.transport.config.prefix)) {
    try {
      parsed = smstb.transport.xhr.Response.jsp_.parse(result);
    } catch (e) {
      this.errors.push(e);
    }
  } else {
    try {
      parsed = goog.json.parse(result);
    } catch (e) {
      this.errors.push(e);
    }
  }
  if (goog.isObject(parsed) || goog.isArray(parsed)) {
    this.response = /** @type {smstb.transport.xhr.Response.Type} */ (parsed);
  } else {
    this.errors.push(new Error('The response text could not be parsed into' +
      'object or array'));
  }
};

/** @inheritDoc */
smstb.transport.xhr.Response.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.array.clear(this.errors);
  this.errors = null;
  this.response = null;
};
