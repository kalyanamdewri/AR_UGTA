// -----JS CODE-----
//@input Component.ObjectTracking centerTracker
//@input Component.ObjectTracking thumbTracker
//@input Component.ObjectTracking tracker
//@input Component.Image graphImage
//@input Component.Image TupImage
//@input Component.Image TdownImage
//@input SceneObject dgraph
print("loaded");

function triggerResponseOpen() {
       print("Open Hand Gesture Detected");
script.graphImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
script.TdownImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
script.TupImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
    script.dgraph.enabled = true;

};
script.tracker.registerDescriptorStart("open", triggerResponseOpen);

function triggerResponseClose() {
       print("Close Hand Gesture Detected");
script.graphImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
script.TdownImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
script.TupImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
script.dgraph.enabled = false;
};
script.tracker.registerDescriptorStart("close", triggerResponseClose);

function triggerResponseThumb() {
       print("Thumb Hand Gesture Detected");
    script.graphImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
      var center = script.centerTracker.getTransform().getWorldPosition();
      var thumb = script.thumbTracker.getTransform().getWorldPosition();
    var dif = center.y - thumb.y;
    print(dif);
    if(dif>0){
        script.graphImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
        script.TdownImage.mainPass.baseColor = new vec4(1, 1, 1, 1);
        script.TupImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
            script.dgraph.enabled = false;

    }else{
        script.graphImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
        script.TdownImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
        script.TupImage.mainPass.baseColor = new vec4(1, 1, 1, 1);
            script.dgraph.enabled = false;

    }

};
script.tracker.registerDescriptorStart("thumb", triggerResponseThumb);