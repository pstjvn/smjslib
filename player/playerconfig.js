goog.provide('smstb.player.config');

goog.require('pstj.ds.List');
goog.require('smstb.template');


/**
 * Provides unified access to the option symbols as the player understands
 *   them.
 * @enum {number}
 */
smstb.player.config.Symbols = {
  PLAY: 0,
  REPEAT: 1,
  REPEAT_ALL: 2,
  SHUFFLE_ALL: 3,
  PLAY_NO_CAM: 4
};


/**
 * @private
 * @type {Array.<string>}
 */
smstb.player.config.optionNames_ = smstb.template.playerOptions({}).split('|');


/**
 * Publically available list of the possible values for the player config
 *   listing.
 * @type {pstj.ds.List}
 */
smstb.player.config.Options = new pstj.ds.List([
  {
    'id': 1,
    'value': smstb.player.config.Symbols.PLAY,
    'text': smstb.player.config.optionNames_[0]
  }, {
    'id': 2,
    'value': smstb.player.config.Symbols.REPEAT,
    'text': smstb.player.config.optionNames_[1]
  }, {
    'id': 3,
    'value': smstb.player.config.Symbols.REPEAT_ALL,
    'text': smstb.player.config.optionNames_[2]
  }, {
    'id': 4,
    'value': smstb.player.config.Symbols.SHUFFLE_ALL,
    'text': smstb.player.config.optionNames_[3]
  }, {
    'id': 5,
    'value': smstb.player.config.Symbols.PLAY_NO_CAM,
    'text': smstb.player.config.optionNames_[4]
  }
]);


smstb.player.config.Options.enableListRewind(true);
