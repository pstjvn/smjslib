'use strict';

goog.provide('sm.element.Profile');
goog.provide('sm.element.ProfileRenderer');

goog.require('goog.ui.registry');
goog.require('sm.element.Register');
goog.require('sm.element.RegisterRenderer');
goog.require('sm.template');


/** @extends {sm.element.Register} */
sm.element.Profile = class extends sm.element.Register {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor(opt_content, opt_renderer, opt_domHelper) {
    super(opt_content, opt_renderer, opt_domHelper);
  }

};


/** @extends {sm.element.RegisterRenderer} */
sm.element.ProfileRenderer = class extends sm.element.RegisterRenderer {
  constructor() {
    super();
  }

  /** @override */
  getCssClass() {
    return sm.element.ProfileRenderer.CSS_CLASS;
  }

  /** @override */
  getTemplate() {
    return sm.template.Register({
      registration: false
    });
  }
};


/** @const {string} */
sm.element.ProfileRenderer.CSS_CLASS = goog.getCssName('sm-profile');


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(sm.element.Profile,
    sm.element.ProfileRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    sm.element.ProfileRenderer.CSS_CLASS, function() {
      return new sm.element.Profile();
    });
