/**
 * @fileoverview Provides the classes needed for the list item generation.
 *
 * @author <regardingscot@gmail.com> (PeterStJ)
 */

goog.provide('smstb.widget.ListItem');
goog.provide('smstb.widget.ListItem.Action');
goog.provide('smstb.widget.ListItemRenderer');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('pstj.configure');
goog.require('pstj.ds.ListItem');
goog.require('pstj.ds.ListItem.EventType');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.EmbededButtonRenderer');
goog.require('pstj.ui.ListItemRenderer');
goog.require('pstj.ui.Touchable.EventType');
goog.require('smstb.ds.Record');
goog.require('smstb.template');



/**
 * Provides the renderer for the list items in the left hand side listing.
 * @constructor
 * @extends {pstj.ui.ListItemRenderer}
 */
smstb.widget.ListItemRenderer = function() {
  goog.base(this);
};
goog.inherits(smstb.widget.ListItemRenderer, pstj.ui.ListItemRenderer);
goog.addSingletonGetter(smstb.widget.ListItemRenderer);


/**
 * @const
 * @type {string}
 */
smstb.widget.ListItemRenderer.CSS_CLASS = goog.getCssName('stream-item');

goog.scope(function() {

var _ = smstb.widget.ListItemRenderer.prototype;


/** @inheritDoc */
_.defaultThumbnail = goog.asserts.assertString(pstj.configure.getRuntimeValue(
    'DEFAULT_THUMBNAIL', 'assets/default-select-image.png',
    'SYSMASTER.APPS.MOBILETV').toString());


/**
 * The default thumbnail for folders to use.
 * @type {string}
 */
_.defaultFolderThumbnail = goog.asserts.assertString(
    pstj.configure.getRuntimeValue('DEFAULT_FOLDER_THUMBNAIL',
        'assets/default-folder-thumbnail.png',
        'SYSMASTER.APPS.MOBILETV'));


/** @inheritDoc */
_.getTemplate = function(control) {
  return smstb.template.mobileItem(this.generateTemplateData(control));
};


/**
 * Helper for the thumbnail to use in the view.
 * @param {goog.ui.Component} control The component to use.
 * @private
 */
_.getThumbnail_ = function(control) {
  var thumb = control.getModel().getProp(smstb.ds.Record.Property.THUMBNAIL);
  if (goog.string.isEmpty(thumb)) {
    if (control.getModel().getProp(smstb.ds.Record.Property.ISDIR)) {
      thumb = this.defaultFolderThumbnail;
    } else {
      thumb = this.defaultThumbnail;
    }
  }
  return thumb;
};


/** @inheritDoc */
_.generateTemplateData = function(control) {
  return {
    title: control.getModel().getProp(smstb.ds.Record.Property.NAME),
    description: control.getModel().getProp(smstb.ds.Record.Property.DESC),
    type: control.getModel().getProp(smstb.ds.Record.Property.TYPE),
    thumbnail: this.getThumbnail_(control),
    cost: control.getModel().getProp(smstb.ds.Record.Property.COST),
    currency: control.getModel().getProp(smstb.ds.Record.Property.CURRENCY),
    isdir: control.getModel().getProp(smstb.ds.Record.Property.ISDIR),
    isiptv: (control.getModel().getProp(
        smstb.ds.Record.Property.TYPE) == 'iptv'),
    bookmarked: control.getModel().getProp(smstb.ds.Record.Property.BOOKMARKED)
  };
};


/** @inheritDoc */
_.getCssClass = function() {
  return smstb.widget.ListItemRenderer.CSS_CLASS;
};


/** @inheritDoc */
_.createDom = function(control) {
  return /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
      this.getTemplate(control).toString()));
};


/** @inheritDoc */
_.getKeyEventTarget = function() {
  return null;
};

});  // goog.scope



/**
 * Provides the list item controls.
 * @constructor
 * @extends {goog.ui.Control}
 * @param {goog.ui.ControlRenderer=} opt_renderer The renderer instance to use.
 */
smstb.widget.ListItem = function(opt_renderer) {
  goog.base(this, '', opt_renderer ||
      smstb.widget.ListItemRenderer.getInstance());
  this.setDispatchTransitionEvents(goog.ui.Component.State.ACTIVE, true);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  if (pstj.configure.getRuntimeValue(
      'PLATFORM', 'pc', 'SYSMASTER.APPS.MOBILETV') != 'pc') {
    this.setSupportedState(goog.ui.Component.State.HOVER, false);
  }
  /**
   * The GUIDE button.
   * @type {pstj.ui.Button}
   * @protected
   */
  this.epgguide = new pstj.ui.Button(
      /** @type {pstj.ui.CustomButtonRenderer} */(
      goog.ui.ControlRenderer.getCustomRenderer(
      pstj.ui.EmbededButtonRenderer, goog.getCssName('epg-guide'))));
  /**
   * State of the button. It will be set to active on activate and will be
   * dismissed once the state is queried.
   * @type {boolean}
   * @private
   */
  this.buttonWasActive_ = false;
  /**
   * Delays the handler for a long press.
   * @type {goog.async.Delay}
   * @private
   */
  this.longPressDelay_ = new goog.async.Delay(this.handleLongPress, 500, this);
  /**
   * The bookmarked element in the DOM.
   * @type {?Element}
   * @private
   */
  this.bookmarkedElement_ = null;
  this.bookMarkFXDelay_ = new goog.async.Delay(function() {
    goog.dom.classlist.remove(this.getElement(), goog.getCssName('bookmarked'));
  }, 1100, this);
};
goog.inherits(smstb.widget.ListItem, goog.ui.Control);


