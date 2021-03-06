document.getElementById('spot-menu').setAttribute('style', currentPostion);
var myTextArea = document.getElementById("editor");

var json = {"color" : {
    "conditions" : {
        "${height} >= 200" : "color('#ffe5cc')",
        "${height} >= 150" : "color('#ffffcc')",
        "${height} >= 100" : "color('#e5ffcc')",
        "${height} >= 50" : "color('#ccffcc')",
        "${height} >= 20" : "color('#ccffe5')",
        "${height} >= 10" : "color('#ccffff')",
        "true" : "color('#cce5ff')"
    }
}
};
var text1 = JSON.stringify(json,null,2);
var myCodeMirror = CodeMirror.fromTextArea(myTextArea,{
    autoRefresh:true,
    mode:  "application/json",
    lineNumbers: true,
    autofocus:true
});
myCodeMirror.setValue('//当前样式:随高度改变颜色\n'+text1);

function saveStyle(){
    var content = myCodeMirror.getValue();
    var index = content.indexOf('{');
    content = content.slice(index);
    console.log(content);
    var color = JSON.parse(content);
    console.log(color);
    tileset.style = new Cesium.Cesium3DTileStyle(color);
}

var osm = Cesium.createOpenStreetMapImageryProvider({
    url : 'https://a.tile.openstreetmap.org/'
});
var viewer = new Cesium.Viewer('cesiumContainer', {
    scene3DOnly : true,
    baseLayerPicker:false,
    imageryProvider:osm,
    vrButton:true
});

var btn = document.createElement('button');
btn.setAttribute('type','button');
btn.setAttribute('title','Style');
btn.setAttribute('data-toggle','modal');
btn.setAttribute('data-target','#myModal');
btn.setAttribute('class','cesium-button cesium-toolbar-button');
document.getElementsByClassName('cesium-viewer-toolbar')[0].appendChild(btn);

var btn1 = document.createElement('button');
btn1.setAttribute('type','button');
btn1.setAttribute('title','homeview');
btn1.setAttribute('class','cesium-button cesium-toolbar-button');
document.getElementsByClassName('cesium-viewer-toolbar')[0].appendChild(btn1);
btn1.setAttribute('onclick','homeview()');

function homeview(){
    viewer.camera.setView({
        orientation : {
            //direction : new Cesium.Cartesian3(0.33506436388093397, 0.7178758873584659, 0.6102344487214404),
            //up : new Cesium.Cartesian3(0.27649053726026684, -0.6940744040291643, 0.6646906833084766),
            heading :Cesium.Math.toRadians(0),
            pitch :Cesium.Math.toRadians(-90.0),
            roll : 0
        }
    });
    viewer.scene.camera.flyHome(viewer.duration);
}

viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo){
    //Zoom to custom extent
    if(viewer.camera.position!=new Cesium.Cartesian3(978702.4032039205, -5664708.285048889, 2754623.305272117)){
        viewer.camera.flyTo({
            destination: new Cesium.Cartesian3(978702.4032039205, -5664708.285048889, 2754623.305272117),
            orientation: {
                // direction : new Cesium.Cartesian3(0.33506436388093397, 0.7178758873584659, 0.6102344487214404),
                //up : new Cesium.Cartesian3(0.27649053726026684, -0.6940744040291643, 0.6646906833084766),
                heading: Cesium.Math.toRadians(0.0), // 方向
                pitch: Cesium.Math.toRadians(-90.0),// 倾斜角度
                roll: 0
            },
            pitchAdjustHeight: 2000,
             complete: function () {
                 // 到达位置后执行的回调函数
                     viewer.camera.moveUp();
                     var center = new Cesium.Cartesian3(978702.4032039205, -5664708.285048889, 2754623.305272117);
                     var heading = Cesium.Math.toRadians(0);
                     var pitch = Cesium.Math.toRadians(-20.0);
                     var range = 50.0;
                     viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
             }
        });
    }
//Tell the home button not to do anything.
    commandInfo.cancel = true;
});
var scene = viewer.scene;
scene.fog.enabled = false;
scene.debugShowFramesPerSecond = true;


