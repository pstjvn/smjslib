goog.provide('smstb.transport.Transport');
goog.provide('smstb.transport.Transport.Type');

goog.require('pstj.configure');
goog.require('smstb.transport.jsonp.Query');
goog.require('smstb.transport.smjs.Query');
goog.require('smstb.transport.xhr.Query');



/**
 * Provides the transport interface abstraction. Do not instanciate this
 *   class, instead use the 'getInstance' method.
 * @constructor
 */
smstb.transport.Transport = function() {
  this.type_ = -1;
  this.query_ = this.selectBackend_();
};
goog.addSingletonGetter(smstb.transport.Transport);


/**
 * The known transport types.
 * @enum {number}
 */
smstb.transport.Transport.Type = {
  SMJS: 0,
  XHR: 1,
  JSONP: 2,
  BINARY: 3
};


/**
 * The query constructor function to use.
 * @type {function(new: smstb.transport.Query, *): undefined}
 */
smstb.transport.Transport.prototype.query_;


/**
 * The transport type selected in the transport abstraction.
 * @type {number}
 * @private
 */
smstb.transport.Transport.prototype.type_;


/**
 * Accessor method for debugging.
 * @return {number} The selected backend type enumerable id.
 */
smstb.transport.Transport.prototype.getSelectedBackendType = function() {
  return this.type_;
};


/**
 * Helper function that retrieves the named source from the backend using the
 *   preselected querying mechanism.
 * @param {smstb.transport.Resource|string|Object} sourceName The source name
 *   to retrieve.
 * @param {function(Error, (Object|Array)): undefined} callback The handler of
 *   the returned data.
 */
smstb.transport.Transport.prototype.getSourceFromName = function(sourceName,
    callback) {
  var query = new this.query_(sourceName);
  query.send(goog.bind(this.handleResponse, this, callback));
};


/**
 * Handles the response of the query. As several transformation and contracts
 *   are expected here the differences could not be handled, but the callback
 *   is assured to be called with the correct parameters.
 * @param {function(Error, (Object|Array|string)): undefined} callback The
 *  original callback passed for the response of this request.
 * @param {smstb.transport.Response} response The wrapped response of the
 *   query.
 * @protected
 */
smstb.transport.Transport.prototype.handleResponse = function(callback,
    response) {
  var err = null;
  if (response instanceof Error) {
    err = response;
  } else {
    if (response.hasErrors()) {
      err = response.getLastError();
    }
  }
  callback(err, (response.hasErrors()) ? null : response.getResponseContent());
  goog.dispose(response);
};


/**
 * Inetrnal backend selection logic. It is run automatically on instantiation.
 * @private
 * @return {function(new: smstb.transport.Query, *): undefined} The constructor
 *   for new queries.
 */
smstb.transport.Transport.prototype.selectBackend_ = function() {
  var backend = /** @type {smstb.transport.Transport.Type} */ +(
      pstj.configure.getRuntimeValue('BACKEND',
          this.getUsableTransportAssumption_(),
          smstb.transport.config.prefix));

  this.type_ = backend;
  // Lie to the compiler
  var selection = function() {};
  switch (backend) {
    case 0:
      selection = smstb.transport.smjs.Query;
      break;
    case 1:
      selection = smstb.transport.xhr.Query;
      break;
    case 2:
      selection = smstb.transport.jsonp.Query;
      break;
    case 3:
      throw new Error('Backend not implemented yet');
      break;
    default:
      selection = smstb.transport.jsonp.Query;
  }
  return /** @type {function(new: smstb.transport.Query, *): undefined} */ (
      selection);
};


/**
 * Look up suitable transport mechanism internally in case none is configured
 *   globally.
 * @private
 * @return {number} A guessed transport type mechnism based on the known
 *   variables in different devices.
 */
smstb.transport.Transport.prototype.getUsableTransportAssumption_ = function() {
  if (goog.global['smjs']) {
    if (goog.isFunction(goog.global['smjs']['getVersion'])) {
      if ((/Android/).test(goog.global['smjs']['getVersion'])) {
        return smstb.transport.Transport.Type.XHR;
      } else {
        return smstb.transport.Transport.Type.BINARY;
      }
    } else {
      return smstb.transport.Transport.Type.SMJS;
    }
  } else {
    return smstb.transport.Transport.Type.JSONP;
  }
};
