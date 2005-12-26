/* Mortgage calculator
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * $Id: mcc.js,v 1.5.2.4 2005/12/26 16:28:56 gsotirov Exp $
 */

/* Function   : calc_period_payment
 * Description: Calculate period payment for annuity mortgages
 * Parameters : interests - array of nominal yearly interests for the credit terms
 *              amount    - the amount of the credit
 *              periods   - total periods count
 */
function calc_period_payment(interests, amount, periods) {
  var payments = new Array();
  for ( var i = 0; i < interests.length; ++i ) {
    var interest = interests[i][0];
    var term_periods = interests[i][1];
    var term_amount = (term_periods / periods) * amount;
    if ( interest > 0.0 ) {
      var term_interest = interest / 100 / 12;
      var term_payment = round((term_interest * term_amount) / (1 - Math.pow(1 + term_interest, -term_periods)), 2);
      payments[i] = new Array(term_payment, term_periods);
    }
    else {
      var term_payment = round(amount / periods, 2);
      payments[i] = new Array(term_payment, term_periods);
    }
  }

  return payments;
}

/* Function   : calc_total_amount
 * Description: Calculate total amount that can be given
 * Parameters : interests - array of nominal yearly interests for the credit terms
 *              payments  - array of term payments
 *              periods   - total periods count
 * TODO: This calculation is not correct always. It should be revised.
 */
function calc_total_amount(interests, payments, periods) {
  var amount = 0.0;
  for ( var i = 0; i < payments.length; ++i ) {
    var interest = interests[i][0];
    if ( interest > 0.0 ) {
      var term_interest = interest / 100 / 12;
      var term_periods = interests[i][1];
      var term_payment = payments[i][0];
      amount += (term_payment * (1 - Math.pow(1 + term_interest, -term_periods))) / term_interest;
    }
    else {
      var term_periods = interests[i][1];
      amount += payment * periods;
    }
  }

  return amount;
}

/* Function   : calc_total_payments
 * Description: Calculate total payments from the period payments
 * Parameters : payments - array with term payments
 */
function calc_total_payments(payments) {
  var sum = 0;
  for ( var i = 0; i < payments.length; ++i) {
    sum += payments[i][0] * payments[i][1];
  }

  return sum;
}

/* Function   : build_schedule
 * Description: Build mortgage amortization schedule
 * Parameters : amount    - the amount of the credit
 *              payments  - period payment for the mortgage
 *              interests - mortgage interest in percents
 *              periods - the periods count
 */
function build_schedule(amount, payments, interests, periods) {
  var balance = amount;
  var Rows = new Array();

  var term_index = 0;
  var term_max = interests[term_index][1];
  for ( var i = 0; i < periods; ++i ) {
    var term_interest = interests[term_index][0] / 100 / 12;
    var term_payment = payments[term_index][0];
    var cap = round(term_interest * balance, 2); /* capitalization */
    balance = balance + cap - term_payment;
    var year = parseInt(i / 12) + 1;
    var month = i % 12 + 1;
    Rows[i] = new Array(year, month, cap, (term_payment - cap), term_payment, balance);
    if ( term_max == i + 1 && i + 1 != periods )
      term_max += interests[++term_index][1];
  }

  return Rows;
}

function round(number, places) {
  return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
}
