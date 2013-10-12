goog.provide('smstb.tv.Button');

goog.require('smstb.Remote.Keys');
goog.require('smstb.tv.ButtonRenderer');
goog.require('smstb.tv.Component');



/**
 * My new class description
 * @constructor
 * @extends {smstb.tv.Component}
 * @param {pstj.ui.ControlRenderer=} opt_r The renderer to use.
 */
smstb.tv.Button = function(opt_r) {
  goog.base(this, opt_r || smstb.tv.ButtonRenderer.getInstance());
  this.setDispatchTransitionEvents(goog.ui.Component.State.ACTIVE, true);
};
goog.inherits(smstb.tv.Button, smstb.tv.Component);


smstb.tv.decorator.register(
    smstb.tv.ButtonRenderer.getInstance().getCssClass(), smstb.tv.Button);


goog.scope(function() {

var _ = smstb.tv.Button.prototype;


/** @inheritDoc */
_.handleKey = function(key) {
  if (key == smstb.Remote.Keys.OK) {
    this.performActionInternal(null);
  } else {
    goog.base(this, 'handleKey', key);
  }
};

});  // goog.scope
