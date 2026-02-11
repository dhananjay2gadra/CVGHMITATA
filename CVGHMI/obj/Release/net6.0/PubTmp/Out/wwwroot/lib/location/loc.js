
var _tblinfo = document.getElementById("main_table_body");
let ws;
let player;
var oldid = new Array();
var newid = new Array();
var flag_alarm = false;
var new_alarm;

let audioContext;
let processor;
let input;
let stream;
let audioChunks = [];
let recording = false;
const desiredSampleRate = 8000;
const chunkSize = 1024;

//<th><input Type="text" id="txtVehicleNo" style="width:100%"/></th>
//        <th><input Type="text" id="txtOrganization"  style="width:100%" /></th>
//                                        <th><input Type="text" id="txtspeed" style="width:100%" /></th>
//                                        <th><input Type="text" id="txtMakerType" style="width:100%" /></th>
//                                        <th><input Type="text" id="txtAlarmType"  style="width:100%" /></th>




if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('MediaRecorder API not supported.');
    alert('Your browser does not support the required APIs for media recording.');
}


const alarmtypeSelect = document.getElementById('ddltype');
const choicestype = new Choices(alarmtypeSelect, {
    removeItemButton: true,
    searchEnabled: true,
    position: 'bottom',
    placeholderValue: 'Select Alarm Type',
    searchPlaceholderValue: 'Search...',
    shouldSort: false
});




const ddlvtype = document.getElementById('ddlvtype');
const choicesvtype = new Choices(ddlvtype, {
    removeItemButton: true,
    position: 'bottom',
    searchEnabled: true,
    placeholderValue: 'Select Vehicle Type',
    searchPlaceholderValue: 'Search...',
    shouldSort: false
});


const ddlptype = document.getElementById('ddlptype');
const choicesptype = new Choices(ddlptype, {
    removeItemButton: true,
    position: 'bottom',
    searchEnabled: true,
    placeholderValue: 'Select Priority Type',
    searchPlaceholderValue: 'Search...',
    shouldSort: false
});

const ddlorgSelect = document.getElementById('ddlorg');
const choicesddlorge = new Choices(ddlorgSelect, {
    removeItemButton: true,
    position: 'bottom',
    searchEnabled: true,
    placeholderValue: 'Select Organization Name',
    searchPlaceholderValue: 'Search...',
    shouldSort: false
});

async function startRecording() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sourceSampleRate = audioContext.sampleRate;

        input = audioContext.createMediaStreamSource(stream);
        processor = audioContext.createScriptProcessor(chunkSize, 1, 1);

        processor.onaudioprocess = function (e) {
            if (!recording) return;

            const inputData = e.inputBuffer.getChannelData(0);
            const downsampledData = downsampleBuffer(inputData, sourceSampleRate, desiredSampleRate);

            let buffer = new ArrayBuffer(downsampledData.length * 2);
            let view = new DataView(buffer);
            for (let i = 0; i < downsampledData.length; i++) {
                view.setInt16(i * 2, downsampledData[i] * 0x7FFF, true);
            }

            // Send the buffer over WebSocket
           // if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(buffer);
            //}

            audioChunks.push(buffer);
        };

        input.connect(processor);
        processor.connect(audioContext.destination);

        recording = true;
        console.log('Recording started.');
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}




function stopRecording() {
    if (processor && input && recording) {
        recording = false;
        input.disconnect();
        processor.disconnect();
        stream.getTracks().forEach(track => track.stop());
        console.log('Recording stopped.');

        ////if (websocket) {
        //    websocket.close();
        //}

       // const blob = new Blob(audioChunks, { type: 'audio/pcm' });
        audioChunks = [];

       // const downloadLink = document.createElement('a');
        //const url = URL.createObjectURL(blob);
        //downloadLink.href = url;
        //downloadLink.download = 'recording.pcm';
        //document.body.appendChild(downloadLink);
        //downloadLink.click();
        //document.body.removeChild(downloadLink);
    } else {
        console.warn('No recording in progress.');
    }
}


