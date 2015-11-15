goog.provide('sm.element.Recover');
goog.provide('sm.element.RecoverRenderer');

goog.require('goog.log');
goog.require('goog.ui.registry');
goog.require('pstj.element.ErrorMsg');
goog.require('pstj.element.Form');
goog.require('pstj.element.FormRenderer');
goog.require('pstj.material.Button');
goog.require('pstj.material.Input');
goog.require('pstj.material.Shadow');
goog.require('sm.template');


/**
 * The default login component / element for SysMaster.
 * @extends {pstj.element.Form}
 */
sm.element.Recover = goog.defineClass(pstj.element.Form, {
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
    this.setUsePointerAgent(true);
  },

  /**
   * @type {goog.debug.Logger}
   * @protected
   */
  logger: goog.log.getLogger('sm.element.Recover'),

  /**
   * Checks if the element (form) is currently valid.
   * @return {boolean}
   */
  isValid: function() {
    return this.getRenderer().getEmailElement(this).isValid();
  },

  /**
   * Retrieves the email entered by the user.
   * @return {string}
   */
  getEmail: function() {
    return this.getRenderer().getEmailElement(this).getValue();
  },

  /**
   * @override
   * @return {!sm.element.RecoverRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        sm.element.RecoverRenderer);
  }
});


/** @extends {pstj.element.FormRenderer} */
sm.element.RecoverRenderer = goog.defineClass(pstj.element.FormRenderer, {
  constructor: function() {
    pstj.element.FormRenderer.call(this);
  },

  /**
   * @param {pstj.element.Form} ctrl
   * @return {!pstj.material.InputBase}
   */
  getEmailElement: function(ctrl) {
    return this.getInputByIndex(ctrl, 1);
  },

  /** @override */
  getErrorMsgElement: function(ctrl) {
    return this.getErrorMsgByIndex(ctrl, 0);
  },

  /** @override */
  getSubmitButtonElement: function(ctrl) {
    return this.getButtonByIndex(ctrl, 2);
  },

  /** @override */
  getCssClass: function() {
    return sm.element.RecoverRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return sm.template.Recover(model);
  },

  statics: {
    /** @const {string} */
    CSS_CLASS: goog.getCssName('sm-recover')
  }
});
goog.addSingletonGetter(sm.element.RecoverRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(sm.element.Recover,
    sm.element.RecoverRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    sm.element.RecoverRenderer.CSS_CLASS, function() {
      return new sm.element.Recover(null);
    });
