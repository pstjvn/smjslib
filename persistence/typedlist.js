goog.provide('smstb.persistence.TypedList');

goog.require('smstb.persistence.Storage');



/**
 * Provides mechanizm to store and revive complex types to local storage.
 * @constructor
 * @param {!string} key The key to use for storage.
 */
smstb.persistence.TypedList = function(key) {
  /**
   * The key that stores the named key for the value.
   * @type {!string}
   * @private
   */
  this.key_ = key;
  this.mechanizm = smstb.persistence.Storage.getInstance();
  if (goog.isNull(this.mechanizm)) {
    throw new Error('Your device seem to not support storage.<br>' +
        'If you are using iOS, make sure prive browsing is off.');
  }
};


/**
 * Stores the value of the typed object to the persistance data store.
 * @param {Array.<*>|pstj.ds.List} list The list to store.
 */
smstb.persistence.TypedList.prototype.set = function(list) {
  this.mechanizm.set(this.key_, this.serialize(list));
};


/**
 * Retrieves the value from the storage.
 * @return {!Array.<*>}
 */
smstb.persistence.TypedList.prototype.get = function() {

  var value = this.mechanizm.get(this.key_);

  if (goog.isDef(value)) {

    value = this.revive(/** @type {string} */ (value));
    if (goog.isArray(value)) {
      return /** @type {!Array.<*>} */ (value);
    }
  }
  return /** @type {!Array.<*>} */ ([]);
};


/**
 * Converts typed object to serialized value.
 * @param {Array.<*>|pstj.ds.List} list The list to serialize.
 * @return {string}
 * @protected
 */
smstb.persistence.TypedList.prototype.serialize = function(list) {
  return JSON.stringify(list);
};


/**
 * Converts string to native JS object,
 * @param {string} value The value retrieved from storage.
 * @return {*}
 * @protected
 */
smstb.persistence.TypedList.prototype.revive = function(value) {
  return JSON.parse(value);
};
