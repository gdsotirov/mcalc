/* Mortgage calculator
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * $Id: mcc.js,v 1.3 2005/12/05 21:37:04 gsotirov Exp $
 */

/* Function   : calc_period_payment
 * Description: Calculate period payment for annuity mortgages
 * Parameters : interest - the yearly interest for the credit
 *              amount   - the amount for the credit
 *              periods  - the periods for the credit
 */
function calc_period_payment(interest, amount, periods) {
  var period_interest = interest / 100 / 12;
  return (period_interest * amount) / (1 - Math.pow(1 + period_interest, -periods));
}

/* Function   : calc_total_amount
 * Description: Calculate total amount that can be given
 * Parameters : interest - the yearly interest for the credit
 *              payment  - the period payment
 *              periods  - the periods for the credit
 */
function calc_total_amount(interest, payment, periods) {
  var period_interest = interest / 100 / 12;
  return (payment * (1 - Math.pow(1 + period_interest, -periods))) / period_interest;
}

/* Function   : calc_total_return_amount
 * Description: Calculate total return amount from the monthly payment.
 * Parameters : monthly - monthly payment
 *              periods - periods
 */
function calc_total_return_amount(monthly, periods) {
  return periods * monthly;
}
