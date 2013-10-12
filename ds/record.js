goog.provide('smstb.ds.Record');

goog.require('pstj.ds.ListItem');



/**
 * Wrapper for the video / audio record.
 * @constructor
 * @extends {pstj.ds.ListItem}
 * @param {Object} data The raw record data.
 */
smstb.ds.Record = function(data) {
  goog.base(this, data);
};
goog.inherits(smstb.ds.Record, pstj.ds.ListItem);


/**
 * The named properties in the record type.
 * @enum {string}
 */
smstb.ds.Record.Property = {
  ARTIST: 'artist',
  COST: 'cost',
  CURRENCY: 'currency',
  DESC: 'description',
  GENRE: 'genre',
  BOOKMARKED: 'isBookmarked',
  ISDIR: 'isDir',
  LOCKED: 'isLocked',
  LANGUAGE: 'language',
  CANRECORD: 'personalRecordingOptions.canRecord',
  PLAYURL: 'playURI',
  NAME: 'publishName',
  RATING: 'rating',
  SORTINDEX: 'sortIndex',
  THUMBNAIL: 'thumbnail',
  TYPE: 'type',
  YEAR: 'year',
  TIME: 'time'
};
