// -----JS CODE-----
// ScreenTransformToMaterialProperty.js
// Version: 0.0.1
// Event: Initialized
// Description: Convert screen transform's local point to screen point and apply that to a material property as vec2

// @input Component.ScreenTransform tracker
// @input Asset.Material material
// @input string property

var properties = ["x", "y", "z", "w"];
var pass;
var prop;
var init = false;

function initialize() {
    if (validateInputs()) {
        pass = script.material.mainPass;
        prop = script.property;
        init = true;
    }
}

function onUpdate() {
    if (!init) {
        return;
    }

    var screenPoint = script.tracker.localPointToScreenPoint(vec2.zero());
    var parentPoint = script.tracker.screenPointToParentPoint(screenPoint);

    pass[prop] = parentPoint;
}

function validateInputs() {
    if (!script.tracker) {
        showError("Please make sure main Object Tracking object exist and assign the Tracker object to the script.");
        return false;
    }
    if (!script.material) {
        showError("Please make assign a material to the script.");
        return false;
    }
    if (script.property == "") {
        showError("Material property name is not set.");
        return false;
    }
    if (script.material.mainPass[script.property] == undefined) {
        showError("Material " + script.material.name + " doesn't have a " + script.property + " property");
        return false;
    }
    if (!typeIsMatching(vec2.zero(), script.material.mainPass[script.property])) {
        showError("Material property needs to be vector2, Please select a pass that has a vector2 input.");
        return false;
    }
    return true;
}

// Print custom error logs
function showError(message) {
    print("ScreenTransformToMaterialProperty: ,ERROR: " + message);
}

function typeIsMatching(val, prop) {
    if (typeof val == "number" && typeof prop == "number") {
        return true;
    } else {
        var haveSameProperty = false;
        for (var i = 0; i < properties.length; i++) {
            if ((val[properties[i]] == undefined) == (prop[properties[i]] == undefined)) {
                if (val[properties[i]] != undefined) {
                    haveSameProperty = true;
                }
            } else {
                return false;
            }
        }
        return haveSameProperty; // have at least one matching property
    }
}

initialize();

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);