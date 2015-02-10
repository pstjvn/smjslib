goog.provide('smstb.widget.LoginForm');

goog.require('goog.events.EventType');
goog.require('goog.storage.mechanism.mechanismfactory');
goog.require('goog.ui.registry');
goog.require('mobiletv.Notification');
goog.require('pstj.configure');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('smstb.template');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;


/**
 * Provides the login form widget for embedding in cordova.
 */
smstb.widget.LoginForm = goog.defineClass(E, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   * @constructor
   * @extends {E}
   * @struct
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    E.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The notification widget to use.
     * @type {mobiletv.Notification}
     * @private
     */
    this.notification_ = new mobiletv.Notification();
    /**
     * Our storage for pin/domain/type.
     * @type {goog.storage.mechanism.Mechanism}
     * @protected
     */
    this.storage = goog.storage.mechanism.mechanismfactory.create('mtvlogin');
    if (goog.isNull(this.storage)) {
      this.handleError('No storage available');
      throw new Error('Cannot work without storage capabilities');
    }
    /**
     * The pin to use to login.
     * @type {string}
     */
    this.pin = this.storage.get(smstb.widget.LoginForm.Name.PIN) || '';
    /**
     * Callback function to execute when the authorization is complete.
     * @type {Function}
     */
    this.callback = null;
    /**
     * Flag: if on successful login we should store the pin for subsequent
     * automatic login attempts.
     * @type {boolean}
     * @private
     */
    this.rememberMe_ = false;
  },


  /** @inheritDoc */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.callback = null;
    goog.dispose(this.storage);
    goog.dispose(this.notification_);
    this.storage = null;
    this.notification_ = null;
  },


  /**
   * Display errors.
   * @param {string} err
   */
  handleError: function(err) {
    this.showForm();
    this.setNotifictation(err);
  },


  /** @inheritDoc */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.notification_.decorate(
        goog.dom.getElementByClass(goog.getCssName('notifications'),
            this.getElement()));
  },


  /**
   * Sets the notification message for the login table view.
   * @param {string} notice The notification to show (HTML).
   * @protected
   */
  setNotifictation: function(notice) {
    this.notification_.setModel(notice);
  },


  /**
   * Start auth process.
   * @param {Function} callback Will be called on completion.
   */
  authorize: function(callback) {
    this.callback = callback;
    if (!this.hasCredentials()) {
      this.showForm();
    } else {
      this.makeAuthRequest();
    }
  },


  /**
   * Start an auth request.
   * @protected
   */
  makeAuthRequest: function() {
    var uri = new goog.Uri(pstj.configure.getRuntimeValue(
        'LOGIN_URL', '/cgi-bin/if.cgi?run=mtvlog', 'SYSMASTER.APPS.MOBILETV'));
    uri.setParameterValues('pin', this.pin);

    if (goog.DEBUG) alert(uri.toString());

    var jsonp = new goog.net.Jsonp(uri);
    jsonp.setRequestTimeout(2000);
    jsonp.send(null,
        goog.bind(this.onSuccess, this),
        goog.bind(this.onError, this));
  },


  /**
   * On successfull auth response.
   * @param {Object<string, string>} data
   * @protected
   */
  onSuccess: function(data) {
    if (data && data['status'] && data['status'] == 'OK') {
      if (this.rememberMe_) {
        this.storage.set(smstb.widget.LoginForm.Name.PIN, this.pin);
      }
      // this.storage.set(smstb.widget.LoginForm.Name.DOMAIN, this.domain);
      this.hideForm();
      this.callback();
    } else {
      if (data && data['msg']) {
        this.handleError(data['msg']);
      } else {
        this.handleError('Cannot authorize with this server' +
            '. Make sure the domain/ip and pin are correct.');
      }
    }
  },


  /**
   * Handle error authentication request to server.
   * @protected
   */
  onError: function() {
    this.handleError('Cannot connect to destination server' +
        '. Make sure you have entered it correctly and try again');
  },


  /**
   * Check if the user want to be remembered for next logins.
   * @private
   */
  checkRememberMe_: function() {
    this.rememberMe_ = this.getRenderer().isRememberMeSet(this.getElement());
  },


  /**
   * Shows the decumentation form.
   * @protected
   */
  showForm: function() {
    if (this.isInDocument()) return;
    goog.dom.removeNode(document.querySelector('.loader'));
    if (!this.getElement()) {
      this.render();
    } else {
      this.enterDocument();
    }
  },


  /** @protected */
  hideForm: function() {
    if (this.isInDocument()) {
      this.exitDocument();
    }
  },


  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.updateForm();
    this.getHandler().listen(
        this.getRenderer().getSubmitElement(this),
        goog.events.EventType.CLICK, this.handleFormSubmit);
  },


  /**
   * Handles the sumition of the form for login in.
   * @protected
   */
  handleFormSubmit: function() {
    this.pin = this.getRenderer().getPin(this);
    if (this.hasCredentials()) {
      this.checkRememberMe_();
      this.makeAuthRequest();
    } else {
      this.handleError('Pin missing');
    }
  },


  /**
   * @override
   * @return {smstb.widget.LoginFormRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        smstb.widget.LoginFormRenderer);
  },


  /**
   * Write the values to the UI.
   * @protected
   */
  updateForm: function() {
    this.getRenderer().setPin(this);
  },


  /**
   * Check if we have enough credentials to perform login.
   * @return {boolean}
   */
  hasCredentials: function() {
    return (this.pin != '');
  },


  statics: {
    /**
     * @enum {string}
     */
    Name: {
      PIN: 'pin',
      DOMAIN: 'domain'
    }
  }

});


/**
 * Priovides the renderer for the login form.
 */
smstb.widget.LoginFormRenderer = goog.defineClass(ER, {
  /**
   * @constructor
   * @extends {ER}
   */
  constructor: function() {
    ER.call(this);
  },


  /**
   * Updates the PIN entry in the DOM.
   * @param {smstb.widget.LoginForm} c
   */
  setPin: function(c) {
    goog.asserts.assertInstanceof(c, smstb.widget.LoginForm);
    c.querySelector('[name="pin"]').value = c.pin;
  },


  /**
   * Retrieves the pin value from the dom.
   * @param {smstb.widget.LoginForm} c
   * @return {string}
   */
  getPin: function(c) {
    return c.querySelector('[name="pin"]').value;
  },


  /**
   * Retrieves the submit button.
   * @param {smstb.widget.LoginForm} c
   * @return {Element}
   */
  getSubmitElement: function(c) {
    return c.querySelector('[name="submit"]');
  },

  /**
   * Check if the 'remember me' checkbox is activated/ the user want to
   * preserve the login info for next iterations.
   * @param {Element} element The element containing the control.
   * @return {boolean}
   */
  isRememberMeSet: function(element) {
    // TODO: lookup the checkbox and check its value - once the template is
    // ready
    return true;
  },


  /** @inheritDoc */
  getTemplate: function(model) {
    return smstb.template.LoginForm(model);
  },


  /** @inheritDoc */
  generateTemplateData: function(control) {
    return {
      pin: control.pin
    };
  },


  /** @inheritDoc */
  getCssClass: function() {
    return smstb.widget.LoginFormRenderer.CSS_CLASS;
  },


  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('login-form')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(smstb.widget.LoginForm,
    smstb.widget.LoginFormRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    smstb.widget.LoginFormRenderer.CSS_CLASS, function() {
      return new smstb.widget.LoginForm(null);
    });

goog.addSingletonGetter(smstb.widget.LoginFormRenderer);

});  // goog.scope
