goog.provide('smstb.widget.AndroidPlayer');

goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('pstj.configure');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
smstb.widget.AndroidPlayer = function() {
  goog.base(this);
};
goog.inherits(smstb.widget.AndroidPlayer, goog.ui.Component);


/** @inheritDoc */
smstb.widget.AndroidPlayer.prototype.setModel = function(url) {
  if (pstj.configure.getRuntimeValue(
      'EMBED', 0, 'SYSMASTER.APPS.MOBILETV') == 1) {
    window.open(url + '&embed=1',
        (!!goog.global['cordova']) ? '_system' : undefined);
  } else {
    window.open(smstb.widget.AndroidPlayer.PREFIX + goog.string.urlEncode(url),
        (!!goog.global['cordova']) ? '_system' : undefined);
  }
};


/**
 * @define {string} The android intent URL (prefix) that should be used to
 * trigger the intent for playback on the Android's default browser.
 * Note that intent is not detected by firefox in this case!
 */
smstb.widget.AndroidPlayer.PREFIX = goog.define('smstb.widget.AndroidPlayer.PREFIX',
    'smiptv://sysmaster.com/webapp/android/iptvapp.html?url=');
