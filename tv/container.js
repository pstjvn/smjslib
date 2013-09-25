goog.provide('smstb.tv.Container');
goog.provide('smstb.tv.ContainerRenderer');

goog.require('smstb.Remote.Keys');
goog.require('smstb.tv.Component');
goog.require('smstb.tv.Component.EventType');
goog.require('smstb.tv.ComponentRenderer');
goog.require('smstb.tv.decorator');

/**
 * @fileoverview Provides the container and default container renderer for the
 *   TV component system.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides the css-es for the default container in tv widgets.
 * @constructor
 * @extends {smstb.tv.ComponentRenderer}
 */
smstb.tv.ContainerRenderer = function() {
  goog.base(this);
};
goog.inherits(smstb.tv.ContainerRenderer, smstb.tv.ComponentRenderer);
goog.addSingletonGetter(smstb.tv.ContainerRenderer);

/**
 * The css identifying class for this component.
 * @type {string}
 * @const
 */
smstb.tv.ContainerRenderer.CSS_CLASS = goog.getCssName('tvcont');

/**
 * The known data keys that we want to derive from the HTML.
 * @enum {string}
 */
smstb.tv.ContainerRenderer.Key = {
  FOLLOW_MOUSE: 'fm',
  ORIENTATION: 'o10n',
  REWIND: 'rw'
};

goog.scope(function() {
  var _ = smstb.tv.ContainerRenderer.prototype;
    /** @inheritDoc */
  _.getCssClass = function() {
    return smstb.tv.ContainerRenderer.CSS_CLASS;
  };

  /** @inheritDoc */
  _.decorate = function(component, element) {

    var el = goog.base(this, 'decorate', component, element);

    if (goog.dom.dataset.get(element,
      smstb.tv.ContainerRenderer.Key.REWIND) == 'true') {

      component.setCanRewind(true);
    }

    if (goog.dom.dataset.get(element,
      smstb.tv.ContainerRenderer.Key.ORIENTATION) == 'h') {

      component.setOrientationHorizontal(true);
    }

    return el;
  };
});

/**
 * The main container class.
 * @constructor
 * @extends {smstb.tv.Component}
 * @param {pstj.ui.ControlRenderer=} opt_r Optional renderer.
 */
smstb.tv.Container = function(opt_r) {
  goog.base(this, opt_r || smstb.tv.ContainerRenderer.getInstance());

  /**
   * Flag: if the container will skip to the other end of the list of
   *   sub-components when one end is reached.
   * @type {boolean}
   * @private
   */
  this.canRewind_ = false;

  /**
   * Flag: if the conttainer should react to horizontal navigation, by default
   *   the navigation is vertical.
   * @type {boolean}
   * @private
   */
  this.horizontal_ = false;

  // Continers should not react to the mouse events.
  this.setHandleMouseEvents(false);
};
goog.inherits(smstb.tv.Container, smstb.tv.Component);

smstb.tv.decorator.register(
  smstb.tv.ContainerRenderer.getInstance().getCssClass(), smstb.tv.Container);

