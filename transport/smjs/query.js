goog.provide('smstb.transport.smjs.Query');

goog.require('goog.Disposable');
goog.require('smstb.transport.Query');
goog.require('smstb.transport.smjspackage.Base');

/**
 * Implementation fof the Query interface over SMJS.
 * @constructor
 * @implements {smstb.transport.Query}
 * @extends {goog.Disposable}
 * @param {string|Object|smstb.transport.Resource} source The resource to
 *   retrieve.
 */
smstb.transport.smjs.Query = function(source) {
  if (goog.isNumber(source)) {
    source = this.getSourceFromEnumeration(source);
  }
  if (!goog.isObject(source)) {
    throw new Error('Cannot find payload for source');
  }
  source['newif'] = 1;
  this.query_ = new smstb.transport.smjspackage.Base(
    /** @type {Object} */ (source));
};
goog.inherits(smstb.transport.smjs.Query, goog.Disposable);

/**
 * Implements the send method in the interface.
 * @param {function(smstb.transport.Response): undefined} callback The handler
 *   for the query.
 * @override
 */
smstb.transport.smjs.Query.prototype.send = function(callback) {
  this.query_.send(callback);
};

/** @inheritDoc */
smstb.transport.smjs.Query.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.dispose(this.query_);
  this.query_ = null;
};

/**
 * Retrieves the payload for a known source.
 * @protected
 * @param {number} eid The enumeration ID to look up.
 * @return {SMJSJson.CallDRequest} The appropriate payload for this source.
 */
smstb.transport.smjs.Query.prototype.getSourceFromEnumeration = function(eid) {
  return smstb.transport.smjs.Query.Payload[eid];
};

/**
 * Enumerated the available known sources. Note that those are not
 *   configurable at run time as they tend to be static in the backend.
 * @type {Array.<SMJSJson.CallDRequest>}
 */
smstb.transport.smjs.Query.Payload = [
  // IPTVLIST
  {
    run: 'iptv_json_list',
    newif: 1
  },
  // IPTVEPG
  {
    run: 'epg_json_list',
    newif: 1
  },
  // VODLIST
  {
    run: 'vod_json_list',
    newif: 1
  },
  //PPVLIST
  {
    run: 'ppv_json_list',
    newif: 1
  },
  //USEVIDELIST
  {
    run: 'uvideo_json_list',
    newif: 1
  },
  //AODLIST
  {
    run: 'aod_json_list',
    newif: 1
  },
  //ONLINERADIOLIST
  {
    run: 'radio_json_list',
    newif: 1
  }
];