function downsampleBuffer(buffer, inputSampleRate, outputSampleRate) {
    if (outputSampleRate === inputSampleRate) {
        return buffer;
    }
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0, count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }
        result[offsetResult] = accum / count;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }
    return result;
}




            var _marinfo={};


            function load_marker()
            {

            	var objXMLHttpRequest = new XMLHttpRequest();
                objXMLHttpRequest.onreadystatechange = function () {
                    if (objXMLHttpRequest.readyState === 4) {
                        if (objXMLHttpRequest.status === 200) {
                            var obj = JSON.parse(objXMLHttpRequest.responseText);

                            for (var i = 0; i < obj.length; i++) {

                                var speed = parseFloat(obj[i].speed);


                                var _mark = L.marker([obj[i].lat/1000000.0, obj[i].lng/1000000.0]).addTo(map);
                                _marinfo[obj[i].plate_no] = _mark;
                                _mark.bindTooltip(obj[i].plate_no, { className: 'custom-tooltip', autoClose: false, direction: 'top' }).openTooltip();//addTo(map);


                            }
                        }
                    }
                }
		
                var apiUrl = `Data/GetGps/${encodeURIComponent(profile_id)}`;


                objXMLHttpRequest.open('GET', apiUrl);
                objXMLHttpRequest.send();

            }
load_marker();







function move_marker() {

    var objXMLHttpRequest = new XMLHttpRequest();
    objXMLHttpRequest.onreadystatechange = function () {
        if (objXMLHttpRequest.readyState === 4) {
            if (objXMLHttpRequest.status === 200) {
                var obj = JSON.parse(objXMLHttpRequest.responseText);

                for (var i = 0; i < obj.length; i++) {
                    var _mar = _marinfo[obj[i].plate_no];
                    var speed = parseFloat(obj[i].speed);
                    var newLatLng = new L.LatLng(obj[i].lat/1000000.0, obj[i].lng/1000000.0);
                    _mar.setLatLng(newLatLng);
                    _mar.closeTooltip();
                    _mar.bindTooltip(obj[i].plate_no + "<br>" + obj[i].log_time, { className: 'custom-tooltip', autoClose: false, direction: 'top' }).openTooltip();
                   
                }


            }
        }
    }


    var apiUrl = `Data/GetGps/${encodeURIComponent(profile_id)}`;

    objXMLHttpRequest.open('GET', apiUrl );
    objXMLHttpRequest.send();

}

setInterval(move_marker, 10000);




