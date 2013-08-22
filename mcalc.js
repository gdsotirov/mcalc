/* Mortgage Calculator
 * Copyright (C) 2004-2013  Georgi D. Sotirov
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
 * Description: Mortgage Calculator UI JavaScript
 * $Id: mcalc.js,v 1.15 2013/08/22 17:08:47 gsotirov Exp $
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
var uisInterest = 9;
var uisCapital = 10;
var uisPayment = 11;
var uisOutstanding = 12;

var UIStringsBG = new Array(
/*  0 */ "Моля, попълнете полето Сума!",
/*  1 */ "Моля, задайте правилна стойност в полето Сума!\nНапример: 10000, 15500, 20100.55",
/*  2 */ "Моля, попълнете полето Вноска!",
/*  3 */ "Моля, задайте правилна стойност в полето Вноска!\nНапример: 500, 750, 1200.5",
/*  4 */ "Моля, изберете срок на кредита в години и/или месеци!",
/*  5 */ "Моля, попълнете полето Лихва!",
/*  6 */ "Моля, задайте правилна стойност в полето Годишен лихвен процент!\nНапример: 10.5, 12.75, 11",
/*  7 */ "Период",
/*  8 */ "Салдо главница",
/*  9 */ "Вноска лихва",
/* 10 */ "Вноска главница",
/* 11 */ "Вноска общо",
/* 12 */ "Оставащо"
);

var UIStringsEN = new Array(
/*  0 */ "Please, fill in the Amount field!",
/*  1 */ "Please, fill in correct value in the Amount field! Example: 10000, 15500, 20100.55",
/*  2 */ "Please, fill in the Payment field!",
/*  3 */ "Please, fill in correct value in the Payment field! Example: 500, 750, 1200.5",
/*  4 */ "Please, choose the credit term in years and/or months!",
/*  5 */ "Please, fill in the Interest field!",
/*  6 */ "Please, fill in correct value in the Interest field! Example: 10000, 15500, 20100.55",
/*  7 */ "Period",
/*  8 */ "Capital Balance",
/*  9 */ "Interest payment",
/* 10 */ "Capital payment",
/* 11 */ "Payment total",
/* 12 */ "Outstanding"
);

function loadUIString(id) {
  var htmltags = document.getElementsByTagName("html");
  var lang = htmltags[0].lang;

  if ( lang == "en" ) {
    return UIStringsEN[id];
  }
  else if ( lang == "bg" ) {
    return UIStringsBG[id];
  }
  else
    return "???";
}

function formatNumber(number, places = 2) {
  var htmltags = document.getElementsByTagName("html");
  var lang = htmltags[0].lang;

  /* Configure number formatting */
  var num = new NumberFormat();
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

function formatField(obj) {
  obj.value = formatNumber(obj.value.replace(/,/));
}

function checkField(fld, type, uisFill, uisCorr) {
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

function removeAllChilds(node) {
  if ( node )
    while ( node.firstChild )
      node.removeChild(node.firstChild);
}

function getRadioValue(radio) {
  var i = 0;
  while ( i < radio.length ) {
    if ( radio[i].checked )
      return radio[i].value;
    ++i;
  }
  return;
}

function getFloatValue(str) {
  var htmltags = document.getElementsByTagName("html");
  var lang = htmltags[0].lang;

  return parseFloat(str.replace(/\s+/g, ""));
}

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

function showPlan() {
  var planc = document.getElementById("PlanContainer");
  if ( document.forms.CalcForm.EnablePlan.checked )
    planc.style.display = "block";
  else
    planc.style.display = "none";
}

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

function Reset() {
  var RetAmount = document.getElementById("ReturnAmount");
  var TotalRaise = document.getElementById("TotalRaise");
  var PlanContainer = document.getElementById("PlanContainer");
  removeAllChilds(RetAmount);
  removeAllChilds(TotalRaise);
  removeAllChilds(PlanContainer);
}

function Calc(type) {
  var form = document.forms.CalcForm;
  var type = getRadioValue(form.Type);
  var amount = getFloatValue(form.Amount.value);
  var termY = parseInt(form.TermY.value);
  var termM = 0;
  if (termY < 30)
    termM = parseInt(form.TermM.value);
  var interest = parseFloat(form.Interest.value);
  var payment = getFloatValue(form.Payment.value);
  var enablePlan = form.EnablePlan.checked;
  var PlanContainer = document.getElementById("PlanContainer");
  removeAllChilds(PlanContainer);

  var periods = termY * 12 + termM;
  var Amount = document.getElementById("Amount");
  var Payment = document.getElementById("Payment");
  if ( type == "payment" ) {
    payment = calc_period_payment(interest, amount, periods);
    Payment.value = formatNumber(payment);
  }
  else {
    amount = calc_total_amount(interest, payment, periods);
    Amount.value = formatNumber(amount);
  }

  var result = calc_plan(amount, payment, interest, periods);

  var TotalReturn   = document.getElementById("TotalReturn");
  var TotalInterest = document.getElementById("TotalInterest");
  var TotalRaise    = document.getElementById("TotalRaise");
  removeAllChilds(TotalReturn);
  removeAllChilds(TotalInterest);
  removeAllChilds(TotalRaise);

  var raise = ((result.tot_ret / amount) -1 ) * 100;
  
  TotalReturn.appendChild(document.createTextNode(formatNumber(result.tot_ret)));
  TotalInterest.appendChild(document.createTextNode(formatNumber(result.tot_int)));
  TotalRaise.appendChild(document.createTextNode(formatNumber(raise, 5) + " %"));

  if ( enablePlan ) {
    var Table = document.createElement("table");
    var Rows  = result.plan;
    Table.setAttribute("class", "tbThinBorder");
    Table.setAttribute("id", "Table");
    Table.setAttribute("cellspacing", "0");
    makeTableHeader(Table, loadUIString(uisDate), loadUIString(uisBalance),  loadUIString(uisInterest), loadUIString(uisCapital), loadUIString(uisPayment), loadUIString(uisOutstanding));
    var TableBody = document.createElement("tbody");
    for ( var i = 0; i < Rows.length; ++i ) {
      var Row = Rows[i];
      makeTableRow(TableBody, Row[0], formatNumber(Row[1]), formatNumber(Row[2]),  formatNumber(Row[3]), formatNumber(Row[4]), formatNumber(Row[5]));
    }
    Table.appendChild(TableBody);
    PlanContainer.appendChild(Table);
  }

  return true;
}

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

function makeTableRow(otable) {
  var new_tr = document.createElement("tr");
  for ( var i = 1; i < arguments.length; ++i ) {
    var new_td = document.createElement("td");
    new_td.appendChild(document.createTextNode(arguments[i]));
    new_tr.appendChild(new_td);
  }
  otable.appendChild(new_tr);
}
