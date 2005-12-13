/* Mortgage calculator
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * $Id: mcc.js,v 1.6 2005/12/13 06:55:37 gsotirov Exp $
 */

/* Function   : calc_period_payment
 * Description: Calculate period payment for annuity mortgages
 * Parameters : interest - the yearly interest for the credit
 *              amount   - the amount for the credit
 *              periods  - the periods for the credit
 */
function calc_period_payment(interest, amount, periods) {
  var peyment = 0.0;
  if ( interest > 0.0 ) {
    var period_interest = interest / 100 / 12;
    payment = (period_interest * amount) / (1 - Math.pow(1 + period_interest, -periods));
  }
  else
    payment = amount / periods;

  return payment;
}

/* Function   : calc_total_amount
 * Description: Calculate total amount that can be given
 * Parameters : interest - the yearly interest for the credit
 *              payment  - the period payment
 *              periods  - the periods for the credit
 */
function calc_total_amount(interest, payment, periods) {
  var amount = 0.0;
  if ( interest > 0.0 ) {
    var period_interest = interest / 100 / 12;
    amount = (payment * (1 - Math.pow(1 + period_interest, -periods))) / period_interest;
  }
  else
    amount = payment * periods;

  return amount;
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
    var cap = period_interest * balance;
    var new_balance = balance + cap - payment;
    Rows[i] = new Array(i+1, balance, cap, (payment - cap), payment, new_balance);
    balance = new_balance;
  }

  return Rows;
}
