/**
 * @fileoverview Abstraction over list values that should be able to persist
 *   in the browser data storage.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.persistence.List');

goog.require('goog.async.Delay');
goog.require('smstb.persistence.Storage');



/**
 * Provides asbtracted view on list of storeable values. The list expects
 *   values to always be a simple array.
 * @param {!string} storage_name The name of the storage value to use with the
 *   listing.
 * @constructor
 * @extends {goog.Disposable}
 */
smstb.persistence.List = function(storage_name) {
  /**
   * The name of the storage key to use.
   * @type {!string}
   * @protected
   */
  this.name = storage_name;
  /**
   * The stored value.
   * @type {Array.<number>}
   */
  this.value = null;
  /**
   * The names of the possible values in the store.
   * @type {Array}
   */
  this.list = [];
  /**
   * Artificial delay introduced to work around use case where accessing the
   *   storage is too slow.
   * @type {goog.async.Delay}
   * @private
   */
  this.delay_ = new goog.async.Delay(this.applyValueToStorage_, 1500, this);
  var value = smstb.persistence.Storage.getInstance().get(this.name);
  if (goog.isDef(value)) {
    this.value = /** @type {Array.<number>} */(value);
  }
};
goog.inherits(smstb.persistence.List, goog.Disposable);


/**
 * Saves the current value in the stoage mechinism automatically selected.
 *   Called asynchroniously.
 * @private
 */
smstb.persistence.List.prototype.applyValueToStorage_ = function() {
  smstb.persistence.Storage.getInstance().set(this.name, this.value);
};


/**
 * Fills in the names of the values that are stored. Those are intentionally
 *   externalized to allow renaming them without the need to override the
 *   storage.
 * @param {Array} list The list of names for the possible values in the listing.
 */
smstb.persistence.List.prototype.setNamedList = function(list) {
  this.list = list;
};


/**
 * Getter for the named listing.
 * @return {Array} The list previously assigned.
 */
smstb.persistence.List.prototype.getNamedList = function() {
  return this.list;
};


/**
 * Getter for the currently selected indexes. The method is introduced to safe
 *   guard the API.
 * @return {Array.<number>} The selected indexes.
 */
smstb.persistence.List.prototype.getSelectedIndexes = function() {
  return /** @type {Array.<number>} */ (this.value);
};


/**
 * Sets new list with selected indexes.
 * @param {Array.<number>} list The new selected indexes.
 */
smstb.persistence.List.prototype.setSelectedIndexes = function(list) {
  if (!goog.isArray(list)) {
    throw new Error('Only array of numbers should be assigned');
  }
  this.value = /** @type {Array.<number>} */ (list);
  this.delay_.start();
};


/** @inheritDoc */
smstb.persistence.List.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.dispose(this.delay_);
  this.list = null;
  this.value = null;
};
