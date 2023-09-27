// ObjectRotationToValue.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Converts the object's rotation into different types of value 
// and lerp between the given values based on the rotation

// @input SceneObject rotatingObject
// @input float rotationMultiplier {"widget":"slider", "min":1.0, "max":10.0, "step":0.1}
//@ui {"widget":"separator"}
//@input int dataType = 0 {"label":"Convert Rotation To","widget":"combobox", "values":[{"label":"Int", "value": 0 }, {"label":"Float", "value": 1}, {"label":"Vec2", "value": 2}, {"label":"Vec3", "value": 3}, {"label":"Vec4", "value": 4}, {"label":"Color RGB", "value": 5}, {"label":"Color RGBA", "value": 6}]}
//@input int startInt = 0 {"showIf": "dataType", "showIfValue": 0, "label":"Remap Min To"}
//@input int endInt = 1 {"showIf": "dataType", "showIfValue": 0, "label":"Remap Max To"}
//@input float startFloat = 0 {"showIf": "dataType", "showIfValue": 1, "label":"Remap Min To"}
//@input float endFloat = 1.0 {"showIf": "dataType", "showIfValue": 1, "label":"Remap Max To"}
//@input vec2 startVector2 = {0,0} {"showIf": "dataType", "showIfValue": 2, "label":"Remap Min To"}
//@input vec2 endVector2 = {1,1} {"showIf": "dataType", "showIfValue": 2, "label":"Remap Max To"}
//@input vec3 startVector3 = {0,0,0} {"showIf": "dataType", "showIfValue": 3, "label":"Remap Min To"}
//@input vec3 endVector3 = {1,1,1} {"showIf": "dataType", "showIfValue": 3, "label":"Remap Max To"}
//@input vec4 startVector4 = {0,0,0,0} {"showIf": "dataType", "showIfValue": 4, "label":"Remap Min To"}
//@input vec4 endVector4 = {1,1,1,1} {"showIf": "dataType", "showIfValue": 4, "label":"Remap Max To"}
//@input vec3 startRGB = {0,0,0} {"showIf": "dataType", "showIfValue": 5, "label":"Remap Min To", "widget" : "color"}
//@input vec3 endRGB = {1,1,1} {"showIf": "dataType", "showIfValue": 5, "label":"Remap Max To", "widget" : "color"}
//@input vec4 startRGBA = {0,0,0,0} {"showIf": "dataType", "showIfValue": 6, "label":"Remap Min To", "widget" : "color"}
//@input vec4 endRGBA = {1,1,1,1} {"showIf": "dataType", "showIfValue": 6, "label":"Remap Max To", "widget" : "color"}
//@input int callbackType = 0 {"label": "On Update Callback", "widget":"combobox", "values":[{"label":"None", "value":0}, {"label":"Set API property", "value":1}, {"label":"Call API function", "value":2}, {"label":"Set Material Parameter", "value":3}], "bla" : "true"}
//@input Component.ScriptComponent propTargetScript {"showIf" : "callbackType", "showIfValue" : 1, "label" : "Script"}
//@input string propName {"showIf" : "callbackType", "showIfValue" : 1, "label" : "Name"}
//@input Component.ScriptComponent funcTargetScript {"showIf" : "callbackType", "showIfValue" : 2}
//@input string funcName {"showIf" : "callbackType", "showIfValue" : 2}
//@input Asset.Material material {"showIf" : "callbackType", "showIfValue" : 3}
//@input string materialScriptName = "baseColor" {"showIf" : "callbackType", "showIfValue" : 3, "label" : "Property"}

var properties = ["x", "y", "z", "w"];
var isInit = false;
var isGestureFound = false;

function initialize() {
    if (validateInputs()) {
        setInputs();
    }
}

function onUpdate() {
    if (!isInit || !isGestureFound) {
        return;
    }

    var angle = getZAngle(script.rotatingObject.getTransform());

    var normalizedDelta = getNormalized(angle);

    normalizedDelta = clamp(normalizedDelta, 0, 1);

    script.api.value = lerpValue(normalizedDelta);

    script.onUpdateCallback(script.api.value);
}

function onGestureFound() {
    isGestureFound = true;
}

function onGestureLost() {
    isGestureFound = false;
}

function getZAngle(transform) {
    var up = transform.right;
    var angle = Math.atan2(-up.y, up.x) * (180 / Math.PI);
    return angle * script.rotationMultiplier;
}

function getNormalized(input) {
    var normalized = (input + 180) / 360;
    return normalized;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function clamp(value, a, b) {
    return Math.max(Math.min(a, b), Math.min(value, Math.max(a, b)));
}

function lerpValue(t) {
    switch (script.dataType) {
        // Int
        case 0:
            return Math.round(lerp(script.startInt, script.endInt, t));
            // Float
        case 1:
            return lerp(script.startFloat, script.endFloat, t);
            // Vec2
        case 2:
            return vec2.lerp(script.startVector2, script.endVector2, t);
            // Vec3
        case 3:
            return vec3.lerp(script.startVector3, script.endVector3, t);
            // Vec4
        case 4:
            return vec4.lerp(script.startVector4, script.endVector4, t);
            // RGB
        case 5:
            return vec3.lerp(script.startRGB, script.endRGB, t);
            // RGBA
        case 6:
            return vec4.lerp(script.startRGBA, script.endRGBA, t);
    }
}

function getCallbackFunction() {

    switch (script.callbackType) {

        case (0):

            return null;

        case (1):
            if (script.propTargetScript == null) {
                print("ObjectDirectionValue, ERROR: Script Component is not set");
                break;
            }
            if (script.propName == "") {
                print("ObjectDirectionValue, ERROR: Property name is not set");
                break;
            }

            return function(v) {
                script.propTargetScript.api[script.propName] = v;
            };

        case (2):
            if (script.funcTargetScript == null) {
                print("ObjectDirectionValue, ERROR: Script Component is not set");
                break;
            }
            if (script.funcName == "") {
                print("ObjectDirectionValue, ERROR: Function name is not set");
                break;
            }
            return function(v) {
                script.funcTargetScript.api[script.funcName](v);
            };

        case (3):
            if (!script.material) {
                print("ObjectDirectionValue, ERROR: Material is not set");
                break;
            }
            if (script.materialScriptName == "") {
                print("ObjectDirectionValue, ERROR: Material property name is not set");
                break;
            }
            if (script.material.mainPass[script.materialScriptName] == undefined) {
                print("ObjectDirectionValue, ERROR: Material " + script.material.name + " doesn't have a " + script.materialScriptName + " property");
                break;
            }
            if (!typeIsMatching(script.api.value, script.material.mainPass[script.materialScriptName])) {
                print("ObjectDirectionValue, ERROR: Material " + script.material.name + " " + script.materialScriptName + " property does not match value type");
                break;
            }
            return function(v) {
                script.material.mainPass[script.materialScriptName] = v;
            };

    }
    return null;
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

function validateInputs() {
    if (!script.rotatingObject) {
        print("ObjectDirectionValue, ERROR: Please make sure main to assign an object to RotatingObject.");
        return false;
    }
    return true;
}

function setInputs() {
    script.api.onGestureFound = onGestureFound;
    script.api.onGestureLost = onGestureLost;
    script.api.value = lerpValue(0);
    script.onUpdateCallback = getCallbackFunction();
    isInit = true;
}

initialize();

var event = script.createEvent("UpdateEvent");
event.bind(onUpdate);