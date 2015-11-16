/**
 * @fileoverview Login form designed to work with simple username/password
 * login. It is backend and controller independent. The form also includes
 * option to remember the login credentials.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('sm.element.Login');
goog.provide('sm.element.LoginRenderer');

goog.require('goog.log');
goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('pstj.element.ErrorMsg');
goog.require('pstj.element.Form');
goog.require('pstj.element.FormRenderer');
goog.require('pstj.material.Button');
goog.require('pstj.material.Checkbox');
goog.require('pstj.material.Input');
goog.require('pstj.material.Shadow');
goog.require('sm.template');


/**
 * The default login component / element for SysMaster.
 * @extends {pstj.element.Form}
 */
sm.element.Login = goog.defineClass(pstj.element.Form, {
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
  logger: goog.log.getLogger('sm.element.Login'),

  /**
   * Checks if the element (form) is currently valid.
   * @return {boolean}
   */
  isValid: function() {
    return this.getRenderer().getUsernameElement(this).isValid() &&
        this.getRenderer().getPasswordElement(this).isValid();
  },

  /**
   * @override
   * @return {!sm.element.LoginRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        sm.element.LoginRenderer);
  },

  /**
   * Getter for the username.
   * @return {string}
   */
  getUsername: function() {
    return this.getRenderer().getUsernameElement(this).getValue();
  },

  /**
   * Getter for the password.
   * @return {string}
   */
  getPassword: function() {
    return this.getRenderer().getPasswordElement(this).getValue();
  },

  /**
   * If user elected that we should keep the user credentials after successful
   * log-in.
   * @return {boolean}
   */
  shouldKeepCredentials: function() {
    return this.getRenderer().getKeepCredentialsElement(this).isChecked();
  },

  /**
   * Set the visbility of the recovery link in the form.
   * @param {boolean} enable
   */
  showRecoveryLink: function(enable) {
    this.getRenderer().showRecoveryLink(this, enable);
  }
});


/** @extends {pstj.element.FormRenderer} */
sm.element.LoginRenderer = goog.defineClass(pstj.element.FormRenderer, {
  constructor: function() {
    pstj.element.FormRenderer.call(this);
  },

  /**
   * Show recovery link on the form.
   * @param {sm.element.Login} ctrl
   * @param {boolean} enable
   */
  showRecoveryLink: function(ctrl, enable) {
    goog.style.setElementShown(ctrl.getElementByClass(goog.getCssName(
        'pstj-linklike')), enable);
  },

  /**
   * @param {pstj.element.Form} ctrl
   * @return {!pstj.material.InputBase}
   */
  getUsernameElement: function(ctrl) {
    return this.getInputByIndex(ctrl, 1);
  },

  /**
   * @param {pstj.element.Form} ctrl
   * @return {!pstj.material.InputBase}
   */
  getPasswordElement: function(ctrl) {
    return this.getInputByIndex(ctrl, 2);
  },

  /** @override */
  getErrorMsgElement: function(ctrl) {
    return this.getErrorMsgByIndex(ctrl, 0);
  },

  /** @override */
  getSubmitButtonElement: function(ctrl) {
    return this.getButtonByIndex(ctrl, 4);
  },

  /**
   * @param {pstj.element.Form} ctrl
   * @return {!pstj.material.Checkbox}
   */
  getKeepCredentialsElement: function(ctrl) {
    return this.getCheckboxByIndex(ctrl, 3);
  },

  /** @override */
  getCssClass: function() {
    return sm.element.LoginRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return sm.template.Login(model);
  },

  statics: {
    /** @const {string} */
    CSS_CLASS: goog.getCssName('sm-login')
  }
});
goog.addSingletonGetter(sm.element.LoginRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(sm.element.Login,
    sm.element.LoginRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    sm.element.LoginRenderer.CSS_CLASS, function() {
      return new sm.element.Login(null);
    });
