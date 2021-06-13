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
 * @file Mortgage Calculator UI JavaScript
 * @version 0.5.2
 * @author Georgi D. Sotirov <gdsotirov@gmail.com>
 */

var uisPlsFillAmount = 0;
var uisPlsCorrAmount = 1;
var uisPlsFillPayment = 2
var uisPlsCorrPayment = 3;
var uisPlsChsePeriod = 4;
var uisPlsFillInterest = 5;
var uisPlsCorrInterest = 6;
var uisDate = 7;
var uisBalance = 8;
var uisIntRate = 9;
var uisInterest = 10;
var uisCapital = 11;
var uisPayment = 12;
var uisOutstanding = 13;
var uisTaxesRate = 14;
var uisTaxes   = 15;

var UIStringsBG = new Array(
/*  0 */ "Моля, попълнете полето Сума!",
/*  1 */ "Моля, задайте правилна стойност в полето Сума!\nНапример: 10000, 15500, 20100.55",
/*  2 */ "Моля, попълнете полето Вноска!",
/*  3 */ "Моля, задайте правилна стойност в полето Вноска!\nНапример: 500, 750, 1200.5",
/*  4 */ "Моля, изберете срок на кредита в години и/или месеци!",
/*  5 */ "Моля, попълнете полетата Лихвен процент!",
/*  6 */ "Моля, задайте правилна стойност в полето Годишен лихвен процент!\nНапример: 10.5, 12.75, 11",
/*  7 */ "Месец",
/*  8 */ "Салдо главница",
/*  9 */ "Лихвен %",
/* 10 */ "Вноска лихва",
/* 11 */ "Вноска главница",
/* 12 */ "Вноска общо",
/* 13 */ "Оставащо",
/* 14 */ "Такси %",
/* 15 */ "Такси"
);

var UIStringsEN = new Array(
/*  0 */ "Please, fill in the Amount field!",
/*  1 */ "Please, fill in correct value in the Amount field! Example: 10000, 15500, 20100.55",
/*  2 */ "Please, fill in the Payment field!",
/*  3 */ "Please, fill in correct value in the Payment field! Example: 500, 750, 1200.5",
/*  4 */ "Please, choose the credit term in years and/or months!",
/*  5 */ "Please, fill in the Interest rate fields!",
/*  6 */ "Please, fill in correct value in the Interest field! Example: 10000, 15500, 20100.55",
/*  7 */ "Month",
/*  8 */ "Capital Balance",
/*  9 */ "Interest rate",
/* 10 */ "Interest payment",
/* 11 */ "Capital payment",
/* 12 */ "Payment total",
/* 13 */ "Outstanding",
/* 14 */ "Taxes rate",
/* 15 */ "Taxes"
);

/**
 * Loads UI string base on language setting of html tag
 * @param {number} id UI string identifier
 * @returns String in specific language.
 */
function loadUIString(id) {
  var htmltags = document.getElementsByTagName("html");
  var lang = htmltags[0].lang;

  if ( lang == "en" ) {
    return UIStringsEN[id];
  }
  else if ( lang == "bg" ) {
    return UIStringsBG[id];
  }
  else return "???";
}

/**
 * Formats number with specified precision
 * @param {number} number Number to format
 * @param {number} places Precision in decimal places
 * @returns Formatted string representation of the number
 */
function formatNumber(number, places = 2) {
  var num = new NumberFormat();

  /* Configure number formatting */
  num.setInputDecimal('.');
  num.setSeparators(true, ' ', '.');
  num.setPlaces(places, false);
  num.setCurrency(false);
  num.setCurrencyPosition(num.LEFT_OUTSIDE);
  num.setNegativeFormat(num.LEFT_DASH);
  num.setNegativeRed(false);
  num.setNumber(number);

  return num.toFormatted();
}

/**
 * Formats the value of and HTML input element
 * @param {object} obj An HTML input element
 * @param {number} places Precision in decimal places
 */
function formatField(obj, places = 2) {
  if ( obj.value != 0 )
  {
    obj.value = formatNumber(obj.value.replace(",", ".").replace(/\s+/g, ""), places);
  }
  else
  {
    obj.value = "";
  }
}

