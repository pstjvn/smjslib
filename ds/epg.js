/**
 * @fileoverview Symbol mapping for the names in the EPG listings. It is used to
 * allow for consistent access to properties from the code and asier mutation
 * should the server change mappings. Used in MobileTV.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('smstb.ds.Epg.Cache');
goog.provide('smstb.ds.Epg.Property');

goog.require('pstj.ds.Cache');



/**
 * Provides the epg cache. Extends the base class by checking for timeout for
 * the cache.
 * @constructor
 * @extends {pstj.ds.Cache}
 */
smstb.ds.Epg.Cache = function() {
  goog.base(this);
  /**
   * The time cache.
   * @type {pstj.ds.Cache}
   * @private
   */
  this.timeCahce_ = new pstj.ds.Cache();
  /**
   * The time that we will consider a value in the cache correct.
   * @type {number}
   * @private
   */
  this.expirationInterval_ = 1000 * 60 * 10 * 12;
};
goog.inherits(smstb.ds.Epg.Cache, pstj.ds.Cache);
goog.addSingletonGetter(smstb.ds.Epg.Cache);

goog.scope(function() {

var _ = smstb.ds.Epg.Cache.prototype;


/**
 * Sets the expiration interval.
 * @param {number} expiration_interval The milliseconds to consider a cache
 * value as valid.
 */
_.setExpirationInterval = function(expiration_interval) {
  this.expirationInterval_ = expiration_interval;
};


/** @inheritDoc */
_.set = function(key, data) {
  goog.base(this, 'set', key, data);
  this.timeCahce_.set(key, goog.now());
};


/** @inheritDoc */
_.has = function(key) {
  return this.timeCahce_.has(key) && (
      goog.now() - goog.asserts.assertNumber(
      this.timeCahce_.get(key)) < this.expirationInterval_);
};


/** @inheritDoc */
_.remove = function(key) {
  if (this.has(key)) {
    this.timeCahce_.remove(key);
    goog.base(this, 'remove', key);
  }
};

});  // goog.scope


/**
 * Provides the named symbols for the data in the EPG listings returned by the
 * server.
 * @enum {string}
 */
smstb.ds.Epg.Property = {
  TITLE: 'publishName',
  START_TIME: 'startTime',
  END_TIME: 'endTime',
  DESCRIPTION: 'description',
  TIME: 'time',
  RATING: 'rating',
  GENRE: 'genre',
  ARTIST: 'artists',
  YEAR: 'year',
  IS_DATE_DELIMITER: 'separator',
  CHANNEL_ID: 'channelid'
};
