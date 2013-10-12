goog.provide('smstb.tv.InlineList');
goog.provide('smstb.tv.InlineListRenderer');

goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('pstj.ds.ListItem');
goog.require('pstj.ui.ngAgent');
goog.require('smstb.Remote.Keys');
goog.require('smstb.player.config');
goog.require('smstb.template');
goog.require('smstb.tv.Component');
goog.require('smstb.tv.ComponentRenderer');
goog.require('smstb.tv.decorator');



/**
 * Provides the UI for selecting from list of options. Only single selection
 * is supported.
 *
 * @constructor
 * @extends {smstb.tv.Component}
 * @param {pstj.ui.ControlRenderer=} opt_r Optional renderer to use.
 */
smstb.tv.InlineList = function(opt_r) {
  goog.base(this, opt_r || smstb.tv.InlineListRenderer.getInstance());
  this.setHandleMouseEvents(false);
  /**
   * The list of data. This should be set only once!
   * @type {pstj.ds.List}
   * @private
   */
  this.list_ = null;
};
goog.inherits(smstb.tv.InlineList, smstb.tv.Component);


goog.scope(function() {

var _ = smstb.tv.InlineList.prototype;


/** @inheritDoc */
_.setModel = function(model) {
  if (model instanceof pstj.ds.List) {
    this.list_ = model;
    goog.base(this, 'setModel', model.getCurrent());
  } else {
    goog.base(this, 'setModel', model);
  }
  pstj.ui.ngAgent.getInstance().apply(this);
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');

  pstj.ui.ngAgent.getInstance().apply(this);

  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
      function(e) {
        if (goog.isNull(this.list_)) {
          throw new Error('There is no data in the listing');
        }

        var dir = goog.dom.dataset.get(e.target, 'dir');

        if (goog.isDef(dir)) {
          if (dir == 'left') {
            this.changeSelection(false);
          } else if (dir == 'right') {
            this.changeSelection(true);
          }
        }
      });
};


/** @inheritDoc */
_.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.list_ = null;
};


/**
 * Alter the selection in the list.
 * @param {boolean} forward True if we want to move to the next selection.
 */
_.changeSelection = function(forward) {
  this.list_.setCurrent(goog.asserts.assertInstanceof(
      ((forward) ? this.list_.getNext() : this.list_.getPrevious()),
      pstj.ds.ListItem));

  this.setModel(this.list_.getCurrent());
};


/** @inheritDoc */
_.handleKey = function(key) {
  if (key == smstb.Remote.Keys.LEFT) {
    this.changeSelection(false);
  } else if (key == smstb.Remote.Keys.RIGHT) {
    this.changeSelection(true);
  } else {
    goog.base(this, 'handleKey', key);
  }
};

});  // goog.scope



/**
 * Provides the renderer for the inline listing.
 *
 * @constructor
 * @extends {smstb.tv.ComponentRenderer}
 */
smstb.tv.InlineListRenderer = function() {
  goog.base(this);
};
goog.inherits(smstb.tv.InlineListRenderer, smstb.tv.ComponentRenderer);
goog.addSingletonGetter(smstb.tv.InlineListRenderer);


/**
 * The class name to use for the component.
 * @type {string}
 * @const
 */
smstb.tv.InlineListRenderer.CSS_CLASS = goog.getCssName('tv-inline-list');


goog.scope(function() {

var _ = smstb.tv.InlineListRenderer.prototype;


/** @inheritDoc */
_.getCssClass = function() {
  return smstb.tv.InlineListRenderer.CSS_CLASS;
};


/** @inheritDoc */
_.decorate = function(comp, el) {
  var elem = goog.base(this, 'decorate', comp, el);
  elem.appendChild(goog.dom.htmlToDocumentFragment(
      smstb.template.inlinelist({})));
  return elem;
};


/** @inheritDoc */
_.getContentElement = function(el) {
  return el.querySelector(goog.getCssName(
      smstb.tv.InlineListRenderer.CSS_CLASS, 'value')) || el;
};

});  // goog.scope


/**
 * Register automatic decorator.
 */
smstb.tv.decorator.register(
    smstb.tv.InlineListRenderer.getInstance().getCssClass(),
    smstb.tv.InlineList);