/**
 * The possible action types.
 * @enum {number}
 */
smstb.widget.ListItem.Action = {
  EPG: 0,
  PLAY: 1
};


/** @inheritDoc */
smstb.widget.ListItem.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var guide = this.getElementByClass(goog.getCssName('epg-guide'));
  if (goog.dom.isElement(guide)) {
    this.addChild(this.epgguide);
    this.epgguide.decorate(guide);
    this.getHandler().listen(this.epgguide, goog.ui.Component.EventType.ACTION,
        this.handleEpgGuideButton);
  } else {
    goog.dispose(this.epgguide);
  }
  this.bookmarkedElement_ = this.getElementByClass(goog.getCssName(
      'playable-list-item-bookmarked'));
  if (!goog.isNull(this.getModel())) {
    this.getHandler().listen(goog.asserts.assertInstanceof(
        this.getModel(), pstj.ds.ListItem,
        'The model should be a ListItem instance'),
        pstj.ds.ListItem.EventType.UPDATE,
        this.handleModelUpdate);
    this.setBookmarked(
        goog.asserts.assertBoolean(
            this.getModel().getProp(smstb.ds.Record.Property.BOOKMARKED)),
        true);
  }
};


/**
 * Allows us to catch long presses.
 * @override
 */
smstb.widget.ListItem.prototype.setState = function(
    state, enable, opt_calledFrom) {
  if (state == goog.ui.Component.State.ACTIVE) {
    if (!this.isActive() && enable) {
      this.enableLongPressDelay(true);
    } else if (!enable) {
      this.enableLongPressDelay(false);
    }
  }
  goog.base(this, 'setState', state, enable, opt_calledFrom);
};


/**
 * @override
 * @return {pstj.ds.ListItem}
 */
smstb.widget.ListItem.prototype.getModel = function() {
  var model = goog.base(this, 'getModel');
  if (!goog.isNull(model)) {
    return goog.asserts.assertInstanceof(model, pstj.ds.ListItem);
  } else {
    return null;
  }
};


/**
 * Called when the item is first activated.
 * @protected
 * @param {boolean} enable If the delay should be enabled or disabled.
 */
smstb.widget.ListItem.prototype.enableLongPressDelay = function(enable) {
  if (enable) {
    this.longPressDelay_.start();
  } else {
    this.longPressDelay_.stop();
  }
};


/**
 * Handles the long press detection. Removes the active state and dispatches
 * the LONG_PRESS touchable event.
 * @protected
 */
smstb.widget.ListItem.prototype.handleLongPress = function() {
  if (this.isActive()) {
    this.setActive(false);
    this.dispatchEvent(pstj.ui.Touchable.EventType.LONG_PRESS);
  }
};


/**
 * Handles the button. The situation is like this: the button fires its 'ACTION'
 * event but right after it the parent control also figures out its time to
 * fire. Too much conditions in the handler as it listens on the whole list.
 * Instead we handle the race here.
 * @param {goog.events.Event} e The ACTION event from the button.
 * @protected
 */
smstb.widget.ListItem.prototype.handleEpgGuideButton = function(e) {
  e.stopPropagation();
  this.buttonWasActive_ = true;
  this.setActive(false);
  this.performActionInternal(null);

};


/**
 * Custom action type getter to decide if we should display EPG or play the
 * channel.
 * @return {smstb.widget.ListItem.Action}
 */
smstb.widget.ListItem.prototype.getActionType = function() {
  var result = -1;
  if (this.buttonWasActive_) {
    result = smstb.widget.ListItem.Action.EPG;
  } else {
    result = smstb.widget.ListItem.Action.PLAY;
  }
  this.buttonWasActive_ = false;
  return result;
};


/**
 * Sets the bookmarked property on the UI of the element.
 * @param {boolean} bookmarked If true shows the Bookmark icon.
 * @param {boolean=} opt_suppers_fx If true do not trigger the FX.
 * @protected
 */
smstb.widget.ListItem.prototype.setBookmarked = function(
    bookmarked, opt_suppers_fx) {
  if (!opt_suppers_fx) {
    goog.dom.classlist.add(this.getElement(), goog.getCssName('bookmarked'));
    this.bookMarkFXDelay_.start();
  }
  this.bookmarkedElement_.style.display = ((bookmarked) ? 'block' : 'none');
};


/**
 * Called when the model is updated externally.
 * @protected
 */
smstb.widget.ListItem.prototype.handleModelUpdate = function() {
  this.setBookmarked(!!this.getModel().getProp(
      smstb.ds.Record.Property.BOOKMARKED));
};