/**
 * Checks the value of an HTML input element
 * @param {object} fld An HTML input element
 * @param {string} type Value type. Either 'float' or 'int'
 * @param {number} uisFill UI string index for when field value is empty
 * @param {number} uisCorr UI string index for when field value is wrong
 * @returns True if the value in the field is correct, otherwise false
 */
function checkField(fld, type, uisFill, uisCorr) {
  var val;

  if ( fld.value == "" ) {
    alert(loadUIString(uisFill));
    fld.focus();
    return false;
  }

  if ( type != "string" ) {
    if ( type == "float" )
      val = parseFloat(fld.value);
    else if ( type == "int" )
      val = parseInt(fld.value);
    if ( isNaN(val) ) {
      alert(loadUIString(uisCorr));
      fld.focus();
      return false;
    }
  }

  return true;
}

/**
 * Removes all children elements of an element
 * @param {object} elem An HTML element (any)
 */
 function removeAllChildren(elem) {
  while ( elem.firstChild ) {
    elem.removeChild(elem.lastChild);
  }
}

/**
 * Retrieves the value of a radio button
 * @param {object} radio An HTML radio buttons input
 * @returns The selected radio button value, otherwise undefined
 */
function getRadioValue(radio) {
  var i = 0;
  while ( i < radio.length ) {
    if ( radio[i].checked )
      return radio[i].value;
    ++i;
  }
  return;
}

/**
 * Parses floating value by first removing spaces and replacing , with .
 * @param {string} str String with float value
 * @returns Float value
 */
function getFloatValue(str) {
  return parseFloat(str.replace(/\s+/g, "").replace(",", "."));
}

/**
 * Hides select for months if maximum term of 30 years is chosen
 */
function lockMonths() {
  var year = parseInt(document.forms.CalcForm.TermY.value);
  if ( !isNaN(year) ) {
    document.forms.CalcForm.TermM.disabled = (year == 30);
    var msel = document.getElementById("MonthSelect");
    if ( year == 30 )
      msel.style.display = "none";
    else
      msel.style.display = "inline";
  }
}

/**
 * Disables either input for Amount or Payment based on the value of Type
 * radio button, because these are mutually exclusive calculation options
 */
function lockType() {
  var type_val = getRadioValue(document.forms.CalcForm.Type);
  document.getElementById("Payment").disabled = (type_val == "payment");
  document.getElementById("Amount" ).disabled = (type_val == "amount" );
}

/**
 * Finds next element in tab index
 * @see https://stackoverflow.com/a/29883167
 * @param {object} el An HTML element
 * @returns The next element in tab index
 */
function findNextTabStop(el) {
  var elmnts = document.querySelectorAll('input, button, select');
  var list = Array.prototype.filter.call(elmnts, function(item) {return item.tabIndex >= "0"});
  var idx = list.indexOf(el);
  return list[idx + 1] || list[0];
}

/**
 * Enables or disables additional interest rates inputs based on what is
 * already entered. User first have to set one interest rate for given period
 * to be able to enter second with second period and finally third for the
 * remaining period.
 * @param {object} elmnt An HTML element
 */
function controlRates(elmnt) {
  var Interest   = document.getElementById("Interest");
  var IntPeriods = document.getElementById("IntPeriods");
  var Interest2  = document.getElementById("Interest2");
  var IntPeriods2= document.getElementById("IntPeriods2");
  var Interest3  = document.getElementById("Interest3");

  IntPeriods.disabled = (Interest.value.length == 0 || Interest.value == "" || Interest.value == 0 );
  Interest2.disabled  = (   (Interest.value.length == 0   || Interest.value == ""   || Interest.value == 0)
                         || (IntPeriods.value.length == 0 || IntPeriods.value == "" || IntPeriods.value == 0)
                        );
  IntPeriods2.disabled= (Interest2.value.length == 0 || Interest2.value == "" || Interest2.value == 0 );
  Interest3.disabled  = (   (Interest2.value.length == 0   || Interest2.value == ""   || Interest2.value == 0)
                         || (IntPeriods2.value.length == 0 || IntPeriods2.value == "" || IntPeriods2.value == 0)
                        );

  /* Focus on next element by tab index */
  var nextElmnt = findNextTabStop(elmnt);
  nextElmnt.focus();
}