function getNewAlarm() {
    oldid = new Array();

    var objXMLHttpRequest = new XMLHttpRequest();
    objXMLHttpRequest.onreadystatechange = function () {
        if (objXMLHttpRequest.readyState === 4) {
            if (objXMLHttpRequest.status === 200) {
                var obj = JSON.parse(objXMLHttpRequest.responseText);

                for (var i = 0; i < obj.length; i++)
                {
                    var row = _tblinfo.insertRow(0);
                    var cell1 = row.insertCell(0);
                    cell1.outerHTML = "<th ><a href='#' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";

                    //if (obj[i].type == "Eye Closure") {
                    //    cell1.outerHTML = "<th ><a href='#' style='color:Red' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";

                    //}
                    //else if (obj[i].type == "Seat Belt" || obj[i].type == "Telephone" || obj[i].type == "Yawning" || obj[i].type.split(' ')[0] === "Overspeed") {
                    //    cell1.outerHTML = "<th ><a href='#' style='color:orange' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                    //}
                    //else {
                    //    cell1.outerHTML = "<th ><a href='#'  style='color:Blue' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                    //}
                    
                    var cell2 = row.insertCell(1);
                    cell2.outerHTML = "<td>" + obj[i].id + "</td>";
                    oldid.push(obj[i].id);

                    var cellv = row.insertCell(2);
                    if (obj[i].type == "Eye Closure") {

                        cellv.outerHTML = "<td style='color:Red'>" + obj[i].priority + "</td>";
                        // cell1.outerHTML = "<th ><a href='#' style='color:Red' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                        // row.style.backgroundColor = "red";

                    }
                    else if (obj[i].type == "Seat Belt" || obj[i].type == "Telephone" || obj[i].type == "Yawning" || obj[i].type.split(' ')[0] === "Overspeed") {
                        // cell1.outerHTML = "<th ><a href='#' style='color:orange' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                        //row.style.backgroundColor = "orange";
                        cellv.outerHTML = "<td style='color:orange'>" + obj[i].priority + "</td>";
                    }
                    else {
                        //cell1.outerHTML = "<th ><a href='#'  style='color:Blue' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                        //row.style.backgroundColor = "Blue";
                        cellv.outerHTML = "<td style='color:Blue'>" + obj[i].priority + "</td>";
                    }

                    //cellv.outerHTML = "<td>" + obj[i].priority + "</td>";

                    var cell3 = row.insertCell(3);
                    cell3.outerHTML = "<td>" + obj[i].owner_id + "</td>";

                    //var cellxv1 = row.insertCell(4);
                    //cellxv1.outerHTML = "<td>" + obj[i].plate_color + "</td>";
                    //var cellxv2 = row.insertCell(5);
                    //cellxv2.outerHTML = "<td>" + obj[i].province_id + "</td>";




                    //speedf
                    var cellx = row.insertCell(4);
                    cellx.outerHTML = "<td>" + obj[i].speedf + "</td>";

                    //maker_id


                    var cellx2 = row.insertCell(5);
                    cellx2.outerHTML = "<td>" + obj[i].maker_id + "</td>";

                    var cell4 = row.insertCell(6);
                    cell4.outerHTML = "<th>" + obj[i].type + "</th>";
                    var cell5 = row.insertCell(7);
                    cell5.outerHTML = "<td>" + obj[i].devicetime + "</td>";
                    var cell6 = row.insertCell(8);
                    var cell7 = row.insertCell(9);
                    if (obj[i].type.split(' ')[0] === "Overspeed" || obj[i].type.split(' ')[0] === "SOS") {
                        cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'>----</td>";
                        cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'>----</td>";
                    }
                    else {

                        
                        if (obj[i].vid != '' && obj[i].vid != null) {
                            let folder = obj[i].vid.split('/');
                            let vid = folder[3];
                            let fdr = folder[2];
                            cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'><a href='/api/GCS/fivideo/"+fdr+"/" + vid + "' target='_blank'>video</a></td>";

                        }
                        else {
                            cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'>----</td>";
                           // cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'>----</td>";
                        }


                        if (obj[i].vid != '' && obj[i].pic != null) {
                            let folder = obj[i].pic.split('/');
                            let pic = folder[3];
                            let fdr = folder[2];
                            cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'><a href='/api/GCS/fiimage/" + fdr + "/" + pic  + "' target='_blank'>picture</a></td>";

                        }
                        else {
                           // cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'>----</td>";
                            cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'>----</td>";//
                        }



                        //cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'><a href='https://10.137.9.50/" + obj[i].vid + "' target='_blank'>video</a></td>";
                        //cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'><a href='https://10.137.9.50/" + obj[i].pic + "' target='_blank'>picture</a></td>";
                    }

                    var cell8 = row.insertCell(10);
                    cell8.outerHTML = `<td><a href="https://maps.google.com/?q=${parseFloat(obj[i].latitude) / 1000000.0},${parseFloat(obj[i].longitude) / 1000000.0}" target="_blank">View Map</a></td>`;
                    
                    

                }

                new_alarm = setInterval(getNewOneAlarm, 30000);

            }
        }





    }

 

    var apiUrl = `Data/GetAlarmInfo/${encodeURIComponent(profile_id)}`
    objXMLHttpRequest.open('GET', apiUrl);
    objXMLHttpRequest.send();
  
}

getNewAlarm();






