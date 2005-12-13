/* Mortgage calculator Web Interface
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * $Id: mcalc.js,v 1.6.2.3 2005/12/13 19:06:35 gsotirov Exp $
 */

var uisPlsFillAmount = 0;
var uisPlsCorrAmount = 1;
var uisPlsFillPayment = 2
var uisPlsCorrPayment = 3;
var uisPlsChsePeriod = 4;
var uisPlsFillInterest = 5;
var uisPlsCorrInterest = 6;
var uisPeriod = 7;
var uisBalance = 8;
var uisInterest = 9;
var uisCapital = 10;
var uisPayment = 11;
var uisNewBalance = 12;
var uisRemove = 13;
var uisfor = 14;
var uisMonthMonths = 15;
var uisInterestTitle = 16;
var uisTermTitle = 17;
var uisPayment = 18;

var UIStringsBG = new Array(
/*  0 */ "Моля, попълнете полето Сума!",
/*  1 */ "Моля, задайте правилна стойност в полето Сума!\nНапример: 10000, 15500, 20100.55",
/*  2 */ "Моля, попълнете полето Вноска!",
/*  3 */ "Моля, задайте правилна стойност в полето Вноска!\nНапример: 500, 750, 1200.5",
/*  4 */ "Моля, изберете срок на кредита в години и/или месеци!",
/*  5 */ "Моля, попълнете полето Лихва!",
/*  6 */ "Моля, задайте правилна стойност в полето Годишен лихвен процент!\nНапример: 10.5, 12.75, 11",
/*  7 */ "Период",
/*  8 */ "Салдо",
/*  9 */ "Лихва",
/* 10 */ "Главница",
/* 11 */ "Вноска",
/* 12 */ "Оставащо",
/* 13 */ "Премахване",
/* 14 */ "за",
/* 15 */ "месец(а)",
/* 16 */ "Лихвата това е номиналния годишен лихвен процент за периода",
/* 17 */ "За какъв период от периода на кредита е в сила този лихвен процент",
/* 18 */ "Вноска"
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
/*  8 */ "Balance",
/*  9 */ "Interest",
/* 10 */ "Capital",
/* 11 */ "Payment",
/* 12 */ "Outstanding",
/* 13 */ "Remove",
/* 14 */ "for",
/* 15 */ "month(s)",
/* 16 */ "Interest is the yearly nominal interest in percents for the term",
/* 17 */ "For what term in the credit term is this interest in force",
/* 18 */ "Payment"
);

function loadUIString(id) {
  var htmltags = document.getElementsByTagName("html");
  var lang = htmltags[0].lang;

  switch ( lang ) {
    case "en": return UIStringsEN[id];
    case "bg": return UIStringsBG[id];
    default  : return "?";
  }
}

function formatNumber(number) {
  var htmltags = document.getElementsByTagName("html");
  var lang = htmltags[0].lang;

  /* Configure number formatting */
  var num = new NumberFormat();
  num.setInputDecimal('.');
  num.setSeparators(true, ' ', '.');
  num.setPlaces('2', false);
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

  return parseFloat(str.replace(/\s+/, "").replace(/,/, "."));
}

function Reset() {
  var RetAmount = document.getElementById("ReturnAmount");
  var TotalRaise = document.getElementById("TotalRaise");
  var TableContainer = document.getElementById("TableContainer");
  removeAllChilds(RetAmount);
  removeAllChilds(TotalRaise);
  removeAllChilds(TableContainer);
}

function lockMonths() {
  var year = parseInt(document.forms.CalcForm.PeriodY.value);
  if ( !isNaN(year) ) {
    document.forms.CalcForm.PeriodM.disabled = (year == 30);
    var msel = document.getElementById("MonthSelect");
    if ( year == 30 )
      msel.style.display = "none";
    else
      msel.style.display = "inline";
  }
}

function showTable() {
  var tablec = document.getElementById("TableContainer");
  if ( document.forms.CalcForm.EnableTable.checked )
    tablec.style.display = "block";
  else
    tablec.style.display = "none";
}

/* TODO: Find why in Opera this code doesn't work as expected. */
function getNextId(name) {
  var max = 0;
  var elements_list = document.getElementsByName(name);
  for ( var i = 0; i < elements_list.length; ++i ) {
    var id = parseInt(elements_list[i].id.replace(/[a-zA-z_ ]+/, ""));
    if ( id > max ) {
      max = id;
    }
  }

  return max + 1;
}

