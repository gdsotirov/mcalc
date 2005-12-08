/* Mortgage calculator Web Interface
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * $Id: mcalc.js,v 1.5 2005/12/08 20:58:08 gsotirov Exp $
 */

var uisPlsFillAmount = 0;
var uisPlsCorrAmount = 1;
var uisPlsFillPayment = 2
var uisPlsCorrPayment = 3;
var uisPlsChsePeriod = 4;
var uisPlsFillInterest = 5;
var uisPlsCorrInterest = 6;

var UIStringsBG = new Array(
/*  0 */ "Моля, попълнете полето Сума!",
/*  1 */ "Моля, задайте правилна стойност в полето Сума!\nНапример: 10000, 15500, 20100.55",
/*  2 */ "Моля, попълнете полето Вноска!",
/*  3 */ "Моля, задайте правилна стойност в полето Вноска!\nНапример: 500, 750, 1200.5",
/*  4 */ "Моля, изберете срок на кредита в години и/или месеци!",
/*  5 */ "Моля, попълнете полето Лихва!",
/*  6 */ "Моля, задайте правилна стойност в полето Годишен лихвен процент!\nНапример: 10.5, 12.75, 11"
);

var UIStringsEN = new Array(
/*  0 */ "Please, fill in the Amount field!",
/*  1 */ "Please, fill in correct value in the Amount field! Example: 10000, 15500, 20100.55",
/*  2 */ "Please, fill in the Payment field!",
/*  3 */ "Please, fill in correct value in the Payment field! Example: 500, 750, 1200.5",
/*  4 */ "Please, choose the credit term in years and/or months!",
/*  5 */ "Please, fill in the Interest field!",
/*  6 */ "Please, fill in correct value in the Interest field! Example: 10000, 15500, 20100.55"
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

function formatNumber(number, float) {
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
  obj.value = formatNumber(obj.value.replace(/,/, "."));
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
  removeAllChilds(RetAmount);
  removeAllChilds(TotalRaise);
  RetAmount.appendChild(document.createTextNode(sprintf("%1.2f", "0.0")));
  TotalRaise.appendChild(document.createTextNode(sprintf("%1.2f", "0.0")));
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

  var periods = periodY * 12 + periodM;
  var Amount = document.getElementById("Amount");
  var Payment = document.getElementById("Payment");
  if ( type == "payment" ) {
    payment = calc_period_payment(interest, amount, periods);
    Payment.value = formatNumber(payment, true);
  }
  else {
    amount = calc_total_amount(interest, payment, periods);
    Amount.value = formatNumber(amount, true);
  }
  var retam = calc_total_return_amount(payment, periods);

  var RetAmount = document.getElementById("ReturnAmount");
  var TotalRaise = document.getElementById("TotalRaise");
  var raise = ((retam / amount) * 100) - 100;

  removeAllChilds(RetAmount);
  removeAllChilds(TotalRaise);

  RetAmount.appendChild(document.createTextNode(formatNumber(retam, true)));
  TotalRaise.appendChild(document.createTextNode(formatNumber(raise, true) + " %"));
  return true;
}
