goog.provide('smstb.widget.PaymentConfirmationTemplate');

goog.require('pstj.ui.Template');
goog.require('smstb.template');



/**
 * Provides the template abstraction for the payment confirmation UI used in
 * the mobile TV application.
 *
 * @constructor
 * @extends {pstj.ui.Template}
 */
smstb.widget.PaymentConfirmationTemplate = function() {
  goog.base(this);
};
goog.inherits(smstb.widget.PaymentConfirmationTemplate, pstj.ui.Template);
goog.addSingletonGetter(smstb.widget.PaymentConfirmationTemplate);


/** @inheritDoc */
smstb.widget.PaymentConfirmationTemplate.prototype.getTemplate = function(
    model) {
  return smstb.template.paymentConfirmation(model || {});
};
