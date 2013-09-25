goog.provide('smstb.widget.TVPlayer');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ControlRenderer');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.CustomButtonRenderer');
goog.require('pstj.ui.ngAgent');
goog.require('smstb.ds.Record');
goog.require('smstb.widget.AndroidPlayer');
goog.require('smstb.widget.FlashPlayer');
goog.require('smstb.widget.TagPlayer');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
smstb.widget.TVPlayer = function() {
  goog.base(this);
  this.backButton = new pstj.ui.Button(
      /** @type {pstj.ui.CustomButtonRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
      pstj.ui.CustomButtonRenderer, goog.getCssName('backbutton'))));
  this.player_ = null;
};
goog.inherits(smstb.widget.TVPlayer, goog.ui.Component);


/**
 * The play type string. To be added to the playurl for starting playback.
 * @type {string}
 * @final
 */
smstb.widget.TVPlayer.PLAY_TYPE = '&t=1';


/** @inheritDoc */
smstb.widget.TVPlayer.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.player_ = this.createPlayer();
  this.backButton.decorate(this.getElementByClass(
      goog.getCssName('backbutton')));
};


/** @inheritDoc */
smstb.widget.TVPlayer.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.backButton,
      goog.ui.Component.EventType.ACTION, function(e) {
        e.stopPropagation();
        goog.dom.classlist.enable(this.getElement(),
            goog.getCssName('right-active'), false);
      });
};


/** @inheritDoc */
smstb.widget.TVPlayer.prototype.setModel = function(model) {
  goog.asserts.assertInstanceof(model, pstj.ds.ListItem,
      'The model should be list item instance');
  goog.base(this, 'setModel', model);
  pstj.ui.ngAgent.getInstance().apply(this);
  this.player_.setModel(this.getModel().getProp(
      smstb.ds.Record.Property.PLAYURL) +
      smstb.widget.TVPlayer.PLAY_TYPE);
  goog.dom.classlist.enable(this.getElement(), goog.getCssName(
      'right-active'), true);
};


/**
 * Creates the appropriate player.
 * @return {goog.ui.Component}
 * @protected
 */
smstb.widget.TVPlayer.prototype.createPlayer = function() {
  var player;
  switch (pstj.configure.getRuntimeValue('PLATFORM', 'ios',
      'SYSMASTER.APPS.MOBILETV')) {
    case 'android':
      player = new smstb.widget.AndroidPlayer();
      break;
    case 'ios':
      player = new smstb.widget.TagPlayer();
      player.decorate(this.getElement().querySelector('video'));
      break;
    case 'pc':
      player = new smstb.widget.FlashPlayer();
      player.decorate(this.getElement().querySelector('video'));
      break;
    default:
      throw new Error('Platform unknown');
  }
  return player;
};
