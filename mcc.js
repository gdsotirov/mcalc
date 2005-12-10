/* Mortgage calculator
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * $Id: mcc.js,v 1.3.2.1 2005/12/10 17:51:08 gsotirov Exp $
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

/* Function   : calc_table
 * Description: Build mortgage table with payments and amounts
 * Parameters : amount - the amount of the credit
 *              payment - period payment for the mortgage
 *              interest - mortgage interest in percents
 *              periods - the periods count
 */
function calc_table(amount, payment, interest, periods) {
  var period_interest = interest / 100 / 12;
  var balance = amount;
  var Rows = new Array();

  for ( var i = 0; i < periods; ++i ) {
    var int = period_interest * balance;
    var new_balance = balance + int - payment;
    Rows[i] = new Array(i+1, balance, int, (payment - int), payment, new_balance);
    balance = new_balance;
  }

  return Rows;
}
