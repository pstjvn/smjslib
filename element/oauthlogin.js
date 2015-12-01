goog.provide('sm.element.OAuthLogin');
goog.provide('sm.element.OAuthLoginRenderer');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('pstj.app.Facebook');
goog.require('pstj.app.Google');
goog.require('pstj.control.Control');
goog.require('pstj.ds.oauth');
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
    /**
     * We need a control instance to be able to publish on the app bus when
     * we have an authenticated user.
     *
     * @private
     * @type {pstj.control.Control}
     */
    this.controller_ = new pstj.control.Control(this);
    this.setAllowTextSelection(false);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    // When the FB SDK is ready - enable the facebook button.
    pstj.app.Facebook.getInstance().getReadyPromise().then(function() {
      this.getRenderer().getFacebookButton(this).setEnabled(true);
    }, null, this);
    pstj.app.Google.getInstance().getReadyPromise().then(function() {
      this.getRenderer().getGoogleButton(this).setEnabled(true);
    }, null, this);
    // Get the initial user promise and if it resolves tell the all that we
    // have a valid user.
    goog.Promise.firstFulfilled([
      pstj.app.Facebook.getInstance().getUserPromise(),
      pstj.app.Google.getInstance().getUserPromise()
    ]).then(function(user) {
      this.onHavingUser(user);
    }, null, this);
    // Listen for action events from enabled social buttons.
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleActionButton);
  },

  /**
   * Handle button presses.
   * @param {goog.events.Event} e
   * @protected
   */
  handleActionButton: function(e) {
    e.stopPropagation();
    var action = goog.asserts.assertInstanceof(e.target, pstj.material.Button)
        .getAction();
    if (action == 'facebook-oauth') {
      pstj.app.Facebook.getInstance().login().then(this.onHavingUser, null,
          this);
    }
    if (action == 'google-oauth') {
      pstj.app.Google.getInstance().login().then(this.onHavingUser, null, this);
    }
  },

  /**
   * User has been received.
   * @param {!pstj.ds.oauth.User} user
   * @protected
   */
  onHavingUser: function(user) {
    this.controller_.push(pstj.ds.oauth.Topic, user);
  },

  /**
   * @override
   * @return {!sm.element.OAuthLoginRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        sm.element.OAuthLoginRenderer);
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

  /**
   * @param {sm.element.OAuthLogin} inst
   * @return {!pstj.material.Button}
   */
  getFacebookButton: function(inst) {
    return goog.asserts.assertInstanceof(inst.getChildAt(1),
        pstj.material.Button);
  },

  /**
   * @param {sm.element.OAuthLogin} inst
   * @return {!pstj.material.Button}
   */
  getGoogleButton: function(inst) {
    return goog.asserts.assertInstanceof(inst.getChildAt(0),
        pstj.material.Button);
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