function loadTileset(url) {
    var tileset;
    if (Cesium.defined(tileset)) {
        scene.primitives.remove(tileset);
    }
    tileset = scene.primitives.add(new Cesium.Cesium3DTileset({
        url : url,
        debugShowStatistics : true,
        maximumNumberOfLoadedTiles : 3
    }));

    return tileset.readyPromise.then(function(tileset) {
        // var boundingSphere = tileset.boundingSphere;
        // viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
        // viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        viewer.camera.setView({
            destination : new Cesium.Cartesian3(978703.4032039205, -5664709.285048889, 2754627.305272117),
            orientation : {
                direction : new Cesium.Cartesian3(0.33506436388093397, 0.7178758873584659, 0.6102344487214404),
                up : new Cesium.Cartesian3(0.27649053726026684, -0.6940744040291643, 0.6646906833084766)
            }
        });
        var properties = tileset.properties;
        if (Cesium.defined(properties) && Cesium.defined(properties.height)) {
            tileset.style = new Cesium.Cesium3DTileStyle({
                //              "color" : "color('#BAA5EC')",
                //              "color" : "color('cyan', 0.5)",
                //              "color" : "rgb(100, 255, 190)",
                //              "color" : "hsla(0.9, 0.6, 0.7, 0.75)",
                "color" : {
                    "conditions" : {
                        "${height} >= 200" : "color('#ffe5cc')",
                        "${height} >= 150" : "color('#ffffcc')",
                        "${height} >= 100" : "color('#e5ffcc')",
                        "${height} >= 50" : "color('#ccffcc')",
                        "${height} >= 20" : "color('#ccffe5')",
                        "${height} >= 10" : "color('#ccffff')",
                        "true" : "color('#cce5ff')"
                    }
                },
                //              "show": false
                //              "show" : "${Height} >= 0",
                "meta" : {
                    "description" : "'Building id ${id} has height ${height}.'"
                }
            });
            // addStyleUI()
            var spotbtn=document.createElement('button');
            spotbtn.setAttribute('class','spot-button');
            var spotlabel=document.createElement('label');
            spotlabel.innerHTML = 'Miami';
            spotbtn.appendChild(spotlabel);
            document.getElementById('spot-menu').appendChild(spotbtn);
            var target = tileset.boundingSphere.center;
            spotbtn.addEventListener('click', function () {
                viewer.camera.flyTo({
                    destination : target,
                    orientation : {
                        direction: new Cesium.Cartesian3(0.33506436388093397, 0.7178758873584659, 0.6102344487214404),
                        up: new Cesium.Cartesian3(0.27649053726026684, -0.6940744040291643, 0.6646906833084766)
                    }
                });
            })
        }

        tileset.loadProgress.addEventListener(function(numberOfPendingRequests, numberProcessing) {
            if ((numberOfPendingRequests === 0) && (numberProcessing === 0)) {
                //console.log('Stopped loading');
                return;
            }

            //console.log('Loading: requests: ' + numberOfPendingRequests + ', processing: ' + numberProcessing);
        });

        tileset.tileUnload.addEventListener(function(tile) {
            //console.log('Tile unloaded.')
        });
    });
}


var canvas = viewer.canvas;
canvas.setAttribute('tabindex', '0');
canvas.onclick = function() {
    canvas.focus();
};

var handler = new Cesium.ScreenSpaceEventHandler(canvas);

var pickingEnabled = true;
var flags = {
    // Mouse
    leftDown : false,
    middleDown : false,
    rightDown : false,
    annotate : false
};

