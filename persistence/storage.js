goog.provide('smstb.persistence.Storage');

goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');


/**
 * The storage mechanism pointer to be shared.
 * @type {goog.storage.Storage}
 * @private
 */
smstb.persistence.Storage.instance_ = new goog.storage.Storage(
    /** @type {!goog.storage.mechanism.Mechanism} */
    (goog.storage.mechanism.mechanismfactory.create()));


/**
 * Getter for the storage persisitance model.
 * @return {goog.storage.Storage} The sotrage abstraction.
 */
smstb.persistence.Storage.getInstance = function() {
  return smstb.persistence.Storage.instance_;
};
