/* Mortgage Calculator
 * Copyright (C) 2004-2006  Georgi D. Sotirov
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * ---------------------------------------------------------------------------
 * Description: Mortgage Calculator Core JavaScript
 * Version    : 0.2.4
 * $Id: mcc.js,v 1.12 2006/12/07 09:34:30 gsotirov Exp $
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
    payment = round((period_interest * amount) / (1 - Math.pow(1 + period_interest, -periods)), 2);
  }
  else
    payment = round(amount / periods, 2);

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
 * Parameters : amount - the amount of the credit
 *              payment - period payment for the mortgage
 *              interest - mortgage interest in percents
 *              periods - the periods count
 */
function calc_total_return_amount(amount, payment, interest, periods) {
  var period_interest = interest / 100 / 12;
  var balance = amount;
  var ttl_return = 0.0;

  for ( var i = 1; i <= periods; ++i ) {
    var cap = round(period_interest * balance, 2);
    if ( periods == i )
      ttl_return += balance + cap;
    else {
      balance = round(balance + cap - payment, 2);
      ttl_return += payment;
    }
  }

  return ttl_return;
}

/* Function   : calc_plan
 * Description: Build mortgage amortization plan
 * Parameters : amount - the amount of the credit
 *              payment - period payment for the mortgage
 *              interest - mortgage interest in percents
 *              periods - the periods count
 */
function calc_plan(amount, payment, interest, periods) {
  var period_interest = interest / 100 / 12;
  var balance = amount;
  var Rows = new Array();

  for ( var i = 1; i <= periods; ++i ) {
    var cap = round(period_interest * balance, 2);
    if ( periods == i ) // last iteration
      Rows[i-1] = new Array(i, balance, cap, balance, balance + cap, 0.0);
    else {
      var new_balance = round(balance + cap - payment, 2);
      Rows[i-1] = new Array(i, balance, cap, payment - cap, payment, new_balance);
    }
    balance = new_balance;
  }

  return Rows;
}

function round(number, places) {
  return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
}
