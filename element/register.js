goog.provide('sm.element.Register');
goog.provide('sm.element.RegisterRenderer');

goog.require('goog.events.EventType');
goog.require('goog.ui.registry');
/** @suppress {extraRequire} */
goog.require('pstj.element.ErrorMsg');
goog.require('pstj.element.Form');
goog.require('pstj.element.FormRenderer');
/** @suppress {extraRequire} */
goog.require('pstj.material.Button');
/** @suppress {extraRequire} */
goog.require('pstj.material.Input');
/** @suppress {extraRequire} */
goog.require('pstj.material.Shadow');
goog.require('sm.template');


/** @extends {pstj.element.Form} */
sm.element.Register = goog.defineClass(pstj.element.Form, {
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

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this.querySelector('[name="country"]'),
                             goog.events.EventType.CHANGE,
                             this.handleCountryChangeEvent);
  },

  /**
   * Handles the change of country - if country is not US the state should be
   * none.
   * @param {goog.events.Event} e Wraps the change event of the select element.
   * @protected
   */
  handleCountryChangeEvent: function(e) {
    var select = /** @type {HTMLSelectElement} */ (e.target);
    var value = select.value;
    if (value != 'Unated States') {
      var s = /** @type {HTMLSelectElement} */ (
          this.querySelector('[name="state"]'));
      s.value = /** @type {HTMLOptionElement} */ (s.options.item(0)).value;
    }
  },

  /** @override */
  isValid: function() {
    var valid = true;
    this.forEachChild(function(child) {
      if (valid) {
        if (child instanceof pstj.material.InputBase) {
          valid = child.isValid();
        }
      }
    });
    return valid;
  },

  /**
   * Expose the form as a model.
   * @param  {?pstj.ds.DtoBase=} opt_model
   */
  updateModel: function(opt_model) { this.updateModelFromElements(opt_model); }
});


/** @extends {pstj.element.FormRenderer} */
sm.element.RegisterRenderer = goog.defineClass(pstj.element.FormRenderer, {
  constructor: function() { pstj.element.FormRenderer.call(this); },

  /** @override */
  generateTemplateData: function(instance) { return {registration: true}; },

  /** @override */
  getCssClass: function() { return sm.element.RegisterRenderer.CSS_CLASS; },

  /** @override */
  getTemplate: function(model) { return sm.template.Register(model); },

  /** @override */
  getErrorMsgElement: function(ctrl) {
    return this.getErrorMsgByIndex(ctrl, ctrl.getChildCount() - 3);
  },

  /** @override */
  getSubmitButtonElement: function(ctrl) {
    return this.getButtonByIndex(ctrl, ctrl.getChildCount() - 2);
  },

  statics: {
    /** @const {string} */
    CSS_CLASS: goog.getCssName('sm-register')
  }
});
goog.addSingletonGetter(sm.element.RegisterRenderer);


// Register for default renderer.
goog.ui.registry.setDefaultRenderer(sm.element.Register,
                                    sm.element.RegisterRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    sm.element.RegisterRenderer.CSS_CLASS,
    function() { return new sm.element.Register(); });