function getNewOneAlarm() {

    const svtypeitem = choicesvtype.getValue();
    const satypeitem = choicestype.getValue();
    const sotypeitem = choicesddlorge.getValue();
    const sptypeitem = choicesptype.getValue();

    const txtVehicleNo = $("#txtVehicleNo").val().trim().toUpperCase();
    //const txspeed = $("#txtVehicleNo").val()
    const txspeed_input = $("#txtspeed").val().trim();
    const txspeed = (txspeed_input === "") ? 0 : txspeed_input;


    const txtOrganization = sotypeitem.map(item => item.value);//.join('|');
    const txtMakerType = svtypeitem.map(item => item.value);//.join('|');
    const txtAlarmType = satypeitem.map(item => item.value);//.join('|');
    const txtpriority = sptypeitem.map(item => item.value);//.join('|');



    var objXMLHttpRequest = new XMLHttpRequest();
    objXMLHttpRequest.onreadystatechange = function () {
        if (objXMLHttpRequest.readyState === 4) {
            if (objXMLHttpRequest.status === 200) {

                try {
                    let obj = JSON.parse(objXMLHttpRequest.responseText);
                   
                   



                    const fastLookDownAlarms = obj.filter(alarm => {

                        let isMatch = true;
                        if (txtOrganization.length != 0) {
                            isMatch = txtOrganization.some(val =>
                                alarm.owner_id.toUpperCase().includes(val.toUpperCase())
                            );
                        }

                        let isMatch2 = true;
                        if (txtMakerType.length != 0) {
                            isMatch2 = txtMakerType.some(val =>
                                alarm.maker_id.toUpperCase().includes(val.toUpperCase())
                            );
                        }

                        let isMatch3 = true;
                        if (txtAlarmType.length != 0) {
                            isMatch3 = txtAlarmType.some(val =>
                                alarm.type.toUpperCase().includes(val.toUpperCase())
                            );
                        }

                        let isMatch4 = true;
                        if (txtpriority.length != 0) {
                            isMatch4 = txtpriority.some(val =>
                                alarm.priority.toUpperCase().includes(val.toUpperCase())
                            );
                        }

                     
                       

                        //return alarm.plate_no.toUpperCase().includes(txtVehicleNo) && alarm.speedf >= txspeed && alarm.owner_id.toUpperCase().includes(txtOrganization) && alarm.maker_id.toUpperCase().includes(txtMakerType) && alarm.type.toUpperCase().includes(txtAlarmType) && alarm.priority.toUpperCase().includes(txtpriority);
                        return alarm.plate_no.toUpperCase().includes(txtVehicleNo) && alarm.speedf >= txspeed && isMatch && isMatch2 && isMatch3 && isMatch4;
                    });

                    // 4. 'fastLookDownAlarms' now holds only the elements that passed the test.
                   // console.log(fastLookDownAlarms);
                    obj = fastLookDownAlarms;

                    for (let i = 0; i < obj.length; i++) {
                        newid.push(obj[i].id);


                        if (oldid.indexOf(obj[i].id) == -1) {

                            if (obj[i].type == "SOS")
                                play('/lib/location/sos.mp3');
                            else
                                play('/lib/location/ring.mp3');

                            var row = _tblinfo.insertRow(0);
                            var cell1 = row.insertCell(0);
                            cell1.outerHTML = "<th> <a href='#'  onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                            ////cell1.outerHTML = "<th ><a href='#' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                            ////Seat Belt, Overspeed, Telephone, Yawning
                            //if (obj[i].type == "Eye Closure") {
                            //    cell1.outerHTML = "<th ><a href='#' style='color:Red' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                            //   // row.style.backgroundColor = "red";

                            //}
                            //else if (obj[i].type == "Seat Belt" || obj[i].type == "Telephone" || obj[i].type == "Yawning" || obj[i].type.split(' ')[0] === "Overspeed" )
                            //{
                            //    cell1.outerHTML = "<th ><a href='#' style='color:orange' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                            //    //row.style.backgroundColor = "orange";
                            //}
                            //else {
                            //    cell1.outerHTML = "<th ><a href='#'  style='color:Blue' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                            //    //row.style.backgroundColor = "Blue";
                            //}


                            var cell2 = row.insertCell(1);
                            cell2.outerHTML = "<td>" + obj[i].id + "</td>";
                            oldid.push(obj[i].id);

                            var cellv = row.insertCell(2);
                            //cellv.outerHTML = "<td>" + obj[i].priority+ "</td>";


                            if (obj[i].type == "Eye Closure") {

                                cellv.outerHTML = "<td style='color:Red'>" + obj[i].priority + "</td>";
                               // cell1.outerHTML = "<th ><a href='#' style='color:Red' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                                // row.style.backgroundColor = "red";

                            }
                            else if (obj[i].type == "Seat Belt" || obj[i].type == "Telephone" || obj[i].type == "Yawning" || obj[i].type.split(' ')[0] === "Overspeed") {
                               // cell1.outerHTML = "<th ><a href='#' style='color:orange' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                                //row.style.backgroundColor = "orange";
                                cellv.outerHTML = "<td style='color:orange'>" + obj[i].priority + "</td>";
                            }
                            else {
                               // cell1.outerHTML = "<th ><a href='#'  style='color:Blue' onclick='_tbl2(this.innerHTML)'>" + obj[i].plate_no + "</a></th>";
                                //row.style.backgroundColor = "Blue";
                                cellv.outerHTML = "<td style='color:Blue'>" + obj[i].priority + "</td>";
                            }




                            var cell3 = row.insertCell(3);
                            cell3.outerHTML = "<td>" + obj[i].owner_id + "</td>";

                            //var cellxv1 = row.insertCell(4);
                            //cellxv1.outerHTML = "<td>" + obj[i].plate_color + "</td>";
                            //var cellxv2 = row.insertCell(5);
                            //cellxv2.outerHTML = "<td>" + obj[i].province_id + "</td>";

                            //speedf
                            var cellx = row.insertCell(4);
                            cellx.outerHTML = "<td>" + obj[i].speedf + "</td>";

                            //maker_id


                            var cellx2 = row.insertCell(5);
                            cellx2.outerHTML = "<td>" + obj[i].maker_id + "</td>";


                            var cell4 = row.insertCell(6);
                            cell4.outerHTML = "<th>" + obj[i].type + "</th>";
                            var cell5 = row.insertCell(7);
                            cell5.outerHTML = "<td>" + obj[i].devicetime + "</td>";
                            var cell6 = row.insertCell(8);
                            var cell7 = row.insertCell(9);
                            if (obj[i].type.split(' ')[0] === "Overspeed" || obj[i].type.split(' ')[0] === "SOS") {

                                cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'>----</td>";
                                cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'>----</td>";

                            }
                            else {
                                if (obj[i].vid != '' && obj[i].vid != null) {
                                    let folder = obj[i].vid.split('/');
                                    let vid = folder[3];
                                    let fdr = folder[2];
                                    cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'><a href='/api/GCS/fivideo/" + fdr + "/" + vid + "' target='_blank'>video</a></td>";

                                }
                                else {
                                    cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'>----</td>";
                                    // cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'>----</td>";
                                }


                                if (obj[i].pic != '' && obj[i].pic != null) {
                                    let folder = obj[i].pic.split('/');
                                    let pic = folder[3];
                                    let fdr = folder[2];
                                    cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'><a href='/api/GCS/fiimage/" + fdr+"/"+pic + "' target='_blank'>picture</a></td>";

                                }
                                else {
                                    // cell6.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Video'>----</td>";
                                    cell7.outerHTML = "<td data-toggle='tooltip' data-placement='right' title='Click To Open Picture'>----</td>";//
                                }

                            }


                            var cell8 = row.insertCell(10);
                            cell8.outerHTML = `<td><a href="https://maps.google.com/?q=${parseFloat(obj[i].latitude) / 1000000.0},${parseFloat(obj[i].longitude) / 1000000.0}" target="_blank">View Map</a></td>`;



                        }
                    }

                    oldid = newid;
                    newid = new Array();
                    cleardataTable();
                } catch (err) {
                    console.log(err.message);
                }




            }
        }

       
    }

    
    var apiUrl = `Data/GetAlarmInfo/${encodeURIComponent(profile_id)}`
    objXMLHttpRequest.open('GET', apiUrl);
    objXMLHttpRequest.send();
}


