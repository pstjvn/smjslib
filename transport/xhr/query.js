goog.provide('smstb.transport.xhr.Query');

goog.require('goog.Disposable');
goog.require('goog.asserts');
goog.require('goog.net.XhrIo');
goog.require('pstj.configure');
goog.require('smstb.persistence.categories');
goog.require('smstb.persistence.languages');
goog.require('smstb.transport.Query');
goog.require('smstb.transport.config');
goog.require('smstb.transport.xhr.Response');

/**
 * @fileoverview Imeplemtation of the Query interface for the XHR layer.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Implements the smstb.transport.Query interface using the XHR transport.
 * @constructor
 * @implements {smstb.transport.Query}
 * @extends {goog.Disposable}
 * @param {string|Object|smstb.transport.Resource} source The source to
 *   retrieve.
 */
smstb.transport.xhr.Query = function(source) {
  if (goog.isNumber(source)) {
    source = this.getSourceFromEnumeration(
      /** @type {smstb.transport.Resource} */ (source));
  }
  goog.asserts.assertString(source, 'The parameter couldnt be converted to' +
    ' string');
  this.uri = this.composeUri(source);
};
goog.inherits(smstb.transport.xhr.Query, goog.Disposable);

/**
 * Imeplements the send method from the interface.
 * @param {function(smstb.transport.Response): undefined} callback The handler
 *   for the result.
 */
smstb.transport.xhr.Query.prototype.send = function(callback) {
  goog.net.XhrIo.send(this.uri, goog.bind(this.handleCompleteEvent, this,
    callback));
};

/**
 * The default URI prefix to use.
 * @type {string}
 */
smstb.transport.xhr.Query.uriPrefix = '';

/**
 * The default URI exec path to use.
 * @type {string}
 */
smstb.transport.xhr.Query.uriExecPath = '/cgi-bin/if.cgi?';

/**
 * The default URI param (run) to use.
 * @type {string}
 */
smstb.transport.xhr.Query.uriRunParam = 'run=mstreams';

/**
 * The URI to use with the request.
 * @type {string}
 */
smstb.transport.xhr.Query.prototype.uri;

/**
 * Handles the complete event from the XHR transport layer.
 * @param {function(smstb.transport.Response): undefined} callback Handler of
 *   the Response opbject.
 * @param {goog.events.Event} e The complete event from the XHR.
 * @protected
 */
smstb.transport.xhr.Query.prototype.handleCompleteEvent = function(callback,
  e) {
  // the transport itself will handle the connunct. just make sure to submit
  // the response as reponse object.
  var result = this.constructResponse(e.target.isSuccess() ?
    e.target.getResponseText() : '');
  callback(result);
  goog.dispose(result);
  goog.dispose(this);
};

/**
 * Constructs the respone object requered.
 * @protected
 * @param {string} string The serialized json string to parse.
 * @return {smstb.transport.Response} The response object.
 */
smstb.transport.xhr.Query.prototype.constructResponse = function(string) {
  return new smstb.transport.xhr.Response(string);
};

/**
 * Turn enumerable resource into valid string for retrieval.
 * @protected
 * @param {smstb.transport.Resource} num The enumerable ID of the source data.
 * @return {string} The source URI for the enumerable source.
 */
smstb.transport.xhr.Query.prototype.getSourceFromEnumeration = function(num) {
  if (goog.isNumber(num)) {
    return this.getPrefix() + this.getExecPath() + this.getRunParam(num);
  } else {
    throw new Error('The enumerable URI getter expects number, but' +
      ' instead it got ' + goog.typeOf(num));
  }
};

/**
 * Composes the Uri by appending additionals parameters that might be needed.
 * @protected
 * @param {string} source The primary URI for the source.
 * @return {string} The URI augmented with the needed parameters.
 */
smstb.transport.xhr.Query.prototype.composeUri = function(source) {
  if (!!pstj.configure.getRuntimeValue('USE_LANGUAGES', true,
    smstb.transport.config.prefix)) {
    source += this.getLanguages();
  }
  if (!!pstj.configure.getRuntimeValue('USE_CATEGORIES', true,
    smstb.transport.config.prefix)) {
    source += this.getCategories();
  }
  if (!!pstj.configure.getRuntimeValue('APPEND_CREDENTIALS', false,
    smstb.transport.config.prefix)) {
    source += this.getCredentials();
  }
  return source;
};

/**
 * Getter for any language settings that might be available in the system.
 * @return {string} The language settings string from the URI.
 * @protected
 */
smstb.transport.xhr.Query.prototype.getLanguages = function() {
  var val = smstb.persistence.languages.getInstance().getSelectedIndexes();
  if (goog.isNull(val)) return '';
  return '&languages=' + val.join(',');
};

/**
 * Getter for any category settings that might be avialble in the system.
 * @return {string} list of catogories to use in the URI.
 * @protected
 */
smstb.transport.xhr.Query.prototype.getCategories = function() {
  var val = smstb.persistence.categories.getInstance().getSelectedIndexes();
  if (goog.isNull(val)) return '';
  return '&categories=' + val.join(',');
};

/**
 * Getter for the credentials that might be stored in the system.
 * @return {string} the user credentials to be used in the URI.
 * @protected
 */
smstb.transport.xhr.Query.prototype.getCredentials = function() {
  return '';
};

/**
 * Getter for the prefix to be used in the URI composition.
 * @protected
 * @return {string} The Domain part of the URI.
 */
smstb.transport.xhr.Query.prototype.getPrefix = function() {
  return pstj.configure.getRuntimeValue('URI_PREFIX',
    smstb.transport.xhr.Query.uriPrefix,
    smstb.transport.config.prefix).toString();
};

/**
 * Getter for the exec path for the source. This is the cgi-bin path usually.
 * @protected
 * @return {string} The cgi bin path to use in the URI.
 */
smstb.transport.xhr.Query.prototype.getExecPath = function() {
  return pstj.configure.getRuntimeValue('URI_EXEC_PATH',
    smstb.transport.xhr.Query.uriExecPath,
    smstb.transport.config.prefix).toString();
};

/**
 * Getter for the run param for the URI.
 * @protected
 * @param {smstb.transport.Resource} enumId The number of the enumerable
 *   source.
 * @return {string} The run parameter in the URI to compose.
 */
smstb.transport.xhr.Query.prototype.getRunParam = function(enumId) {
  var runtime = pstj.configure.getRuntimeValue('URI_RUN_PARAMS_' + enumId,
    smstb.transport.xhr.Query.Uri[enumId],
    smstb.transport.config.prefix);
  if (!goog.isString(runtime)) {
    throw new Error('Cannot find run parameter for enumerable source with' +
      ' id' + enumId);
  }
  return runtime;
};

/** @inheritDoc */
smstb.transport.xhr.Query.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};

/**
 * The map of enumerable source to Uri
 * @type {Array.<string>}
 */
smstb.transport.xhr.Query.Uri = [
// IPTVLIST
  'run=mstreams'
];
