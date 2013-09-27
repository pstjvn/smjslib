goog.provide('smstb.tv.PlayerDialog');

goog.require('goog.async.nextTick');
goog.require('goog.ui.ControlRenderer');
goog.require('smstb.player.config');
goog.require('smstb.tv.Button');
goog.require('smstb.tv.Container');
goog.require('smstb.tv.ContainerRenderer');
goog.require('smstb.tv.InlineList');
goog.require('smstb.tv.decorator');

/**
 * Provides the dialog for player configuration.
 * @constructor
 * @extends {smstb.tv.Container}
 */
smstb.tv.PlayerDialog = function() {
  goog.base(this, (
    /** @type {pstj.ui.ControlRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
    smstb.tv.ContainerRenderer, goog.getCssName('player-dialog')))));
};
goog.inherits(smstb.tv.PlayerDialog, smstb.tv.Container);

smstb.tv.decorator.register(goog.getCssName('player-dialog'),
  smstb.tv.PlayerDialog);

goog.scope(function() {

  var _ = smstb.tv.PlayerDialog.prototype;

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    goog.async.nextTick(function() {
      this.getChildAt(1).setModel(smstb.player.config.Options);
    }, this);
  };

  /** @inheritDoc */
  _.getModel = function() {
    return this.getChildAt(1).getModel();
  };

});
