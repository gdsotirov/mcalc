/**
 * Mortgage Calculator
 * Copyright (C) 2004-2021  Georgi D. Sotirov
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
 * @file Mortgage Calculator Core JavaScript
 * @version 0.5.1
 * @author Georgi D. Sotirov <gdsotirov@gmail.com>
 */

/**
 * Calculates the period payment for annuity mortgages
 * @param {number} interest The yearly interest for the credit
 * @param {number} amount The amount for the credit
 * @param {number} periods The periods for the credit
 * @returns Amount to pay for the period
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

/**
 * Calculates the total amount that can be given
 * @param {number} interest The yearly interest for the credit
 * @param {number} payment The period payment
 * @param {number} periods The periods for the credit
 * @returns Total amount that can be given
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

/**
 * Builds mortgage amortization plan
 * @param {object} credit Object with all details of the credit
 * @returns An object with amortization table and total amounts
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
                        0.0,
                        balance,
                        credit.onetime_tax_rate,
                        onetime_tax);

    total_taxes += onetime_tax;
    total_ret_amt += onetime_tax;
  }

  for ( var i = 1; i <= credit.periods; ++i ) {
    var interest = 0.0;
    var interest_rate = 0.0;
    var taxes_rate = 0.0;

    if ( credit.int_periods && i <= credit.int_periods )
    {
      interest = round(balance * (credit.int_rate / 100 / 12), 2);
      interest_rate = credit.int_rate
    }
    else
    if ( credit.int_periods2 && i <= (credit.int_periods + credit.int_periods2) )
    {
      /* Recalculate for the remaining amount and term */
      if ( (i - credit.int_periods) == 1 )
        credit.payment = calc_period_payment(credit.int_rate2, balance, credit.periods - credit.int_periods);
      interest = round(balance * (credit.int_rate2 / 100 / 12), 2);
      interest_rate = credit.int_rate2;
    }
    else
    {
      /* Recalculate for the remaining amount and term */
      if ( (i - (credit.int_periods + credit.int_periods2)) == 1 )
        credit.payment = calc_period_payment(credit.int_rate3, balance, credit.periods - (credit.int_periods + credit.int_periods2));
      interest = round(balance * (credit.int_rate3 / 100 / 12), 2);
      interest_rate = credit.int_rate3;
    }
    total_ints += interest;

    /* Monthly tax on each installment */
    if ( credit.monthly_tax_rate || credit.monthly_tax_amt )
    {
      if (credit.monthly_tax_rate )
        monthly_tax += round(balance * (credit.monthly_tax_rate / 100), 2);
        taxes_rate += credit.monthly_tax_rate;
      if (credit.monthly_tax_amt )
        monthly_tax += round(credit.monthly_tax_amt, 2);

      total_taxes += monthly_tax;
    }

    if ( credit.periods == i ) { // last installment
      var last_payment = balance + interest;
      Rows[i] = new Array(i,
                          balance,
                          interest_rate,
                          interest,
                          balance,
                          last_payment,
                          0.0,
                          taxes_rate,
                          monthly_tax);
      total_ret_amt += last_payment + monthly_tax;
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
          taxes_rate += credit.annual_tax_rate;
        if ( credit.annual_tax_amt )
          annual_tax += round(credit.annual_tax_amt, 2);

        total_taxes += annual_tax;
      }

      Rows[i] = new Array(i,
                          balance,
                          interest_rate,
                          interest,
                          capital,
                          credit.payment,
                          new_balance,
                          taxes_rate,
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

/**
 * Rounds a number to given decimal places
 * @param {number} number A number
 * @param {number} places Decimal places
 * @returns Rounded number
 */
function round(number, places) {
  return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
}
