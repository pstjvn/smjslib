goog.provide('smstb.tv.Component');
goog.provide('smstb.tv.Component.Event');
goog.provide('smstb.tv.Component.EventType');

goog.require('goog.dom.dataset');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.ui.Control');
goog.require('smstb.tv.ComponentRenderer');
goog.require('smstb.tv.Topic');
goog.require('smstb.tv.bus');
goog.require('smstb.tv.decorator');

/**
 * This is the base TV component class. Those components are assumed to be run
 *   on TV/STB devices and might not behave as expected in browser and
 *   expecially in touch environment.
 * @constructor
 * @extends {goog.ui.Control}
 * @param {pstj.ui.ControlRenderer=} opt_r Optional renderer to use.
 */
smstb.tv.Component = function(opt_r) {
  goog.base(this, '', opt_r || smstb.tv.ComponentRenderer.getInstance());
  /**
   * @private
   * @type {boolean}
   */
  this.focusFollowsMouse_ = false;
  this.setDispatchTransitionEvents(goog.ui.Component.State.FOCUSED, true);
};
goog.inherits(smstb.tv.Component, goog.ui.Control);

smstb.tv.decorator.register(
  smstb.tv.ComponentRenderer.getInstance().getCssClass(), smstb.tv.Component);

goog.scope(function() {

  var _ = smstb.tv.Component.prototype;
  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.FOCUS,
      this.notifyParent);
  };

  /**
   * Handles the focus event.
   * @param {goog.events.Event} e The FOCUS component event.
   */
  _.notifyParent = function(e) {
    var parent = this.getParent();
    if (parent instanceof smstb.tv.Component) {
      parent.setFocusedChild(this);
    }
  };


  /**
   * Checks if a child is our direct decentant.
   * @param {goog.ui.Component} component The child to test.
   * @return {boolean} True if the child is a direct decentant.
   */
  _.isChild = function(component) {
    return (this.indexOfChild(component) != -1);
  };

  /**
   * Sets the focused child.
   * @param {goog.ui.Component} component The child to set as current focus
   *   bearer.
   */
  _.setFocusedChild = function(component) {
    if (this.isChild(component)) {
      this.focusedChild_ = component;
    }
  };

  /** @inheritDoc */
  _.decorateInternal = function(el) {
    goog.base(this, 'decorateInternal', el);
    if (goog.dom.dataset.has(this.getElement(), 'fm')) {
      this.focusFollowsMouse_ = true;
    }
  };

  /** @inheritDoc */
  _.handleMouseOver = function(e) {
    goog.base(this, 'handleMouseOver', e);
    if (this.isHighlighted() && this.focusFollowsMouse_) {
      this.focus();
    }
  };

  /** @inheritDoc */
  _.handleMouseOut = function(e) {
    goog.base(this, 'handleMouseOut', e);
    if (!this.isHighlighted() && this.focusFollowsMouse_) {
      this.blur();
    }
  };

  /**
   * Focusses the component.
   */
  _.focus = function() {
    smstb.tv.bus.publish(smstb.tv.Topic.FOCUSED, this);
    this.setFocused(true);
  };

  /**
   * Blurs the component.
   */
  _.blur = function() {
    this.setFocused(false);
  };

  /**
   * Handles the remote key (abstracted).
   * @param {number} key The key identifier.
   */
  _.handleKey = function(key) {
    this.dispatchEvent(new smstb.tv.Component.Event(this, key));
  };

});

/**
 * The custom event. Do we really need this?
 * @constructor
 * @extends {goog.events.Event}
 * @param {smstb.tv.Component} target The source of the action.
 * @param {number} key The number of the key. Use the map to determine.
 */
smstb.tv.Component.Event = function(target, key) {
  goog.base(this, smstb.tv.Component.EventType.ACTION, target);
  this.key = key;
};
goog.inherits(smstb.tv.Component.Event, goog.events.Event);

/**
 * @enum {string}
 */
smstb.tv.Component.EventType = {
  ACTION: goog.events.getUniqueId('action')
};
