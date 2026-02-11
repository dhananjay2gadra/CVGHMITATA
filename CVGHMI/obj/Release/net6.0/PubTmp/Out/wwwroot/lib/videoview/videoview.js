function checksession(clientid,channelno) {

    fetch('/data/Getvideosession', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            alert(data);
            let checked = false;
            if (data == null || data.length == 0) {
                checked = false;
            }
            else {
                data.forEach(item => {
                    if (item.clientid === clientid && item.channel == channelno) {
                        //alert('videosession is already requested');
                        checked = true;
                    }
                });
            }


            if (checked === false) {

                if (channelno == '1') {
                    makevideooneStartRequest(clientid);
                }
                else if (channelno == '2') {
                    makevideotwoStartRequest(clientid);
                }


            }
            else {
                if (channelno == '1') {
                    playVideo('https://dfmsmi.corp.tatasteel.com/cvideo/' + clientid + '-' + channelno);
                }
                else if (channelno == '2') {
                    playVideotwo('https://dfmsmi.corp.tatasteel.com/cvideo/' + clientid + '-' + channelno);
                }
            }
        })
        .catch(error => console.error('Error:', error));


}


    function FLVPlayer(opts) {

        var videoElement = document.createElement('VIDEO');
    videoElement.autoplay = true;
    videoElement.controls = false;
    videoElement.muted = false;
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    opts.container.append(videoElement);

    this.container = opts.container;
    this.videoElement = videoElement;
    this.httpFlvURL = opts.url;

    this.mediaInfo = null;
    this.play = null;
    this.onPlayEvtListener = null;
    this.onPauseEvtListener = null;
    this.onStopEvtListener = null;

    this.autoFastForward = opts.autoFastForward;
    this.autoFastForwardInterval = null;

    this.play = function () {
            if (this.player) return;

    var self = this;
    self.player = new flvjs.createPlayer({
        type: 'flv',
    url: self.httpFlvURL,
    isLive: true,
    enableWorker: true,
    enableStashBuffer: true,
    autoCleanupSourceBuffer: true,
    autoCleanupMaxBackwardDuration: 5,
    autoCleanupMinBackwardDuration: 1
            });

    self.player.on('media_info', function () {
        self.mediaInfo = self.player.mediaInfo;
            });

    self.player.on('statistics_info', function () {
        console.log(arguments);
            });

    var autoPlayTimer = null;
    self.videoElement.addEventListener('player', function (e) {
                if (autoPlayTimer) clearInterval(autoPlayTimer);
    if (self.onPlayEvtListener) self.onPlayEvtListener(self, e);
            });
    self.videoElement.addEventListener('dblclick', function () {
                if (self.videoElement.requestFullscreen) self.videoElement.requestFullscreen();
            });
    autoPlayTimer = setInterval(function () {
                try {self.player.play(); } catch (e) {clearInterval(autoPlayTimer); };
            });

    self.player.attachMediaElement(self.videoElement);
    self.player.load();
    self.player.play();

    if (this.autoFastForward) this.autoFastForwardInterval = setInterval(function () {
                if (self.videoElement.buffered.length > 0 && self.videoElement.buffered.end(0) - self.videoElement.currentTime > 2) {
        console.log(self.videoElement.buffered.end(0) + "-" + self.videoElement.currentTime);
    self.videoElement.currentTime = self.videoElement.buffered.end(0) - 1;
                }
            }, 1000);
        };

    this.fullscreen = function () {
            if (this.videoElement && this.videoElement.requestFullscreen)
    this.videoElement.requestFullscreen();
        };

    this.onPlay = function (fn) {
        this.onPlayEvtListener = fn;
        };

    this.destroy = function () {
        this.player.destroy();
    clearInterval(this.autoFastForwardInterval);
        }
    }


var videoPlayerone = null;

function playVideo(videoUrl) {
    $('#xxoo').empty();
    if (videoPlayerone != null)
        videoPlayerone.destroy();
    videoPlayerone = new FLVPlayer({
        container: $('#xxoo'),
        url: videoUrl,

        autoFastForward: false
    });
    videoPlayerone.play();

}

