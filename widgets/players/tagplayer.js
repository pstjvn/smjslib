goog.provide('smstb.widget.TagPlayer');

goog.require('goog.ui.Component');
goog.require('smstb.player.EventType');



/**
 * Super simple player based on the video tag.
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
smstb.widget.TagPlayer = function() {
  goog.base(this);
};
goog.inherits(smstb.widget.TagPlayer, goog.ui.Component);


goog.scope(function() {

var _ = smstb.widget.TagPlayer.prototype;


/**
 * Used to set the src on the tag.
 * @inheritDoc
 */
_.setModel = function(url) {
  if (goog.isString(url)) {
    this.getElement()['src'] = url;
    this.getElement().load();
    this.getElement().play();
  }
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getElement(), 'pause', function(e) {
    this.dispatchEvent(smstb.player.EventType.PAUSE);
  });
};

});  // goog.scope
