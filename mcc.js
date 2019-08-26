/* Mortgage Calculator
 * Copyright (C) 2004-2019  Georgi D. Sotirov
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
 */

/* Function   : calc_period_payment
 * Description: Calculate period payment for annuity mortgages
 * Parameters : interest - the yearly interest for the credit
 *              amount   - the amount for the credit
 *              periods  - the periods for the credit
 */
function calc_period_payment(interest, amount, periods) {
  var payment;

  if ( interest > 0.0 ) {
    var period_interest = interest / 100 / 12;
    payment = round((period_interest * amount) / (1 - Math.pow(1 + period_interest, -periods)), 2);
  }
  else {
    payment = round(amount / periods, 2);
  }

  return payment;
}

/* Function   : calc_total_amount
 * Description: Calculate total amount that can be given
 * Parameters : interest - the yearly interest for the credit
 *              payment  - the period payment
 *              periods  - the periods for the credit
 */
function calc_total_amount(interest, payment, periods) {
  var amount;

  if ( interest > 0.0 ) {
    var period_interest = interest / 100 / 12;
    amount = (payment * (1 - Math.pow(1 + period_interest, -periods))) / period_interest;
  }
  else {
    amount = payment * periods;
  }

  return amount;
}

/* Function   : calc_plan
 * Description: Build mortgage amortization plan
 * Parameters : amount - the amount of the credit
 *              payment - period payment for the mortgage
 *              interest - mortgage interest in percents
 *              periods - the periods count
 */
function calc_plan(credit) {
  var balance = credit.amount;
  var annual_tax    = 0.0;
  var monthly_tax   = 0.0;
  var onetime_tax   = 0.0;
  var total_ret_amt = 0.0;
  var total_ints    = 0.0;
  var total_taxes   = 0.0;
  var Rows = new Array();

  /* calculate one time tax */
  if ( credit.onetime_tax_rate || credit.onetime_tax_amt )
  {
    if ( credit.onetime_tax_rate )
      onetime_tax += round(balance * (credit.onetime_tax_rate / 100), 2);
    if ( credit.onetime_tax_amt )
      onetime_tax += round(credit.onetime_tax_amt, 2);

    Rows[0] = new Array(0,
                        balance,
                        0.0,
                        0.0,
                        0.0,
                        balance,
                        onetime_tax);

    total_taxes += onetime_tax;
    total_ret_amt += onetime_tax;
  }

  for ( var i = 1; i <= credit.periods; ++i ) {
    var interest;

    if ( credit.int_periods && i <= credit.int_periods )
    {
      interest = round(balance * (credit.int_rate / 100 / 12), 2);
    }
    else
    if ( credit.int_periods2 && i <= (credit.int_periods + credit.int_periods2) )
    {
      /* Recalculate for the remaining amount and term */
      if ( (i - credit.int_periods) == 1 )
        credit.payment = calc_period_payment(credit.int_rate2, balance, credit.periods - credit.int_periods);
      interest = round(balance * (credit.int_rate2 / 100 / 12), 2);
    }
    else
    {
      /* Recalculate for the remaining amount and term */
      if ( (i - (credit.int_periods + credit.int_periods2)) == 1 )
        credit.payment = calc_period_payment(credit.int_rate3, balance, credit.periods - (credit.int_periods + credit.int_periods2));
      interest = round(balance * (credit.int_rate3 / 100 / 12), 2);
    }
    total_ints += interest;

    /* Monthly tax on each installment */
    if ( credit.monthly_tax_rate || credit.monthly_tax_amt )
    {
      if (credit.monthly_tax_rate )
        monthly_tax += round(balance * (credit.monthly_tax_rate / 100), 2);
      if (credit.monthly_tax_amt )
        monthly_tax += round(credit.monthly_tax_amt, 2);

      total_taxes += monthly_tax;
      total_ret_amt += monthly_tax;
    }

    if ( credit.periods == i ) { // last installment
      var last_payment = balance + interest;
      Rows[i] = new Array(i,
                          balance,
                          interest,
                          balance,
                          last_payment,
                          0.0,
                          monthly_tax);
      total_ret_amt += last_payment;
    }
    else {
      var capital     = credit.payment - interest;
      var new_balance = round(balance + interest - credit.payment, 2);
      /* Annual tax on last/first installment of every year since the beginning */
      /* e.g. every December or January depending on selected type */
      if ( (i != 1 && i % 12 == credit.annual_tax_type)
           && (credit.annual_tax_rate || credit.annual_tax_amt) )
      {
        if ( credit.annual_tax_rate )
          annual_tax += round(balance * (credit.annual_tax_rate / 100), 2);
        if ( credit.annual_tax_amt )
          annual_tax += round(credit.annual_tax_amt, 2);

        total_taxes += annual_tax;
      }

      Rows[i] = new Array(i,
                          balance,
                          interest,
                          capital,
                          credit.payment,
                          new_balance,
                          annual_tax + monthly_tax);
      total_ret_amt += credit.payment + annual_tax + monthly_tax;
    }
    balance = new_balance;
    monthly_tax = 0.0;
    annual_tax = 0.0;
  }

  return {am_tbl : Rows,
          tot_int: total_ints,
          tot_tax: total_taxes,
          tot_ret: total_ret_amt
         };
}

function round(number, places) {
  return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
}
