# Mortgage Calculator Changes Log

mcalc 0.5.2 (2021-06-13)
------------------------------------------------------------------------------
* _New_: Add [JSDoc](https://jsdoc.app/) documentation of sources
* _New_: Add columns with interest rate and taxes rate to make amortization
       table clearer
* _Fix_: Calculation of *total amount returned* was wrongly including monthly
       taxes (if any) for all installments, but the last one. The bug dates
       back to 2013-08-24 (version [0.5.0](#mcalc-050-2015-08-27)) and was
       introduced with the implementation of annual, monthly and one-time taxes
       (see bug [144](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=144))
* _Fix_: Spelling errors in sources and text. Some code lint
* _Change_: Change URL scheme from http to https on all links

mcalc 0.5.1 (2019-02-17)
------------------------------------------------------------------------------
* _Fix_: Update speech style sheet for conformance with CSS 3 specification and
       so it validates without errors and warnings
* _Fix_: Move tab order on the buttons (was on the image instead)

mcalc 0.5.0 (2015-08-27)
------------------------------------------------------------------------------
This is major new release, including many new features and several bug fixes.
* _New_: Possibility for calculation with one-time, yearly and monthly taxes (see
       bug [144](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=144))
* _New_: Possibility for calculation with several interest rates for different
       periods (see bugs [145](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=145)
       and [153](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=153))
* _New_: Option to calculate periodical taxes on the last installment of the
       period (see bug [151](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=151))
* _New_: Display total amount of interest to be paid (see bugs
       [82](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=82) and
       [152](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=152))
* _New_: Alternatively enable/disable inputs for amount or payment (see bug
       [162](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=162))
* _New_: Improved print layout (see bug
       [155](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=155))
* _New_: HTML source is now in HTML5 (see bug
       [161](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=161))
* _New_: The calculator now has icon (see bug
       [163](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=163))
* _Fix_: Results of calculation were not cleared on reset (see bug
       [147](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=147))
* _Fix_: JavaScript issues in Chrome with default function argument and script
       defer on loading (see bug
       [154](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=154))
* _Fix_: Amortization table appeared mangled in InternetExplorer (see bug
       [156](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=156))
* _Fix_: Move DOCTYPE and charset definitions in the beginning to avoid quirks
       mode of InternetExplorer (see bug
       [159](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=159))

mcalc 0.2.5 (2011-03-15)
------------------------------------------------------------------------------
This release includes just one fix found by Ivan Mednev.
* Fix a wrong calculation with numbers higher than "999 999.99" (see bug
  [126](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=126))

mcalc 0.2.4 (2006-12-07)
------------------------------------------------------------------------------
* Fixed program and version information on all files

mcalc 0.2.3 (2006-12-06)
------------------------------------------------------------------------------
* The 'table' is now referred as 'amortization plan'
* The calculate button can now be activated both with the mouse and
  the keyboard
* Fixed HTML syntax warnings

mcalc 0.2.2 (2006-03-03)
------------------------------------------------------------------------------
* Now the final amount will always be zero (see bug
  [20](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=20))
* Respectively the return amount calculation is updated (see bug
  [21](https://sotirov-bg.net/bugzilla/show_bug.cgi?id=21))

mcalc 0.2.1 (2006-02-16)
------------------------------------------------------------------------------
* Initial public release

