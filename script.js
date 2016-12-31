/*
TO-DO LIST:

DONE:
    - FIX RADICAL SYMBOL. IT'S TOO BIG.
    - fix deleting and readding a number problem, when dealing with sqrt and power. Lines 63-67.
    - when you press delete on &radic; symbol, it only takes away the ';'. Fix in both display and eval.
    - testnumlength treats radic sign as 7 letters. fix that.
    - number rounding is weird. 2.44948974  rounds to 2.4. FIX IT!!
    - FIX SQUARE ROOT. IT DOESNT WORK IF ITS THE LAST OPERATION.
    - FIX POWER OPERATION. SAME PROBLEM AS ABOVE
    - FIX SQUARE ROOT. LARGE NUMBERS SHOW ERROR PROBLEM
    - DISABLE TEXT HIGHLIGHTING ON CALCULATOR
    - A LOT OF OTHER PROBLEMS I FORGOT TO TYPE HERE
*/

$(document).ready(function(){
    // $("#calculator").addClass("animated zoomInDown");
    // $("#calculator").addClass("animated fadeInDown");

    //tests the length of the expression and adjusts it to fit the screen
    var testNumLength = function(exp) {
        /*Fix the prob that &radic; counts as 7 chars when counting to display*/
        //set | to represent &radic; so it counts as 1 char.
        exp = exp.replace(/&radic;/g, "|"); //replace all instances

        console.log(exp + " -- " + expression);
        if (exp.length > 10) {
            var textShow = exp.substr(exp.length-10);
            totaldiv.html(textShow.replace(/\|/g, "&radic;"));
            if (exp.length > 25) {
                exp = "";
                totaldiv.html("limit reached");
            }
        }
    }

    console.log();

    //get everything after decimal point in a string
    //if no decimal, then it will return the original string
    var getDigitsAfterDec = function(number) {
        number = number.slice(number.indexOf(".") + 1);
        return number;
    }

    var number = ""; //stores number input from user
    // var oldnumber = "";
    var expression = ""; //the expression to be evaluated
    var displayExp = "";
    var operator = ""; //stores operator input from user
    var operatorId = "";
    var totaldiv = $("#total");
    var numOfDecs = 0;
    totaldiv.html("0");

    //if the numbers are clicked, set number equal to that number and display it
    $("#numbers a").not("#delete,#clearall").click(function() {
        number += $(this).html();
        displayExp += $(this).html();
        totaldiv.html(displayExp);
        testNumLength(displayExp);

        var lastInExp = expression.substr(-1);
        if (!isNaN(lastInExp) && lastInExp !== " ") {
            number = lastInExp + number;
            expression = expression.slice(0, -1)
        }
    });

    //if operators except decimal and equals are clicked
    $("#operators a, #side a").not("#equals,#decimal").click(function() {
        //this checks if the previous operator id was sqrt/sq rather than "". if it is,
        //then it completes the brackets by entering numbers since those two functions
        //require different treatment than others. Remember we left string halfway last time.
        if (operatorId === "sqrt" || operatorId === "sq") {
            expression += number + ")";
            number = "";
        }

        numOfDecs = 0; //set num of decimals counted to 0 to get ready for next num
        operator = $(this).html(); //get text on operator
        operatorId = $(this).attr("id"); //get id on operator

        /*
        The if statements below:
        1 - the first part updates the expression to be evaluated by the program
        2 - the second part updates the string to be displayed on interface.
        */
        if (operatorId === "sqrt") {
            operator = "Math.sqrt(";
            expression += operator;
            number = "";

            displayExp += "&radic;";
            totaldiv.html(displayExp);
            testNumLength(displayExp);
        }
        else if (operatorId === "sq") {
            operator = "Math.pow(" + number + ", ";
            expression += operator;
            number = "";

            displayExp += "^";
            totaldiv.html(displayExp);
            testNumLength(displayExp);
        }

        //have to do this after dealing with power and sqrt cuz we nned to use
        //Math.pow and .sqrt fcns, so can't just append.
        expression += number; //append number to expression
        number = ""; //set number to empty again

        /*
        The following ifs set operator/operatorId to "" cuz we don't need them anymore.
        In the previous ifs, we did not reset them cuz we need them again to complete exp.
        */
        if (operatorId === "divide") {
            operator = "/";
            expression += operator;
            operator = "", operatorId = "";

            displayExp += "/";
            totaldiv.html(displayExp);
            testNumLength(displayExp);
        }
        else if (operatorId === "multiply") {
            operator = "*";
            expression += operator;
            operator = "", operatorId = "";

            displayExp += "*";
            totaldiv.html(displayExp);
            testNumLength(displayExp);
        }
        else if (operator === "+" || operator === "-") {
            expression += operator;

            displayExp += operator;
            totaldiv.html(displayExp);
            testNumLength(displayExp);

            operator = "", operatorId = "";
        }
    });

    //if the decimal button is clicked
    $("#decimal").click(function() {
        for (var x=0 ; x<number.length ; x++) {
            if (number.charAt(x) === ".")
                numOfDecs++;
        }
        if (numOfDecs === 0) {
            number += ".";
            displayExp += ".";
        }

        totaldiv.html(displayExp);
        testNumLength(displayExp);
    })

    //if the delete/clearall buttons are clicked. delete just deletes current num
    //clearall clears the previous num too, i.e, oldnumber also set numOfDecs back to 0
    $("#delete, #clearall").click(function(){
        /*when DEL is pressed, remove last entered button*/
        //change EXPRESSION TO BE EVALUATED: remove last item in expression

        if (number === "") { //if number = empty/operator != empty so take last off of exp
            var lastChar = expression.substr(-1);
            if (lastChar === ")") {
                //e.g: Math.sqrt(9). take out 9). works for both sqrt annd power
                expression = expression.slice(0, expression.length - 2);
                operatorId = "sqrt"; //doesn't matter if its sqrt or sq. same thing/consequence
            }
            else if (lastChar === "(") {
                //e.g: Math.sqrt(. take out the whole exp. Just for sqrt.
                expression = expression.slice(0, expression.length-10);
                operatorId = ""; //so that program does not add ) again.
            }
            else if (lastChar === " ") {
                //e.g: Math.pow(23, . take out everything except the num 2. Just for power function.
                expression = expression.slice(0, expression.length-2); //now Math.pow(23
                var lastNum = expression.match(/[0-9]+(?!.*[0-9])/)[0]; //lastNum = 23. Get first item in
                                                                        //array containing last numbers
                //cut off all of Math.pow(23 from expression
                expression = expression.slice(0, expression.length-lastNum.length-9);
                expression += lastNum; //now add back 23 so we don't lose the number.
                operatorId = "";
            }
            else //if it's none of those, then just take off the last item in the expression.
                expression = expression.slice(0, -1);
        }
        else //if number is not empty, take last off of number
            number = number.slice(0, -1);

        //change DISPLAY STRING
        //convert &radic; to '|' representation -> perform delete -> convert back
        displayExp = displayExp.replace(/&radic;/g, "|");
        //change display: remove last item in display and convert &radic; back if it exists
        displayExp = displayExp.slice(0, -1).replace(/\|/g, "&radic;");

        console.log(displayExp + " -- " + expression);
        totaldiv.html(displayExp);
        numOfDecs = 0;

        if ($(this).attr("id") === "clearall") {
            totaldiv.html("0");
            displayExp = "";
            number = "";
            expression = "";
            operator = "";
            operatorId = "";
            console.log("--------------"); //line break, so more readable on console.
        }
    });

    //if the equals button is clicked
    $("#equals").click(function(){
        if (operatorId === "sqrt" || operatorId === "sq") {
            expression += number + ")";
            number = "";
        }

        expression += number;
        number = "";
        console.log(expression);

        //NOTE: eval converts num/string expressions into number results
        var result = eval(expression); //EVALUATION OCCURS HERE!!
        console.log(result);

        if (result.toString().length > 10) {
            result = result.toPrecision(7); //set precision to 6 originally

            //if number contains 'e', get everything including and after the 'e':
            //get the length of that string, and set the precision of
            //result to be 9 - length. so that it can display properly.
            if (result.indexOf("e") !== -1) {
                var subst = result.substring(result.indexOf("e"));
                // console.log(subst, subst.length);
                result = Number(result).toPrecision(9 - subst.length);
                // console.log(result);
            }
        }

        //if user is naughty and program returns NaN, output 'syntax error'
        if (isNaN(result))
            result = "syntax err";

        totaldiv.html(result.toString()); //set total's(screen) text to evaluated expression
        testNumLength(result.toString()); //test its length
        expression = result.toString(); //now expression is = result so can do operations on that
        displayExp = result.toString(); //convert back to string cause result is a num
        operatorId = "";
        result = "";
        numOfDecs = 0; //set this to 0 because it wont insert decimal even when theres none before it
    });
});