/**
 * Shows or hides amortization table
 */
function showPlan() {
  var planc = document.getElementById("PlanContainer");
  if ( document.forms.CalcForm.EnablePlan.checked )
    planc.style.display = "block";
  else
    planc.style.display = "none";
}

/**
 * Checks values in calculator form
 * @returns True if all values are correct, otherwise false
 */
function checkForm() {
  var form = document.forms.CalcForm;
  var type = getRadioValue(form.Type);

  if ( type == "payment" ) {
    if ( !checkField(form.Amount, "float", uisPlsFillAmount, uisPlsCorrAmount) )
      return false;
  }
  else if ( !checkField(form.Payment, "float", uisPlsFillPayment, uisPlsCorrPayment) )
      return false;

  var TermY = parseInt(form.TermY.value);
  var TermM = parseInt(form.TermM.value);
  if ( TermY == 0 && TermM == 0 ) {
    alert(loadUIString(uisPlsChsePeriod));
    form.TermY.focus();
    return false;
  }
  if ( !checkField(form.Interest, "float", uisPlsFillInterest, uisPlsCorrInterest) )
    return false;

  return true;
}

/**
 * Performs calculator form reset
 */
function doReset() {
  removeAllChildren(document.getElementById("TotalInterests"));
  removeAllChildren(document.getElementById("TotalTaxes"));
  removeAllChildren(document.getElementById("TotalReturn"));
  removeAllChildren(document.getElementById("TotalRaise"));
  removeAllChildren(document.getElementById("PlanContainer"));

  document.getElementById("IntPeriods").disabled  = true;
  document.getElementById("Interest2").disabled   = true;
  document.getElementById("IntPeriods2").disabled = true;
  document.getElementById("Interest3").disabled   = true;

  document.forms.CalcForm.TermM.disabled = false;
  document.getElementById("MonthSelect").style.display = "inline";

  document.getElementById("Payment").disabled = true;
  document.getElementById("Amount" ).disabled = false;
}

/**
 * Calculates and displays results and optionally amortization table
 * @returns Always true
 */