goog.scope(function() {

  var _ = smstb.tv.Container.prototype;

  /**
   * Handles the specific action events (key related) from children. Notice
   *   that those are NOT the component action events, but specific events
   *   designed to be emited from the focused component to notify for remote
   *   control activity.
   * @param {goog.events.Event} e The TV ACTION event.
   * @protected
   */
  _.handleActionEvent = function(e) {

    if (!this.hasChildren()) return;

    var index = -1;

    if (this.horizontal_) {
      // console.log('We are horizontal');
      // console.log(this.getChildCount());
      if (e.key == smstb.Remote.Keys.LEFT) {
        index = this.getPreviousChildIndex_();
      } else if (e.key == smstb.Remote.Keys.RIGHT) {
        index = this.getNextChildIndex_();
      }

    } else {
      if (e.key == smstb.Remote.Keys.UP) {
        index = this.getPreviousChildIndex_();
      } else if (e.key == smstb.Remote.Keys.DOWN) {
        index = this.getNextChildIndex_();
      }
    }

    if (index != -1) {
      // console.log('Inedx found!', index);
      this.selectChildByIndex(index);
      e.stopPropagation();
    }
  };

  /**
   * Using an index attempts to find a matching child. If one is found it is
   *   appointed to be the foccused one using the 'focus' method. Notice that
   *   this will set the focus state of the component and will publish the
   *   update on the focus pubsub link.
   * @param {number} index The index to look up.
   * @protected
   */
  _.selectChildByIndex = function(index) {
    if (index != -1 && index >= 0 && index < this.getChildCount()) {
      this.selectChild(goog.asserts.assertInstanceof(this.getChildAt(index),
        smstb.tv.Component,
        'Only tv component derivates can be used inside of a container'));
    }
  };

  /**
   * Calls the focus method on the child. Note that the child should notify
   *   its parent for the received focus so here we simply call the method.
   * @param {smstb.tv.Component} child The child to focus.
   */
  _.selectChild = function(child) {
    goog.asserts.assertInstanceof(child, smstb.tv.Component,
      'The child should be a component to understand the focus method');
    child.focus();
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, smstb.tv.Component.EventType.ACTION,
      this.handleActionEvent);
  };

  /** @inheritDoc */
  _.focus = function() {
    if (!goog.isDefAndNotNull(this.focusedChild_) ||
      !this.focusedChild_.isEnabled()) {
      this.focusedChild_ = null;
      var ccount = this.getChildCount();
      var child;
      for (var i = 0; i < ccount; i++) {
        child = this.getChildAt(i);
        if (child.isEnabled()) {
          this.focusedChild_ = child;
          child.focus();
          break;
        }
      }
    } else {
      this.focusedChild_.focus();
    }
  };

  /**
   * Attempts to find the previous child that can be focussed in the container.
   * @return {number}
   * @private
   */
  _.getPreviousChildIndex_ = function() {
    var count = this.getChildCount();
    if (count < 2 || !goog.isDefAndNotNull(this.focusedChild_)) {
      return -1;
    }

    var cindex = this.indexOfChild(this.focusedChild_);
    var child;
    for (var i = cindex - 1; i != cindex; i--) {
      if (i < 0) {
        if (this.canRewind_) i = count - 1;
        else return -1;
      }
      child = this.getChildAt(i);
      if (child.isEnabled()) {
        return i;
      }
    }
    return -1;
  };

  /**
   * Attempts to find the next child that can be focussed in the container.
   * @return {number}
   * @private
   */
  _.getNextChildIndex_ = function() {
    var child;
    var count = this.getChildCount();

    if (count < 2 || !goog.isDefAndNotNull(this.focusedChild_)) {
      return -1;
    }
    var cindex = this.indexOfChild(this.focusedChild_);
    for (var i = cindex + 1; i != cindex; i++) {
      if (i >= count) {
        if (this.canRewind_) i = 0;
        else return -1;
      }
      child = this.getChildAt(i);
      if (child.isEnabled()) {
        return i;
      }
    }
    return -1;
  };

  /**
   * Sets the orientation. The value of the horizontal orientation is used, as
   *   by default the container is vertically oriented (i.e. up/down). Setting
   *   thi to true will make the container be horizontally oriented and will
   *   respond to left/right.
   * @param {boolean} horizontal True to set the container to be horizontal.
   */
  _.setOrientationHorizontal = function(horizontal) {
    this.horizontal_ = horizontal;
  };

  /**
   * Sets the rewind capability of the container. By default containers are
   *   restricted by the edges and when and edge child is focused further
   *   commands to navigate on the edge direction are ignored. If this is set
   *   to true the container will focus the item on the other edge.
   * @param {boolean} rewind True to enable rewinding in the container.
   */
  _.setCanRewind = function(rewind) {
    this.canRewind_ = rewind;
  };

});