var videoPlayertwo = null;
function playVideotwo(videoUrl) {
    $('#xxoo2').empty();
    if (videoPlayertwo != null)
        videoPlayertwo.destroy();
    videoPlayertwo = new FLVPlayer({
        container: $('#xxoo2'),
        url: videoUrl,

        autoFastForward: false
    });
    videoPlayertwo.play();

}


//function playVideo2(videoUrl) {
//    var videoPlayer = new FLVPlayer({
//        container: $('#xxoo2'),
//        url: videoUrl,

//        autoFastForward: false
//    });
//    videoPlayer.play();
//}



function makevideooneStartRequest(device_id) {
    var url = 'Data/VideoStart';

    var requestData = { cid: String(device_id), channel: 1 };
    $.ajax({
        url: url,
        type: 'POST',
        async: "false",
        data: JSON.stringify(requestData),
        contentType: 'application/json',

        success: function (response) {

            if (response.success == true) {

                // ⏳ wait 3 seconds, then check session
                setTimeout(function () {
                    checksession(device_id, '1');
                }, 5000);

                //checksession(device_id, '1');

            }
            else {
                alert(response.msg);

            }

        },
        error: function (xhr, status, error) {
            console.error('POST request failed');

        }
    });

}



function makevideotwoStartRequest(device_id) {
    var url = 'Data/VideoStart2';

    var requestData = { cid: String(device_id), channel: 2 };
    $.ajax({
        url: url,
        type: 'POST',
        async: "false",
        data: JSON.stringify(requestData),
        contentType: 'application/json',

        success: function (response) {

            if (response.success == true) {

                setTimeout(function () {
                    checksession(device_id, '2');
                }, 5000);
                //checksession(device_id, '2');

            }
            else {
                alert(response.msg);
                //$('#infoOfflineClient').modal('show');

            }

        },
        error: function (xhr, status, error) {
            console.error('POST request failed');

        }
    });

}



function checkVehicle() {
    $.ajax({
        url: 'data/GetDeviceSession',
        method: 'GET',
        success: function (data) {
            //const items = document.querySelectorAll('.sp_item');


            //items.forEach(item => {
            //    item.style.color = '#fd5c63';
            //});
            setAllNodesStop();

            data.forEach(vehicle => {

                //var plateNo;
                if (vehicle.attributes.device != null) {
                    console.log(vehicle.attributes.device.mobileNo);
                    changeNodeColor(vehicle.attributes.device.mobileNo, 'node-highlight');
                  //plateNo = vehicle.attributes.device.plateNo;
                }




            });
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
}

function setAllNodesStop() {
    let tree = $('#my_tree').jstree(true);

    // Get all nodes (flat list)
    let allNodes = tree.get_json('#', { flat: true });

    allNodes.forEach(n => {
        if (n.type === "child") {

            let node = tree.get_node(n.id);

            node.li_attr.class = (node.li_attr.class || "")
                .replace(/\bnode-(stop|highlight)\b/g, '')
                .trim();

            node.li_attr.class += " node-stop";

            tree.redraw_node(node.id);
        }
    });
}


function changeNodeColor(nodeId, cssClass) {
    try {
        let tree = $('#my_tree').jstree(true);
        let node = tree.get_node(nodeId);

        if (!node) {
            console.warn("Node not found:", nodeId);
            return;
        }

        // Remove previous color classes
        node.li_attr.class = (node.li_attr.class || "")
            .replace(/\bnode-(highlight|stop)\b/g, '')
            .trim();

        // Add new class
        node.li_attr.class += " " + cssClass;

        // Redraw node
        tree.redraw_node(nodeId);
    } catch (error) {
        console.log(error.message);
    }
}


//setTimeout(function () {
//    changeNodeColor('791078963128', 'node-highlight');
//}, 5000);


setInterval(() => {
    checkVehicle();
}, 10000); // 1000 ms = 1 second