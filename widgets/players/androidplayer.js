goog.provide('smstb.widget.AndroidPlayer');

goog.require('goog.string');
goog.require('goog.ui.Component');



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
  window.open(smstb.widget.AndroidPlayer.PREFIX + goog.string.urlEncode(url));
};


/**
 * The android intent URL (prefix) that should be used to trigger the intent for
 * playback on the Android's default browser. Note that intent is not detected
 * by firefox in this case!
 * @type {string}
 * @final
 */
smstb.widget.AndroidPlayer.PREFIX =
    'http://longa.com/webapp/android/longaapp.html?url=';
