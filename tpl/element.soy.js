// This file was automatically generated from element.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace sm.template.
 * @public
 */

goog.provide('sm.template');

goog.require('soy');
goog.require('soydata');
goog.require('pstj.material.template');
goog.require('pstj.templates');


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {!soydata.SanitizedHtml}
 * @suppress {checkTypes}
 */
sm.template.Login = function(opt_data, opt_ignored, opt_ijData) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtml('<div is class="' + goog.getCssName('sm-login') + '" use-pointer><div>' + soy.$$escapeHtml(pstj.templates.ErrorMsg(null, null, opt_ijData)) + '</div><div class="' + goog.getCssName('pstj-linklike') + '" style="display: none;" data-request="recovery">Forgot your password?</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Username is required'), label: soydata.$$markUnsanitizedTextForInternalBlocks('Username'), required: true, name: 'username', type: 'text', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Input({error: soydata.$$markUnsanitizedTextForInternalBlocks('Password is required'), label: soydata.$$markUnsanitizedTextForInternalBlocks('Password'), required: true, name: 'password', type: 'password', value: ''}, null, opt_ijData)) + '</div><div>' + soy.$$escapeHtml(pstj.material.template.Checkbox({content: soydata.$$markUnsanitizedTextForInternalBlocks('remember me')}, null, opt_ijData)) + '</div><div class="' + goog.getCssName('sm-login-help') + '">Stay logged in</div><div class="' + goog.getCssName('sm-login-button-container') + '">' + soy.$$escapeHtml(pstj.material.template.Button({content: soydata.$$markUnsanitizedTextForInternalBlocks('login'), icon: 'none', ink: true}, null, opt_ijData)) + '</div><div><span class="' + goog.getCssName('pstj-linklike') + '" data-request="register">Or register a new account</span></div><div is class="' + goog.getCssName('material-shadow') + ' ' + goog.getCssName('material-shadow-2') + '"><div class="' + goog.getCssName('material-shadow-bottom') + '"></div><div class="' + goog.getCssName('material-shadow-top') + '"></div></div></div>');
};
if (goog.DEBUG) {
  sm.template.Login.soyTemplateName = 'sm.template.Login';
}