function doCalc() {
  var form = document.forms.CalcForm;
  var credit = new Object();

  credit.type = getRadioValue(form.Type);
  credit.amount = getFloatValue(form.Amount.value);
  credit.termY = parseInt(form.TermY.value);
  credit.termM = 0;
  if (credit.termY < 30) credit.termM = parseInt(form.TermM.value);
  credit.periods = credit.termY * 12 + credit.termM;
  credit.int_rate     = getFloatValue(form.Interest.value);
  credit.int_periods  = parseInt(form.IntPeriods.value);
  credit.int_rate2    = getFloatValue(form.Interest2.value);
  credit.int_periods2 = parseInt(form.IntPeriods2.value);
  credit.int_rate3    = getFloatValue(form.Interest3.value);
  if ( !credit.int_periods ) {
    credit.int_periods = credit.periods;
    credit.int_periods2 = 0;
  }
  if ( !credit.int_periods2 && credit.int_rate2 )
  {
    credit.int_periods2 = credit.periods - credit.int_periods;
  }
  credit.payment      = getFloatValue(form.Payment.value);

  credit.annual_tax_rate  = getFloatValue(form.AnnualTaxRate.value);
  credit.annual_tax_amt   = getFloatValue(form.AnnualTaxAmt.value);
  if ( Number(form.AnnualTaxType.value) != 0 ) {
    credit.annual_tax_type  = 1;
  }
  else
  {
    credit.annual_tax_type  = 0;
  }
  credit.monthly_tax_rate = getFloatValue(form.MonthlyTaxRate.value);
  credit.monthly_tax_amt  = getFloatValue(form.MonthlyTaxAmt.value);
  credit.onetime_tax_rate = getFloatValue(form.OneTimeTaxRate.value);
  credit.onetime_tax_amt  = getFloatValue(form.OneTimeTaxAmt.value);

  var enablePlan = form.EnablePlan.checked;

  var Amount  = document.getElementById("Amount");
  var Payment = document.getElementById("Payment");

  if ( credit.type == "payment" ) {
    credit.payment = calc_period_payment(credit.int_rate, credit.amount, credit.periods);
    Payment.value = formatNumber(credit.payment);
  }
  else {
    credit.amount = calc_total_amount(credit.int_rate, credit.payment, credit.periods);
    Amount.value = formatNumber(credit.amount);
  }

  var result = calc_plan(credit);

  var TotalInt    = document.getElementById("TotalInterests");
  var TotalTax    = document.getElementById("TotalTaxes");
  var TotalReturn = document.getElementById("TotalReturn");
  var TotalRaise  = document.getElementById("TotalRaise");
  var AmortPlan   = document.getElementById("PlanContainer");
  removeAllChildren(document.getElementById("TotalInterests"));
  removeAllChildren(document.getElementById("TotalTaxes"));
  removeAllChildren(document.getElementById("TotalReturn"));
  removeAllChildren(document.getElementById("TotalRaise"));
  removeAllChildren(document.getElementById("PlanContainer"));

  var raise = ((result.tot_ret / credit.amount) - 1 ) * 100;

  TotalInt.appendChild(document.createTextNode(formatNumber(result.tot_int)));
  TotalTax.appendChild(document.createTextNode(formatNumber(result.tot_tax)));
  TotalReturn.appendChild(document.createTextNode(formatNumber(result.tot_ret)));
  TotalRaise.appendChild(document.createTextNode(formatNumber(raise, 5) + " %"));

  if ( enablePlan ) {
    var Table = document.createElement("table");
    var Rows  = result.am_tbl;
    Table.setAttribute("class", "tbThinBorder");
    Table.className = "tbThinBorder";
    Table.setAttribute("id", "Table");
    Table.setAttribute("cellspacing", "0");
    makeTableHeader(Table, loadUIString(uisDate),
                           loadUIString(uisBalance),
                           loadUIString(uisIntRate),
                           loadUIString(uisInterest),
                           loadUIString(uisCapital),
                           loadUIString(uisPayment),
                           loadUIString(uisOutstanding),
                           loadUIString(uisTaxesRate),
                           loadUIString(uisTaxes));
    var TableBody = document.createElement("tbody");
    for ( var i = 0; i < Rows.length; ++i ) {
      if ( Rows[i] )
      {
        var Row = Rows[i];
        var elmnt = makeTableRow(TableBody, Row[0],
                                 formatNumber(Row[1]),
                                 formatNumber(Row[2]),
                                 formatNumber(Row[3]),
                                 formatNumber(Row[4]),
                                 formatNumber(Row[5]),
                                 formatNumber(Row[6]),
                                 formatNumber(Row[7]),
                                 formatNumber(Row[8]));

        if ( i % 12 == 0 )
          elmnt.setAttribute("style", "background-color: #eeeeee;");
      }
    }
    Table.appendChild(TableBody);
    AmortPlan.appendChild(Table);
  }

  return true;
}

/**
 * Constructs results table header
 * @param {object} otable An HTML table element
 */
function makeTableHeader(otable) {
  var new_tr = document.createElement("tr");
  for ( var i = 1; i < arguments.length; ++i ) {
    var new_th = document.createElement("th");
    new_th.appendChild(document.createTextNode(arguments[i]));
    new_tr.appendChild(new_th);
  }
  var new_thead = document.createElement("thead");
  new_thead.appendChild(new_tr);
  otable.appendChild(new_thead);
}

/**
 * Constructs results table data row
 * @param {object} otable An HTML table element
 */
function makeTableRow(otable) {
  var new_tr = document.createElement("tr");
  for ( var i = 1; i < arguments.length; ++i ) {
    var new_td = document.createElement("td");
    new_td.appendChild(document.createTextNode(arguments[i]));
    new_tr.appendChild(new_td);
  }
  otable.appendChild(new_tr);
  return new_tr;
}

