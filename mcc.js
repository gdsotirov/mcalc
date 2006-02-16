/* Mortgage calculator
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
 * $Id: mcc.js,v 1.8 2006/02/16 19:13:27 gsotirov Exp $
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
 * Parameters : monthly - monthly payment
 *              periods - periods
 */
function calc_total_return_amount(monthly, periods) {
  return round(periods * monthly, 2);
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

function round(number, places) {
  return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
}