handler.setInputAction(function(movement) {
    flags.leftDown = true;
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

handler.setInputAction(function(movement) {
    flags.middleDown = true;
}, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

handler.setInputAction(function(movement) {
    flags.rightDown = true;
}, Cesium.ScreenSpaceEventType.RIGHT_DOWN);

handler.setInputAction(function(movement) {
    flags.leftDown = false;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

handler.setInputAction(function(movement) {
    flags.middleDown = false;
}, Cesium.ScreenSpaceEventType.MIDDLE_UP);

handler.setInputAction(function(movement) {
    flags.rightDown = false;
}, Cesium.ScreenSpaceEventType.RIGHT_UP);

document.addEventListener('keyup', function(e) {
    if (e.keyCode === 'W'.charCodeAt(0)) {
        flags.annotate = !flags.annotate;
    }
}, false);

var current = {
    feature : undefined,
    originalColor : new Cesium.Color()
};

var HIGHLIGHT_COLOR = new Cesium.Color(1.0, 1.0, 0.0, 0.4);

// Highlight feature on mouse over
handler.setInputAction(function(movement) {
    if (!pickingEnabled) {
        return;
    }

    if (flags.leftDown || flags.middleDown || flags.rightDown) {
        // Don't highlight when panning and zooming
        return;
    }

    var pickedFeature = scene.pick(movement.endPosition);
    if (Cesium.defined(current.feature) && (current.feature !== pickedFeature)) {
        // Restore original color to feature that is no longer selected

        // This assignment is necessary to work with the set property
        current.feature.color = Cesium.Color.clone(current.originalColor, current.feature.color);
        current.feature = undefined;
    }

    if (Cesium.defined(pickedFeature) && (pickedFeature !== current.feature)) {
        // For testing re-evaluating a style when a property changes
        //      pickedFeature.setProperty('id', 1);

        current.feature = pickedFeature;
        Cesium.Color.clone(pickedFeature.color, current.originalColor);

        // Highlight newly selected feature
        pickedFeature.color = Cesium.Color.clone(HIGHLIGHT_COLOR, pickedFeature.color);
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

var annotations = scene.primitives.add(new Cesium.LabelCollection());

var infobox = new Cesium.Entity('Title to put in the infobox');

handler.setInputAction(function(movement) {
    if (!pickingEnabled) {
        return;
    }

    var feature = current.feature;
    if (Cesium.defined(feature)) {
        var str = '';
        viewer.entities.remove(infobox);
        var properties = feature.primitive.properties; // get properties from tileset
        if (Cesium.defined(properties)) {
            for (var name in properties) {
                if (properties.hasOwnProperty(name)) {
                    console.log(name + ': ' + feature.getProperty(name));
                    str=str+'<tr><th style="width:120px;font-weight:bold;">'+name+'</th><th style="font-weight:normal;">'+feature.getProperty(name)+'</th></tr>'
                }
            }
        }

        var title = feature.getProperty('name');
        var tid = feature.getProperty('TARGET_FID');
        infobox.name = (title !== ' ')?(title):(tid);
        infobox.description = {
            getValue : function() {
                return '<table style="text-align:left">'+str+'</table>';
            }
        };
        viewer.entities.add(infobox);
        viewer.selectedEntity = infobox;
        // evaluate feature description
        if (Cesium.defined(tileset.style.meta.description)) {
            console.log("Description : " + tileset.style.meta.description.evaluate(feature));
        }

        feature.setProperty('clicked', true);

    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function(movement) {
    if (!pickingEnabled) {
        return;
    }

    if (flags.annotate) {
        // Add annotation showing the height at the click location
        annotate(movement);
    } else {
        // When a feature is double clicked, zoom to it
        zoom(movement);
    }
}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

function annotate(movement) {
    if (Cesium.defined(current.feature) && scene.pickPositionSupported) {
        var cartesian = scene.pickPosition(movement.position);
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var height = cartographic.height.toFixed(2) + ' m';

        annotations.add({
            position : cartesian,
            text : height,
            horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            eyeOffset : new Cesium.Cartesian3(0.0, 0.0, -1.0)
        });
    }
}

function offsetFromHeadingPitchRange(heading, pitch, range) {
    pitch = Cesium.Math.clamp(pitch, -Cesium.Math.PI_OVER_TWO, Cesium.Math.PI_OVER_TWO);
    heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO;

    var pitchQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Y, -pitch);
    var headingQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -heading);
    var rotQuat = Cesium.Quaternion.multiply(headingQuat, pitchQuat, headingQuat);
    var rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat);

    var offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X);
    Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset);
    Cesium.Cartesian3.negate(offset, offset);
    Cesium.Cartesian3.multiplyByScalar(offset, range, offset);
    return offset;
}

function zoom(movement) {
    var feature = current.feature;
    if (Cesium.defined(feature)) {
        var longitude = feature.getProperty('Longitude');
        var latitude = feature.getProperty('Latitude');
        var height = feature.getProperty('Height');

        if (!Cesium.defined(longitude) || !Cesium.defined(latitude) || !Cesium.defined(height)) {
            return;
        }

        var positionCartographic = new Cesium.Cartographic(longitude, latitude, height * 0.5);
        var position = scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);

        var camera = scene.camera;
        var heading = camera.heading;
        var pitch = camera.pitch;

        var offset = offsetFromHeadingPitchRange(heading, pitch, height * 2.0);

        var transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        Cesium.Matrix4.multiplyByPoint(transform, offset, position);

        camera.flyTo({
            destination : position,
            orientation : {
                heading : heading,
                pitch : pitch
            },
            easingFunction : Cesium.EasingFunction.QUADRATIC_OUT
        });
    }
}

//When a feature is double middle clicked, hide it
// handler.setInputAction(function(movement) {
// if (!pickingEnabled) {
// return;
// }

// if (Cesium.defined(current.feature)) {
// current.feature.show = false;
// }
// }, Cesium.ScreenSpaceEventType.MIDDLE_DOUBLE_CLICK);

///////////////////////////////////////////////////////////////////////////////


// Styling ////////////////////////////////////////////////////////////////////

var styleElements = [];
var numberofColors = 6;
var currentPropertyName = 'Height';

function getRandomColor() {
    var color = Cesium.Color.fromRandom();
    color.alpha = 1.0;
    return color.toCssColorString();
}

function styleFunction(name) {
    var conditions = {};
    var intervalSize = Math.floor(100/numberofColors);
    for (var i = numberofColors; i >= 0; --i) {
        var cond = '${' + name + '} > ' + (i * intervalSize);
        conditions[cond] = getRandomColor();
    }
    conditions['true'] = getRandomColor();

    tileset.style = new Cesium.Cesium3DTileStyle({
        color : {
            conditions : conditions
        },
        show : '${' + name + '} >= 0'
    });

    currentPropertyName = name;
}

function getStyleFunction(name) {
    return function() {
        styleFunction(name);
    };
}

var dataurl = ["./data/Scene", "./data/Miami"];
loadTileset(dataurl[0]);
loadTileset(dataurl[1]);
///////////////////////////////////////////////////////////////////////////////