function addPeriod() {
  var next_id = getNextId("Term");

  /* Add interest */
  var label = document.createElement("label");
  label.setAttribute("for", "Interest_" + next_id);
  var span_label = document.createElement("span");
  span_label.setAttribute("class", "label");
  var interest_text = document.createTextNode(loadUIString(uisInterest) + ":");
  span_label.appendChild(interest_text);
  label.appendChild(span_label);

  var span_input = document.createElement("span");
  span_input.setAttribute("class", "input");
  var interest_input = document.createElement("input");
  interest_input.setAttribute("id", "Interest_" + next_id);
  interest_input.setAttribute("name", "Interest");
  interest_input.setAttribute("type", "text");
  interest_input.setAttribute("size", "6");
  interest_input.setAttribute("maxlength", "10");
  interest_input.setAttribute("title", loadUIString(uisInterestTitle));
  span_input.appendChild(interest_input);
  var new_text = document.createTextNode(" % " + loadUIString(uisfor) + " ");
  span_input.appendChild(new_text);
  var period_input = document.createElement("input");
  period_input.setAttribute("id", "InterestPeriod_" + next_id);
  period_input.setAttribute("name", "InterestPeriod");
  period_input.setAttribute("type", "text");
  period_input.setAttribute("size", "3");
  period_input.setAttribute("maxlength", "10");
  period_input.setAttribute("title", loadUIString(uisTermTitle));
  span_input.appendChild(period_input);
  var new_text2 = document.createTextNode(" " + loadUIString(uisMonthMonths) + " ");
  span_input.appendChild(new_text2);
  var remove_link = document.createElement("a");
  remove_link.setAttribute("href", "#");
  remove_link.setAttribute("onclick", "javascript: removePeriod(\"Term_" + next_id + "\")");
  var remove_link_text = document.createTextNode(loadUIString(uisRemove));
  remove_link.appendChild(remove_link_text);
  var remove_link_span = document.createElement("span");
  remove_link_span.setAttribute("class", "no_print");
  remove_link_span.appendChild(remove_link);
  span_input.appendChild(remove_link_span);
  var term_div = document.createElement("div");
  term_div.setAttribute("class", "row");
  term_div.setAttribute("id", "Term_" + next_id);
  term_div.appendChild(label);
  term_div.appendChild(span_input);

  var terms = document.getElementById("Terms");
  terms.appendChild(term_div);

  /* Add payment */
  var payment_text = document.createTextNode(loadUIString(uisPayment) + ":");
  var span_label = document.createElement("span");
  span_label.setAttribute("class", "label");
  span_label.appendChild(payment_text);
  var label = document.createElement("label");
  label.setAttribute("for", "Payment_" + next_id);
  label.appendChild(span_label);
  var payment_input = document.createElement("input");
  payment_input.setAttribute("id", "Payment_" + next_id);
  payment_input.setAttribute("name", "Payment");
  payment_input.setAttribute("type", "text");
  payment_input.setAttribute("size", "8");
  payment_input.setAttribute("maxlength", "10");
  payment_input.setAttribute("onchange", "javascript: formatField(document.forms.CalcForm.Payment_" + next_id + ")");
  var span_input = document.createElement("span");
  span_input.setAttribute("class", "input");
  span_input.appendChild(payment_input);
  var payment_div = document.createElement("div");
  payment_div.setAttribute("class", "row");
  payment_div.setAttribute("id", "Payment_" + next_id);
  payment_div.appendChild(label);
  payment_div.appendChild(span_input);

  var payments = document.getElementById("Payments");
  payments.appendChild(payment_div);
}

function removePeriod(id) {
  //alert("Removing id = " + id);
  var parent_element = document.getElementById("Terms");
  var child_element = document.getElementById(id);
  parent_element.removeChild(child_element);
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

  var PeriodY = parseInt(form.PeriodY.value);
  var PeriodM = parseInt(form.PeriodM.value);
  if ( PeriodY == 0 && PeriodM == 0 ) {
    alert(loadUIString(uisPlsChsePeriod));
    form.PeriodY.focus();
    return false;
  }
  if ( !checkField(form.Interest, "float", uisPlsFillInterest, uisPlsCorrInterest) )
    return false;

  return true;
}

function Calc(type) {
  var form = document.forms.CalcForm;
  var type = getRadioValue(form.Type);
  var amount = getFloatValue(form.Amount.value);
  var periodY = parseInt(form.PeriodY.value);
  var periodM = 0;
  if (periodY < 30)
    periodM = parseInt(form.PeriodM.value);
  var interest = parseFloat(form.Interest.value);
  var payment = getFloatValue(form.Payment.value);
  var enableTable = form.EnableTable.checked;
  var TableContainer = document.getElementById("TableContainer");
  removeAllChilds(TableContainer);

  var periods = periodY * 12 + periodM;
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
  var retam = calc_total_return_amount(payment, periods);

  var RetAmount = document.getElementById("ReturnAmount");
  var TotalRaise = document.getElementById("TotalRaise");
  var raise = ((retam / amount) * 100) - 100;

  removeAllChilds(RetAmount);
  removeAllChilds(TotalRaise);

  RetAmount.appendChild(document.createTextNode(formatNumber(retam)));
  TotalRaise.appendChild(document.createTextNode(formatNumber(raise) + " %"));

  if ( enableTable ) {
    var Table = document.createElement("table");
    var Rows = calc_table(amount, payment, interest, periods);
    Table.setAttribute("class", "tbThinBorder");
    Table.setAttribute("id", "Table");
    Table.setAttribute("cellspacing", "0");
    makeTableHeader(Table, loadUIString(uisPeriod), loadUIString(uisBalance),  loadUIString(uisInterest), loadUIString(uisCapital), loadUIString(uisPayment),         loadUIString(uisNewBalance));
    var TableBody = document.createElement("tbody");
    for ( var i = 0; i < Rows.length; ++i ) {
      var Row = Rows[i];
      makeTableRow(TableBody, Row[0], formatNumber(Row[1]), formatNumber(Row[2]),  formatNumber(Row[3]), formatNumber(Row[4]), formatNumber(Row[5]));
    }
    Table.appendChild(TableBody);
    TableContainer.appendChild(Table);
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