function play(url) {
    var audio = new Audio(url);// '/lib/location/ring.mp3');
    audio.play();
    flag_alarm = false;
}



function cleardataTable() {
    for (var i = _tblinfo.rows.length - 1; i >= 0; i--) {

        //alert(oldid.indexOf(_tblinfo.rows[i].cells[1].innerHTML));
        if (oldid.indexOf(parseInt(_tblinfo.rows[i].cells[1].innerHTML)) == -1)
        {
            _tblinfo.deleteRow(i);
        }


    }
}





function startStreaming() {
    player = new PCMPlayer({
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000,
    });

    //player.volume(document.getElementById('volumeSlider').value); // Set initial volume

    ws = new WebSocket('ws://127.0.0.1:6605/audio_in');
    ws.binaryType = 'arraybuffer';

    ws.onopen = function () {
        document.getElementById('status').textContent = 'WebSocket connection opened.';
        document.getElementById('startButton').disabled = true;
        document.getElementById('stopButton').disabled = false;
    };

    ws.onmessage = function (event) {
        player.feed(new Uint8Array(event.data));
        //ws.send(event.data);
        //queue.enqueue(event.data);
        //ws.send(queue.dequeue());
        console.log(event.data);


    };

    ws.onclose = function () {
        //document.getElementById('status').textContent = 'WebSocket connection closed.';
       // document.getElementById('startButton').disabled = false;
       // document.getElementById('stopButton').disabled = true;
        if (player) {
            player.destroy();
        }
    };

    ws.onerror = function (error) {
        //document.getElementById('status').textContent = 'WebSocket error: ' + error;
       // document.getElementById('startButton').disabled = false;
       // document.getElementById('stopButton').disabled = true;
        if (player) {
            player.destroy();
        }
    };
}

function stopStreaming() {
    if (ws) {
        ws.close();
    }
}

function isWebSocketOpen(ws) {
    return ws.readyState === WebSocket.OPEN;
}






 
