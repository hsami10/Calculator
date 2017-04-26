/*UNUSED FILE. OLD JAVASCRIPT FILE WHICH I DISCARDED*/

/*TO-DO LIST:
    - FIX DIVISION
    - FIX OPERATION OF LARGE NUMBERS. CAN'T JUST DISPLAY 'ERROR' EVERYTIME
    - FACILITATE MULTIPLE OPERATIONS AT ONCE (maybe use arrays)
DONE:
    - FIX SQUARE ROOT LARGE NUMBERS SHOW ERROR PROBLEM
    - DISABLE TEXT HIGHLIGHTING ON CALCULATOR
*/

$(document).ready(function(){
    $("#calculator").addClass("animated zoomInDown");
    // $("#calculator").addClass("animated fadeInDown");

    //tests the length of the number and adjusts it to fit the screen
    var testNumLength = function(number) {
        if (number.length > 10) {
            totaldiv.text(number.substr(number.length-10,10));
            if (number.length > 17) {
                number = "";
                totaldiv.text("error");
            }
        }
    }

    //get everything after decimal point in a string
    //if no decimal, then it will return the original string
    var getDigitsAfterDec = function(number) {
        number = number.slice(number.indexOf(".") + 1);
        return number;
    }

    var number = "";
    var oldnumber = "";
    var operator = "";
    var totaldiv = $("#total");
    var numOfDecs = 0;
    totaldiv.text("0");

    //if the numbers are clicked, set number equal to that number and display it
    $("#numbers a").not("#clear,#clearall").click(function() {
        number += $(this).text();
        totaldiv.text(number);
        testNumLength(number);
    });

    //if operators except decimal and equals are clicked
    $("#operators a, #side a").not("#equals,#decimal").click(function() {
       numOfDecs = 0; //set num of decimals counted to 0 to get ready for next num
       operator = $(this).text(); //get text on operator
       var operatorId = $(this).attr("id"); //get id on operator

        //sqrt works on one number so trigger equals button
        if (operatorId === "sqrt") {
            operator = "sqrt";
            $("#equals").trigger("click");
            return;
        }
        //comparisons with '&divide;' etc in 'equals' handler were not working,
        //so had to give ids and use those
        else if (operatorId === "divide") {
            operator = '&divide;';
        } //same as above, but with multiplication
        else if (operatorId === "multiply") {
            operator = '&times;';
        }
        else if (operator === "-") {
            if (number === "") {
                number += operator;
                totaldiv.text(number);
                return;
            }
        }

        oldnumber = number;
        number = "";
        totaldiv.text("0");
    });

    //if the decimal button is clicked
    $("#decimal").click(function() {
        for (var x=0 ; x<number.length ; x++) {
            if (number.charAt(x) === ".")
                numOfDecs++;
        }
        if (numOfDecs === 0)
            number += ".";

        totaldiv.text(number);
        testNumLength(number);
    })

    //if the clear and clearall buttons are clicked. clear just clears current num
    //clearall clears the previous num too, i.e, oldnumber
    //also set numOfDecs back to 0
    $("#clear,#clearall").click(function(){
        number = "";
        totaldiv.text("0");
        numOfDecs = 0;
        if ($(this).attr("id") === "clearall")
            oldnumber = "";

    });

    //NOTE: try changing below expressions to eval later.

    //if the equals button is clicked
    $("#equals").click(function(){
        var length1 = oldnumber.length;
        var length2 = number.length;

        var decDigits1 = getDigitsAfterDec(oldnumber); //decimal digits in oldnumber
        var decDigits2 = getDigitsAfterDec(number); //decimal digits in number

        //check for each operator, parse float first, perform operation, toString it.
        if (operator === "+") {
            //if any of the numbers actually has decimal digits in them, return answer to that num of digits
            if (decDigits1 !== oldnumber || decDigits2 !== number)
                number = (parseFloat(oldnumber) + parseFloat(number)).toFixed(Math.max(decDigits1.length, decDigits2.length));
            //if not, then simple math
            else
                number = parseFloat(oldnumber) + parseFloat(number);
        }
        else if (operator === "-") {
             //if any of the numbers actually has decimal digits in them, return answer to that num of digits
            if (decDigits1 !== oldnumber || decDigits2 !== number)
                number = (parseFloat(oldnumber) - parseFloat(number)).toFixed(Math.max(decDigits1.length, decDigits2.length));
            //if not, then simple math
            else
                number = parseFloat(oldnumber) - parseFloat(number);
        }
        else if (operator === "&divide;") {
            number = (parseFloat(oldnumber, 10) / parseFloat(number,10)).toString(10);
        }
        else if (operator === "&times;") {
            //different cases depending on if one or both or none have decimals
            //HELPFUL USE: nums with digs multiplied together give answer with num1.digits+num2.digits many digits
            if (decDigits1 !== oldnumber && decDigits2 !== number)
                number = (parseFloat(oldnumber) * parseFloat(number)).toFixed(decDigits1.length + decDigits2.length);
            else if (decDigits1 !== oldnumber)
                number = (parseFloat(oldnumber) * parseFloat(number)).toFixed(decDigits1.length);
            else if (decDigits2 !== number)
                number = (parseFloat(oldnumber) * parseFloat(number)).toFixed(decDigits2.length);
            else
                number = (parseFloat(oldnumber) * parseFloat(number)).toString();
        }
        else if (operator === "sqrt") {
            number = Math.sqrt(parseFloat(number)).toString(10);
            if (number.length > 10)
                number = number.slice(0, 10); //this will take indexes 0-9
        }
        else if (operator === "^") {
            number = Math.pow(parseFloat(oldnumber), parseFloat(number)).toString(10);
        }

        //if user is naughty and program returns NaN, output 'syntax error'
        if (isNaN(number))
            number = "syntax err";

        totaldiv.text(number); //set total's(screen) text to evaluated expression
        testNumLength(number); //test its length
        number = "";
        oldnumber = "";
        numOfDecs = 0; //set this to 0 because it wont insert decimal even when theres none before it
    });
});