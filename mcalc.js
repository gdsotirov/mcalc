/* Mortgage calculator Web Interface
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * $Id: mcalc.js,v 1.6.2.5 2005/12/14 21:35:55 gsotirov Exp $
 */

var uisPlsFillAmount = 0;
var uisPlsCorrAmount = 1;
var uisPlsFillPayment = 2
var uisPlsCorrPayment = 3;
var uisPlsChsePeriod = 4;
var uisPlsFillInterest = 5;
var uisPlsCorrInterest = 6;
var uisYear = 7;
var uisMonth = 8;
var uisInterest = 9;
var uisCapital = 10;
var uisPayment = 11;
var uisNewBalance = 12;
var uisRemove = 13;
var uisforthenext = 14;
var uisMonthMonths = 15;
var uisInterestTitle = 16;
var uisTermTitle = 17;
var uisPayment = 18;
var uisPlsEnterTerm = 19;
var uisPlsCorrTerm = 20;
var uisIncorrTerms = 21;

var UIStringsBG = new Array(
/*  0 */ "Моля, попълнете полето Сума!",
/*  1 */ "Моля, задайте правилна стойност в полето Сума!\nНапример: 10000, 15500, 20100.55",
/*  2 */ "Моля, попълнете полето Вноска!",
/*  3 */ "Моля, задайте правилна стойност в полето Вноска!\nНапример: 500, 750, 1200.5",
/*  4 */ "Моля, изберете срок на кредита в години и/или месеци!",
/*  5 */ "Моля, попълнете полето Лихва!",
/*  6 */ "Моля, задайте правилна стойност в полето Лихва!\nНапример: 10.5, 12.75, 11",
/*  7 */ "Година",
/*  8 */ "Месец",
/*  9 */ "Лихва",
/* 10 */ "Главница",
/* 11 */ "Вноска",
/* 12 */ "Оставащо салдо",
/* 13 */ "Премахване",
/* 14 */ "за следващите",
/* 15 */ "месец(а)",
/* 16 */ "Лихвата това е номиналния годишен лихвен процент за периода",
/* 17 */ "За какъв период от периода на кредита е в сила този лихвен процент",
/* 18 */ "Вноска",
/* 19 */ "Моля, попълнете периода на действие на тази лихва!",
/* 20 */ "Моля, задайте правилна стойност в полето за периода на действие на лихвата!",
/* 21 */ "Сбора от продължителността на периодите (%d) НЕ е равен на общата продължителност на кредита в месеци (%d)!"
);

var UIStringsEN = new Array(
/*  0 */ "Please, fill in the Amount field!",
/*  1 */ "Please, put in correct value in the Amount field! Example: 10000, 15500, 20100.55",
/*  2 */ "Please, fill in the Payment field!",
/*  3 */ "Please, put in correct value in the Payment field! Example: 500, 750, 1200.5",
/*  4 */ "Please, choose the credit term in years and/or months!",
/*  5 */ "Please, fill in the Interest field!",
/*  6 */ "Please, put in correct value in the Interest field! Example: 10000, 15500, 20100.55",
/*  7 */ "Year",
/*  8 */ "Month",
/*  9 */ "Interest",
/* 10 */ "Principal",
/* 11 */ "Payment",
/* 12 */ "Outstanding balance",
/* 13 */ "Remove",
/* 14 */ "for the next",
/* 15 */ "month(s)",
/* 16 */ "Interest is the yearly nominal interest in percents for the term",
/* 17 */ "For what term in the credit term is this interest in force",
/* 18 */ "Payment",
/* 19 */ "Please, fill in the validity term for this interest!",
/* 20 */ "Please, put in correct value in the validity term field for this interest!",
/* 21 */ "The sum of the terms periods (%d) is NOT equal to the total term of the credit in months (%d)!"
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
      val = parseFloat(fld.value.replace(/\s+/, ""));
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
  var TotalInterest = document.getElementById("TotalInterest");
  var TotalPay = document.getElementById("TotalPay");
  var TotalRaise = document.getElementById("TotalRaise");
  var TableContainer = document.getElementById("TableContainer");
  removeAllChilds(TotalInterest);
  removeAllChilds(TotalPay);
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
  if ( document.forms.CalcForm.EnableSchedule.checked )
    tablec.style.display = "block";
  else
    tablec.style.display = "none";
}

function addPeriod() {
  var counter = document.getElementById("Counter");
  var next_id = parseInt(counter.value) + 1;

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
  interest_input.setAttribute("onchange", "javascript: formatField(document.forms.CalcForm.Interest_" + next_id + ")");
  span_input.appendChild(interest_input);
  var new_text = document.createTextNode(" % " + loadUIString(uisforthenext) + " ");
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
  remove_link.setAttribute("onclick", "javascript: removePeriod(\"" + next_id + "\")");
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

  counter.value = next_id;
}

