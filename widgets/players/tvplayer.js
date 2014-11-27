goog.provide('smstb.widget.TVPlayer');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlRenderer');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.CustomButtonRenderer');
goog.require('pstj.ui.ngAgent');
goog.require('smstb.ds.Record');
goog.require('smstb.player.EventType');
goog.require('smstb.widget.AndroidPlayer');
goog.require('smstb.widget.FlashPlayer');
goog.require('smstb.widget.TagPlayer');



/**
 * @constructor
 * @extends {goog.ui.Control}
 */
smstb.widget.TVPlayer = function() {
  goog.base(this, '', goog.ui.ControlRenderer.getCustomRenderer(
      goog.ui.ControlRenderer, goog.getCssName('right')));

  this.setHandleMouseEvents(false);
  this.setAutoStates(goog.ui.Component.State.ALL, false);

  this.backButton = new pstj.ui.Button(
      /** @type {pstj.ui.CustomButtonRenderer} */ (
      goog.ui.ControlRenderer.getCustomRenderer(
      pstj.ui.CustomButtonRenderer, goog.getCssName('backbutton'))));

  this.player_ = null;
  /**
   * Flag, if the player should try to use casting.
   * @type {boolean}
   * @private
   */
  this.useCast_ = false;
};
goog.inherits(smstb.widget.TVPlayer, goog.ui.Control);


/**
 * The play type string. To be added to the playurl for starting playback.
 * @type {string}
 * @final
 */
smstb.widget.TVPlayer.PLAY_TYPE = '&t=1';


/**
 * Enables the casting. This means that the user has pressed the cast
 * icon and as a result we should initiate session and if there is already
 * media selected previously start playing it. If there has been no media
 * previously we should just create the session.
 * @param {boolean} enable If we should start a session or stop it.
 */
smstb.widget.TVPlayer.prototype.enableCasting = function(enable) {
  if (this.useCast_ != enable) {
    // In this app it is safe to assume that there is no session when we
    // receive this call. We also want to start playing right away and do not
    // stop (but change media) until the session is stopped
    if (enable) {
      // create the session
      pstj.cast.Cast.getInstance().createSession();
      this.getHandler().listen(
          pstj.cast.Cast.getInstance(),
          pstj.cast.Cast.EventType.READY,
          this.onCastReady);
    } else {
      pstj.cast.Cast.getInstance().destroySession();
      this.getHandler().unlisten(
          pstj.cast.Cast.getInstance(),
          pstj.cast.Cast.EventType.READY,
          this.onCastReady);
    }
    this.useCast_ = enable;
  }
};


/**
 * Handles the cast ready, also used to start new media.
 * @param {goog.events.Event} e
 * @protected
 */
smstb.widget.TVPlayer.prototype.onCastReady = function(e) {
  if (this.useCast_) {
    if (!goog.isNull(this.getModel())) {
      pstj.cast.Cast.getInstance().castUrl(
          this.getModel().getProp(smstb.ds.Record.Property.CASTURL),
          this.getModel().getProp(smstb.ds.Record.Property.NAME));
    }
  }
};


/** @inheritDoc */
smstb.widget.TVPlayer.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  try {
    this.player_ = this.createPlayer();
  } catch (e) {
    if (goog.DEBUG) {
      console.log('Flash seems to be blocked?');
    } else {
      alert('You seem to be blocking Flash, please enable it and try again');
    }
    return;
  }
  this.backButton.decorate(this.getElementByClass(
      goog.getCssName('backbutton')));
};


/** @inheritDoc */
smstb.widget.TVPlayer.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.backButton,
      goog.ui.Component.EventType.ACTION, function(e) {
        e.stopPropagation();
        this.setActive(false);
      });
  this.getHandler().listen(this, smstb.player.EventType.PAUSE, function(e) {
    this.setActive(false);
  });
};


/** @inheritDoc */
smstb.widget.TVPlayer.prototype.setModel = function(model) {
  goog.asserts.assertInstanceof(model, pstj.ds.ListItem);
  goog.base(this, 'setModel', model);
  pstj.ui.ngAgent.getInstance().apply(this);
  console.log('Using cast?');
  if (this.useCast_) {
    this.onCastReady(null);
  } else {

    this.player_.setModel(
        this.getModel().getProp(smstb.ds.Record.Property.PLAYURL) +
        smstb.widget.TVPlayer.PLAY_TYPE);

    this.setActive(true);
  }
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
      this.addChild(player);
      player.decorate(this.getElement().querySelector('video'));
      break;
    case 'pc':
      player = new smstb.widget.FlashPlayer();
      this.addChild(player);
      player.decorate(this.getElement().querySelector('video'));
      break;
    default:
      throw new Error('Platform unknown');
  }
  return player;
};
