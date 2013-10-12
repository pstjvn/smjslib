goog.provide('smstb.transport.smjs.Response');

goog.require('goog.Disposable');
goog.require('goog.asserts');
goog.require('goog.json');
goog.require('smstb.transport.Response');



/**
 * Implements the Response interface for the smjs native backend.
 * @constructor
 * @implements {smstb.transport.Response}
 * @extends {goog.Disposable}
 * @param {Object} jobject The object received over the wire.
 */
smstb.transport.smjs.Response = function(jobject) {
  goog.base(this);
  this.data_ = /** @type {SMJSJson.Packet} */ (jobject);
};
goog.inherits(smstb.transport.smjs.Response, goog.Disposable);


/**
 * Implements the interface.
 * @return {boolean} True if there is an error in the package.
 */
smstb.transport.smjs.Response.prototype.hasErrors = function() {
  if (goog.isObject(this.data_.response) &&
      this.data_.response.status.toLowerCase() == 'ok') {
    return false;
  } else {
    return true;
  }
};


/**
 * Getter with some checks for the tag attribute of the header.
 * @return {string} The tag ID of the package.
 */
smstb.transport.smjs.Response.prototype.getTag = function() {
  goog.asserts.assertObject(this.data_.header, 'No header found for package');
  goog.asserts.assertString(this.data_.header.tag, 'No tag found');
  return this.data_.header.tag;
};


/**
 * Getter for the method name with some additional checks.
 * @return {string} The method name of the package.
 */
smstb.transport.smjs.Response.prototype.getMethod = function() {
  goog.asserts.assertObject(this.data_.header, 'No header found for package');
  goog.asserts.assertString(this.data_.header.method, 'No method found');
  return this.data_.header.method;
};


/**
 * Getter for the event object as part of the package.
 * @return {SMJSJson.Event|SMJSJson.PlayerEvent|SMJSJson.MediaEvent} The event
 *   object from the backend.
 */
smstb.transport.smjs.Response.prototype.getEvent = function() {
  goog.asserts.assertObject(this.data_.event, 'Not an event package');
  return this.data_.event;
};


/**
 * Implements the interface.
 * @return {Error} Actually we cannot provide the last error in this case.
 */
smstb.transport.smjs.Response.prototype.getLastError = function() {
  return null;
};


/**
 * Getter for the type of the package with some checks.
 * @return {string} The type of the package as designated in the header.
 */
smstb.transport.smjs.Response.prototype.getType = function() {
  goog.asserts.assertObject(this.data_.header, 'No header detected in package');
  goog.asserts.assertString(this.data_.header.type, 'No type for the package');
  return this.data_.header.type.toLowerCase();
};


/**
 * The response content of the packet.
 * @return {Object|Array|string} The parsed package payload data.
 */
smstb.transport.smjs.Response.prototype.getResponseContent = function() {
  goog.asserts.assertObject(this.data_.response, 'Not a response package');
  goog.asserts.assertString(this.data_.response.content, 'No content found ' +
      'in response');

  try {
    var res = goog.json.parse(this.data_.response.content);
  } catch (e) {
    if (goog.DEBUG) {
      console.log('Cound not parse string into object',
          this.data_.response.content);
    }
  }
  if (goog.isNumber(res)) res = res.toString();
  return res;
};


/** @inheritDoc */
smstb.transport.smjs.Response.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.data_ = null;
};