function removePeriod(id) {
  var terms = document.getElementById("Terms");
  var term_id = document.getElementById("Term_" + id);
  terms.removeChild(term_id);

  var payments = document.getElementById("Payments");
  var payment_id = document.getElementById("Payment_" + id);
  payments.removeChild(payment_id);
}

function checkForm() {
  var form = document.forms.CalcForm;
  var type = getRadioValue(form.Type);

  if ( type == "payment" ) {
    if ( !checkField(form.Amount, "float", uisPlsFillAmount, uisPlsCorrAmount) )
      return false;
  }
  else {
    var payment_elements = document.getElementsByName("Payment");
    for (var i = 0; i < payment_elements.length; ++i ) {
      if ( !checkField(payment_elements[i], "float", uisPlsFillPayment, uisPlsCorrPayment) )
        return false;
    }
  }

  var PeriodY = parseInt(form.PeriodY.value);
  var PeriodM = parseInt(form.PeriodM.value);
  var periods = PeriodY * 12 + PeriodM;
  if ( PeriodY == 0 && PeriodM == 0 ) {
    alert(loadUIString(uisPlsChsePeriod));
    form.PeriodY.focus();
    return false;
  }

  /* check interests and terms */
  var interest_elements = document.getElementsByName("Interest");
  var term_elements = document.getElementsByName("InterestPeriod");
  var entered_term = 0;
  for ( var i = 0; i < interest_elements.length; ++i ) {
    if ( !checkField(interest_elements[i], "float", uisPlsFillInterest, uisPlsCorrInterest) )
      return false;
    if ( !checkField(term_elements[i], "int", uisPlsEnterTerm, uisPlsCorrTerm) )
      return false;
    entered_term += parseInt(term_elements[i].value);
  }
  if ( entered_term != periods ) {
    alert(sprintf(loadUIString(uisIncorrTerms), entered_term, periods));
    return false;
  }

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

  /* retrive interests */
  var interest_elements = document.getElementsByName("Interest");
  var term_elements = document.getElementsByName("InterestPeriod");
  var interests = new Array();
  for ( var i = 0; i < interest_elements.length; ++i ) {
    interests[i] = new Array();
    interests[i][0] = parseFloat(interest_elements[i].value);
    interests[i][1] = parseInt(term_elements[i].value);
  }

  /* retrive payments */
  var payments = new Array();
  var payment_elements = document.getElementsByName("Payment");
  for ( var i = 0; i < payment_elements.length; ++i ) {
    payments[i] = new Array();
    payments[i][0] = getFloatValue(payment_elements[i].value);
    payments[i][1] = parseInt(term_elements[i].value);
  }

  var enableSchedule = form.EnableSchedule.checked;
  var TableContainer = document.getElementById("TableContainer");
  removeAllChilds(TableContainer);

  var periods = periodY * 12 + periodM;
  var Amount = document.getElementById("Amount");
  if ( type == "payment" ) {
    payments = calc_period_payment(interests, amount, periods);
    for ( var i = 0; i < payments.length; ++i ) {
      if ( payment_elements[i] )
        payment_elements[i].value = formatNumber(payments[i][0]);
    }
  }
  else {
    amount = calc_total_amount(interests, payments, periods);
    Amount.value = formatNumber(amount);
  }
  var total_pay = calc_total_payments(payments, periods);
  var total_int = total_pay - amount;

  var TotalInt = document.getElementById("TotalInterest");
  var TotalPay = document.getElementById("TotalPay");
  var TotalRaise = document.getElementById("TotalRaise");
  var raise = ((total_pay / amount) * 100) - 100;

  removeAllChilds(TotalInt);
  removeAllChilds(TotalPay);
  removeAllChilds(TotalRaise);

  TotalInt.appendChild(document.createTextNode(formatNumber(total_int)));
  TotalPay.appendChild(document.createTextNode(formatNumber(total_pay)));
  TotalRaise.appendChild(document.createTextNode(formatNumber(raise) + " %"));

  if ( enableSchedule ) {
    var Table = document.createElement("table");
    var Rows = build_schedule(amount, payments, interests, periods);
    Table.setAttribute("class", "tbThinBorder");
    Table.setAttribute("id", "Table");
    Table.setAttribute("cellspacing", "0");
    makeTableHeader(Table, loadUIString(uisYear), loadUIString(uisMonth), loadUIString(uisInterest), loadUIString(uisCapital), loadUIString(uisPayment), loadUIString(uisOutstanding));
    var TableBody = document.createElement("tbody");
    for ( var i = 0; i < Rows.length; ++i ) {
      var Row = Rows[i];
      makeTableRow(TableBody, Row[0], Row[1], formatNumber(Row[2]), formatNumber(Row[3]),  formatNumber(Row[4]), formatNumber(Row[5]));
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
