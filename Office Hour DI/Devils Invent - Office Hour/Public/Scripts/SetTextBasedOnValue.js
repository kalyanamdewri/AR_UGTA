// SetTextBasedOnValue.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Set airplane speed text with min and max

// @input Component.Text text
// @ui {"widget":"separator"}
// @ui {"widget":"group_start", "label":"Minimum Speed"}
// @input int minSpeed
// @input string minMessage
// @input vec4 minColor {"widget":"color"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Maximum Speed"}
// @input int maxSpeed
// @input string maxMessage
// @input vec4 maxColor {"widget":"color"}
// @ui {"widget":"group_end"}

var originTextColor;
var unit = "km/h";

if (script.text) {
    originTextColor = script.text.textFill.color;
}

script.api.setTextValue = function(value) {
    var round = Math.round(value);
    var ranged = getRanged(round, script.minSpeed, script.maxSpeed);
    var textOutput = "";
    var color;

    if (ranged == script.minSpeed) {
        textOutput = script.minMessage;
        color = script.minColor;
    } else if (ranged == script.maxSpeed) {
        textOutput = script.maxMessage;
        color = script.maxColor;
    } else {
        textOutput = ranged + unit;
        color = originTextColor;
    }

    if (script.text) {
        script.text.text = textOutput;
        script.text.textFill.color = color;
    }
};

function getRanged(currentValue, min, max) {
    currentValue = (currentValue > max) ? max : currentValue;
    currentValue = (currentValue < min) ? min : currentValue;
    return currentValue;
}