/* Mortgage calculator
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * Version: 0.1.0
 * $Id: mcc.js,v 1.2 2005/04/20 18:55:29 gsotirov Exp $
 */

/* Function   : calc_monthly_payment
 * Description: Calculate monthly payment for the mortgage credit.
 * Parameters : interest - the yearly interest for the credit
 *              amount   - the amount for the credit
 *              period   - the period for the credit
 */
function calc_monthly_payment(interest, amount, periodY, periodM) {
  var mi = interest / 100 / 12;
  var months = periodY * 12 + periodM;
  var a1 = Math.pow(mi + 1, months);
  var a2 = 1 / a1;
  var a3 = 1 - a2;
  var a4 = a3 / mi;
  var p = amount / a4;
  return p;
}

/* Function   : calc_total_return_amount
 * Description: Calculate total return amount for the period of the credit.
 * Parameters : monthly - monthly payment
 *              periodY - period in years
 *              periodM - period in months
 */
function calc_total_return_amount(monthly, periodY, periodM) {
  var total_months = periodY * 12 + periodM;
  var ret_amount = total_months * monthly;
  return ret_amount;
}
