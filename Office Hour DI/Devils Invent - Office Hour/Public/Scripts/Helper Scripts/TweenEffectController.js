// -----JS CODE-----
// TweenEffectController.js
// Version: 0.0.1
// Event: Initialized
// Description: Controls the playing of the tween

// @ui {"widget":"group_start", "label":"Action 01"}
// @input string[] actionOneTriggers {"label":"Triggers"}
// @input SceneObject actionOneTween {"label":"Tween Object"}
// @input string actionOneTweenName {"label":"Tween Name"}
// @ui {"widget":"group_end"}

// @ui {"widget":"group_start", "label":"Action 02"}
// @input string[] actionTwoTriggers {"label":"Triggers"}
// @input SceneObject actionTwoTween {"label":"Tween Object"}
// @input string actionTwoTweenName {"label":"Tween Name"}
// @ui {"widget":"group_end"}

var curAction = null;

function ActionConfig(tweenObj, tweenName, triggerNames) {
    this.tweenObj = tweenObj;
    this.tweenName = tweenName;
    this.triggerNames = triggerNames;
}

function validateInputs() {
    if (!global.behaviorSystem) {
        print("TweenEffectController: ,ERROR: Behavior script not found. You cannot send custom triggers without Behavior Script.");
        return false;
    }

    var actionConfigs = [
        new ActionConfig(script.actionOneTween, script.actionOneTweenName, script.actionOneTriggers),
        new ActionConfig(script.actionTwoTween, script.actionTwoTweenName, script.actionTwoTriggers),
    ];

    for (var i = 0; i < actionConfigs.length; i++) {
        if (!actionConfigs[i].tweenObj) {
            print("TweenEffectController: ,ERROR: Please assign an object with tween script on it to Action " + (i + 1) + " Tween Object");
            return false;
        }
    }

    for (var j = 0; j < actionConfigs.length; j++) {
        setTriggers(actionConfigs[j]);
    }

    // Make sure that we're not zooming out if it's not zoomed
    curAction = actionConfigs[1];
}

function setTriggers(actionConfig) {
    var actionNames = actionConfig.triggerNames;
    if (actionNames.length == 0) {
        return;
    }
    var responseFunc = function() {
        if (curAction != actionConfig) {
            if (curAction) {
                global.tweenManager.stopTween(curAction.tweenObj, curAction.tweenName);
            }
            global.tweenManager.startTween(actionConfig.tweenObj, actionConfig.tweenName);
            curAction = actionConfig;
        }
    };
    for (var i = 0; i < actionNames.length; i++) {
        global.behaviorSystem.addCustomTriggerResponse(actionNames[i], responseFunc);
    }
}

validateInputs();