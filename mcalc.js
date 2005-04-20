/* Mortgage calculator Web Interface
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * Version: 0.1.0
 * $Id: mcalc.js,v 1.2 2005/04/20 18:54:33 gsotirov Exp $
 */

var uisPlsFillAmount = 0;
var uisPlsCorrAmount = 1;
var uisPlsChsePeriod = 2;
var uisPlsFillInterest = 3;
var uisPlsCorrInterest = 4;

var UIStringsBG = new Array(
/*  0 */ "Моля, попълнете полето Размер на кредита!",
/*  1 */ "Моля, задайте правилна стойност в полето Размер на кредита!\nНапример: 10000, 15500, 20100.55",
/*  2 */ "Моля, изберете срок на кредита в години и/или месеци!",
/*  3 */ "Моля, попълнете полето Годишен лихвен процент!",
/*  4 */ "Моля, задайте правилна стойност в полето Годишен лихвен процент!\nНапример: 10.5, 12.75, 11"
);

var UIStringsEN = new Array(
/*  0 */ "Please, fill in the Amount field!",
/*  1 */ "Please, fill in correct value in the Amount field! Example: 10000, 15500, 20100.55",
/*  2 */ "Please, choose the period of the credit in years and/or months!",
/*  3 */ "Please, fill in the Interest field!",
/*  4 */ "Please, fill in correct value in the Interest field! Example: 10000, 15500, 20100.55"
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

function doReset() {
  var PaymentID = document.getElementById("Payment");
  var RetAmount = document.getElementById("ReturnAmount");
  PaymentID.innerHTML = "0.00";
  RetAmount.innerHTML = "0.00";
}

function lockMonths() {
  var year = parseInt(document.forms.CalcForm.PeriodY.value);
  if ( !isNaN(year) ) {
    document.forms.CalcForm.PeriodM.disabled = (year == 30);
    var msel = document.getElementById("MonthSelect");
    if ( year == 30 )
      msel.style.display = "none";
    else
      msel.style.display = "";
  }
}

function checkForm() {
  var form = document.forms.CalcForm;

  if ( !checkField(form.Amount, "float", uisPlsFillAmount, uisPlsCorrAmount) )
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

function doCalc() {
  var form = document.forms.CalcForm;
  var amount = parseFloat(form.Amount.value);
  var periodY = parseInt(form.PeriodY.value);
  var periodM = parseInt(form.PeriodM.value);
  var interest = parseFloat(form.Interest.value);

  var payment = calc_monthly_payment(interest, amount, periodY, periodM);
  var retam = calc_total_return_amount(payment, periodY, periodM);
  var PaymentID = document.getElementById("Payment");
  var RetAmount = document.getElementById("ReturnAmount");
  var Cur = document.forms.CalcForm.Currency.value;
  var a = ((retam / amount) * 100) - 100;
  PaymentID.innerHTML = sprintf("%3.2f %s", payment, Cur);
  RetAmount.innerHTML = sprintf("%3.2f %s (%3.2f + %3.2f&#037;)", retam, Cur, amount, a);
  return true;
}
