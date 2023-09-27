// -----JS CODE-----
//@input Component.Text textComponent

var elapsed = 0; // To keep track of the elapsed time in seconds

function onUpdate(eventData) {
    elapsed += eventData.getDeltaTime(); // Increase the elapsed time
    
    if (elapsed >= 5 && elapsed < 8) {
        script.textComponent.enabled = true;
        script.textComponent.text = "Give thumb up or thumb down to answer the student's question!";
    }
    else if (elapsed >= 8 && elapsed < 10) {
        script.textComponent.text = "";
    }
    else {
        script.textComponent.enabled = false;
    }
}

// Initially, set the text component to be hidden
script.textComponent.enabled = false;

// Bind the update function to the "UpdateEvent"
script.createEvent("UpdateEvent").bind(onUpdate);
