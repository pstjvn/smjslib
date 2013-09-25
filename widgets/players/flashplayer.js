goog.provide('smstb.widget.FlashPlayer');

goog.require('goog.dom');
goog.require('goog.ui.Component');

/**
 * Provides the Flash player implementation.
 * @constructor
 * @extends {goog.ui.Component}
 */
smstb.widget.FlashPlayer = function() {
  goog.base(this);
  if (!goog.isFunction(window['jwplayer'])) throw new Error('JWPlayer not installed');
  /**
   * @type {Function}
   * @protected
   */
  this.player_f = window['jwplayer'];
};
goog.inherits(smstb.widget.FlashPlayer, goog.ui.Component);

/** @inheritDoc */
smstb.widget.FlashPlayer.prototype.decorateInternal = function(el) {
  // we expect the video tag element, but we do not want it so...
  var dom = goog.dom.createDom('div', {
    id: 'flowplayercontainer'
  });
  goog.dom.replaceNode(dom, el);
  goog.base(this, 'decorateInternal', dom);
  this.player_f('flowplayercontainer')['setup']({
    'flashplayer': goog.global['FLASH_PLAYER_URL'],
    'height': '100%',
    'width': '100%'
  });
};

/** @inheritDoc */
smstb.widget.FlashPlayer.prototype.setModel = function(url) {
  if (goog.isString(url)) {
    this.player_f('flowplayercontainer')['load']({
      'file': url,
      'provider': goog.global['ADAPTIV_PROVIDER']
    });
    this.player_f('flowplayercontainer')['play']();
  }
};
