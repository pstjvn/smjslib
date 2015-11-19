goog.provide('sm.element.OAuthLogin');
goog.provide('sm.element.OAuthLoginRenderer');

goog.require('goog.ui.registry');
goog.require('pstj.element.Form');
goog.require('pstj.element.FormRenderer');
goog.require('pstj.material.Button');
goog.require('pstj.material.Shadow');
goog.require('sm.template');


/** @extends {pstj.element.Form} */
sm.element.OAuthLogin = goog.defineClass(pstj.element.Form, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.element.Form.call(this, opt_content, opt_renderer, opt_domHelper);
    this.setAllowTextSelection(false);
  }
});


/** @extends {pstj.element.FormRenderer} */
sm.element.OAuthLoginRenderer = goog.defineClass(pstj.element.FormRenderer, {
  constructor: function() {
    pstj.element.FormRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return sm.element.OAuthLoginRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return sm.template.OAuthLogin(model);
  },

  statics: {
    /** @const {string} */
    CSS_CLASS: goog.getCssName('sm-oauth-login')
  }
});
goog.addSingletonGetter(sm.element.LoginRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(sm.element.OAuthLogin,
    sm.element.OAuthLoginRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    sm.element.OAuthLoginRenderer.CSS_CLASS, function() {
      return new sm.element.OAuthLogin(null);
    });
