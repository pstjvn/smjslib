// This file was automatically generated from element.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace sm.template.
 * @public
 */

goog.provide('sm.template');

goog.require('soy');
goog.require('soydata');
/** @suppress {extraRequire} */
goog.require('goog.asserts');
goog.require('pstj.material.template');
goog.require('pstj.select');
goog.require('pstj.templates');


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
sm.template.Login = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('sm-login') + ' ' + goog.getCssName('sm-form') + '" use-pointer><div>' + soy.$$escapeHtml(pstj.templates.ErrorMsg({auto: true, delay: 30000}, null, opt_ijData)) + '</div><div class="' + goog.getCssName('pstj-linklike') + '" style="display: none;" data-activity-switch="recover">Forgot your password?</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Username is required'), label: soydata.$$markUnsanitizedTextForInternalBlocks('Username'), required: true, name: 'username', type: 'text', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Password is required'), label: soydata.$$markUnsanitizedTextForInternalBlocks('Password'), required: true, name: 'password', type: 'password', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Checkbox({content: soydata.$$markUnsanitizedTextForInternalBlocks('remember me')}, null, opt_ijData)) + '</div><div class="' + goog.getCssName('sm-form-help-info') + '">Stay logged in</div><div class="' + goog.getCssName('sm-form-button-container') + '">' + soy.$$escapeHtml(pstj.material.template.Button({content: soydata.$$markUnsanitizedTextForInternalBlocks('login'), icon: 'none', ink: true}, null, opt_ijData)) + '</div><div><span class="' + goog.getCssName('pstj-linklike') + '" data-activity-switch="register">Or register a new account</span></div><div is class="' + goog.getCssName('material-shadow') + ' ' + goog.getCssName('material-shadow-2') + '"><div class="' + goog.getCssName('material-shadow-bottom') + '"></div><div class="' + goog.getCssName('material-shadow-top') + '"></div></div></div>');
};
if (goog.DEBUG) {
  sm.template.Login.soyTemplateName = 'sm.template.Login';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
sm.template.OAuthLogin = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('sm-oauth-login') + ' ' + goog.getCssName('sm-form') + '"><div class="' + goog.getCssName('sm-oauth-login-info') + '">Log in using your social media account</div><div class="' + goog.getCssName('sm-form-button-row') + '">' + soy.$$escapeHtml(pstj.material.template.Button({content: soydata.$$markUnsanitizedTextForInternalBlocks('Google'), icon: 'google', ink: true, action: 'google-oauth', disabled: true}, null, opt_ijData)) + soy.$$escapeHtml(pstj.material.template.Button({content: soydata.$$markUnsanitizedTextForInternalBlocks('Facebook'), icon: 'facebook', ink: true, action: 'facebook-oauth', disabled: true}, null, opt_ijData)) + '</div><div is class="' + goog.getCssName('material-shadow') + ' ' + goog.getCssName('material-shadow-2') + '"><div class="' + goog.getCssName('material-shadow-bottom') + '"></div><div class="' + goog.getCssName('material-shadow-top') + '"></div></div></div>');
};
if (goog.DEBUG) {
  sm.template.OAuthLogin.soyTemplateName = 'sm.template.OAuthLogin';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
sm.template.Recover = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('sm-recover') + ' ' + goog.getCssName('sm-form') + '" use-pointer><div>' + soy.$$escapeHtml(pstj.templates.ErrorMsg(null, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Valid email is required'), label: soydata.$$markUnsanitizedTextForInternalBlocks('E-mail'), required: true, name: 'email', type: 'email', value: ''}, null, opt_ijData)) + '</div><div class="' + goog.getCssName('sm-form-button-container') + '">' + soy.$$escapeHtml(pstj.material.template.Button({content: soydata.$$markUnsanitizedTextForInternalBlocks('request password'), icon: 'none', ink: true}, null, opt_ijData)) + '</div><div><span class="' + goog.getCssName('pstj-linklike') + '" data-activity-switch="login">Go back to login</span></div><div is class="' + goog.getCssName('material-shadow') + ' ' + goog.getCssName('material-shadow-2') + '"><div class="' + goog.getCssName('material-shadow-bottom') + '"></div><div class="' + goog.getCssName('material-shadow-top') + '"></div></div></div>');
};
if (goog.DEBUG) {
  sm.template.Recover.soyTemplateName = 'sm.template.Recover';
}


/**
 * @param {{
 *    registration: boolean
 * }} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
sm.template.Register = function(opt_data, opt_ignored, opt_ijData) {
  soy.asserts.assertType(goog.isBoolean(opt_data.registration) || opt_data.registration === 1 || opt_data.registration === 0, 'registration', opt_data.registration, 'boolean');
  var registration = /** @type {boolean} */ (!!opt_data.registration);
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + ((registration != true) ? goog.getCssName('sm-profile') + ' ' : '') + goog.getCssName('sm-register') + ' ' + goog.getCssName('sm-form') + '" use-pointer>' + ((registration) ? '<div><span class="' + goog.getCssName('pstj-linklike') + '" data-activity-switch="login">Go back to login</span></div><div>' + soy.$$escapeHtml(pstj.material.template.Input({label: soydata.$$markUnsanitizedTextForInternalBlocks('Username'), error: soydata.$$markUnsanitizedTextForInternalBlocks('Username is required\' '), required: true, name: 'username', type: 'text', value: ''}, null, opt_ijData)) + '</div>' : '') + '<div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Minimum 6 symbols'), label: soydata.$$markUnsanitizedTextForInternalBlocks('Password'), pattern: '^.{6,50}$', name: 'password', type: 'password', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Minimum 6 symbols'), label: soydata.$$markUnsanitizedTextForInternalBlocks('Repeat password'), pattern: '^.{6,50}$', name: 'confirm_password', type: 'password', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Minimum 4, letters only'), label: soydata.$$markUnsanitizedTextForInternalBlocks('First name'), pattern: '^[A-Za-z ]{4,50}$', name: 'first_name', type: 'text', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Minimum 4, letters only'), label: soydata.$$markUnsanitizedTextForInternalBlocks('Last name'), pattern: '^[A-Za-z ]{4,50}$', name: 'last_name', type: 'text', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({label: soydata.$$markUnsanitizedTextForInternalBlocks('Company'), name: 'company', type: 'text', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Valid email is required'), label: soydata.$$markUnsanitizedTextForInternalBlocks('E-mail'), required: true, name: 'email', type: 'email', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Valid email only'), label: soydata.$$markUnsanitizedTextForInternalBlocks('PayPal E-mail'), name: 'paypal_email', type: 'email', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({label: soydata.$$markUnsanitizedTextForInternalBlocks('Address'), name: 'address', type: 'text', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({label: soydata.$$markUnsanitizedTextForInternalBlocks('City'), name: 'city', type: 'text', value: ''}, null, opt_ijData)) + '</div><div><label>State:</label><select name="state">' + soy.$$escapeHtml(pstj.select.USAStates(null, null, opt_ijData)) + '</select></div><div><label>Country:</label><select name="country">' + soy.$$escapeHtml(pstj.select.Countries(null, null, opt_ijData)) + '</select></div><div>' + soy.$$escapeHtml(pstj.templates.ErrorMsg(null, null, opt_ijData)) + '</div><div class="' + goog.getCssName('sm-form-button-container') + '">' + soy.$$escapeHtml(pstj.material.template.Button({content: soydata.$$markUnsanitizedTextForInternalBlocks('' + ((registration) ? 'Register' : 'Update')), icon: 'none', ink: true}, null, opt_ijData)) + '</div><div is class="' + goog.getCssName('material-shadow') + ' ' + goog.getCssName('material-shadow-2') + '"><div class="' + goog.getCssName('material-shadow-bottom') + '"></div><div class="' + goog.getCssName('material-shadow-top') + '"></div></div></div>');
};
if (goog.DEBUG) {
  sm.template.Register.soyTemplateName = 'sm.template.Register';
}
