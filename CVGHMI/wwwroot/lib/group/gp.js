//alert('welcome to js');
//$(document).ready(function () {


//http://localhost:8080/ownersalarm/p001

//ownersdtalarm

    $('#btnsearch').click(function () {
        // Handle button click here
        //alert('Button clicked!');
        var dt1 = $('#frmdate').val();
        var dt2 = $('#todate').val();
        //alert(profile_id);
        // You can also perform other actions here, such as AJAX calls, DOM manipulation, etc.
        clickownersdtalarmpi(profile_id, dt1, dt2)
        clickownersalarm(profile_id,dt1,dt2);
       
        clickownersdtalarm(profile_id, dt1, dt2);

        clickownertop10(profile_id, dt1, dt2);

        //clickownersdtalarmpi(profile_id, frmdt, todt);

    });


function clickownersdtalarmpi(pfid, dt1, dt2) {
    $.ajax({
        url: `Data/GetOwneralarmsumrawpi/${pfid}/${dt1}/${dt2}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {

            console.log(data);
            const chartData = [
                { name: 'Dirver Abnormilty Alarm', y: data.daa },
                { name: 'Eye Clouser', y: data.ec },
                { name: 'Look Down', y: data.ld },
                { name: 'Seat Belt', y: data.sb },
               
                { name: 'Telephoning', y: data.tel },
                {name: 'Yawning', y: data.yawn}

            ];
            // Initialize Highcharts chart with dynamically fetched data
            Highcharts.chart('alarmsum', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Alarms'
                }, plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)'
                        }
                    }
                },
               
                series: [
                    {
                        name: 'Values',
                        colorByPoint: true,
                        data: chartData
                    }
                ],
                exporting: {
                    enabled: true
                }
            });
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('AJAX Error: ' + status + ' - ' + error);
            $('#container').html('<div class="alert alert-danger">Error fetching data.</div>');
        }
    });
}



function clickownertop10(pfid, dt1, dt2) {
    $.ajax({
        url: `Data/GetTop10gr/${pfid}/${dt1}/${dt2}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {

            console.log(data);

            // Initialize Highcharts chart with dynamically fetched data
            Highcharts.chart('top10ve', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Top 10 Vehicles Eye Clouser + Yawaning'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)'
                        }
                    }
                },
                series: [{
                    name: 'TotalAl',
                    colorByPoint: true,
                    data: data // directly use API response
                }],
                exporting: {
                    enabled: true
                }
            });
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('AJAX Error: ' + status + ' - ' + error);
            $('#container').html('<div class="alert alert-danger">Error fetching data.</div>');
        }
    });
}



//GetOwneralarmsumrawdt

function clickownersdtalarm(pfid, dt1, dt2) {
    $.ajax({
        url: `Data/GetOwneralarmsumrawdt/${pfid}/${dt1}/${dt2}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {
            // Data received successfully, prepare categories and series
            var seriesData = {};

            // Group data by owner_id
            data.forEach(function (item) {
                if (!seriesData[item.owner_id]) {
                    seriesData[item.owner_id] = {
                        name: item.owner_id,
                        data: []
                    };
                }

                // Convert dvtime to date object if not null
                var dvtime = item.aldate ? new Date(item.aldate) : null;// new Date('2024-05-20');              if (dvtime != null) { }
                if (dvtime != null) {
                    var dvtime = Date.UTC(dvtime.getFullYear(), dvtime.getMonth(), dvtime.getDate());

                    // Add point to series data
                    seriesData[item.owner_id].data.push({
                        x: dvtime,
                        y: parseInt(item.totalal)
                    });
                }
            });

            // Initialize Highcharts chart with dynamically fetched data
            Highcharts.chart('ownersdtalarm', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Total Alarms Over Time'
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Total Alarms'
                    }
                },
                series: Object.values(seriesData),
                exporting: {
                    enabled: true
                }
            });
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('AJAX Error: ' + status + ' - ' + error);
            $('#container').html('<div class="alert alert-danger">Error fetching data.</div>');
        }
    });
}





function clickownersdtalarmcrm(profile_id, dt1, dt2) {

    let dt = new Date();
    alert(dt.getFullYear());

    $.ajax({
        url: `Data/GetOwneralarmsumrawdt/${profile_id}/${dt1}/${dt2}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {
            // Data received successfully, prepare categories and series
            var seriesData = {};

            // Group data by owner_id
            data.forEach(function (item) {
                if (!seriesData[item.owner_id]) {
                    seriesData[item.owner_id] = {
                        name: item.owner_id,
                        data: []
                    };
                }

                // Convert dvtime to date object if not null
                var dvtime = item.aldate ? new Date(item.aldate) : null;// new Date('2024-05-20');              if (dvtime != null) { }
                if (dvtime != null) {
                    var dvtime = Date.UTC(dvtime.getFullYear(), dvtime.getMonth(), dvtime.getDate());

                    // Add point to series data
                    seriesData[item.owner_id].data.push({
                        x: dvtime,
                        y: parseInt(item.totalal)
                    });
                }
            });

            // Initialize Highcharts chart with dynamically fetched data
            Highcharts.chart('ownersdtalarm', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Total Alarms Over Time'
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Total Alarms'
                    }
                },
                series: Object.values(seriesData)
            });
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('AJAX Error: ' + status + ' - ' + error);
            $('#container').html('<div class="alert alert-danger">Error fetching data.</div>');
        }
    });
}



function clickownersalarm(pfid, dt1, dt2) {

    $.ajax({
        url: `Data/GetOwneralarmsumraw/${pfid}/${dt1}/${dt2}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {

            var categories = []; // Array to hold categories
            var seriesData = []; // Array to hold series data

            // Assuming data structure is an array of objects with 'category' and 'value' properties
            $.each(data, function (index, item) {
                categories.push(item.owner_id); // Add category to categories array
                seriesData.push(item.totalal);    // Add value to series data array
            });


            // Initialize Highcharts chart
            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Organization'
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: 'Nos Of Alarm'
                    }
                },
                series: [{
                    name: 'Owners',
                    data: seriesData
                }]
            });


            // Handle successful response
            // $('#result').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
        },
        error: function (xhr, status, error) {
            // Handle errors
            // console.error('AJAX Error: ' + status + ' - ' + error);
            // $('#result').html('<div class="alert alert-danger">Error fetching data.</div>');
        }
    });

}



function ownersalarm() {

    $.ajax({
        url: `Data/GetOwnerAlarmSummary/${profile_id}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {

            var categories = []; // Array to hold categories
            var seriesData = []; // Array to hold series data

            // Assuming data structure is an array of objects with 'category' and 'value' properties
            $.each(data, function (index, item) {
                categories.push(item.owner_id); // Add category to categories array
                seriesData.push(item.noofalarm);    // Add value to series data array
            });


            // Initialize Highcharts chart
            Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Organization'
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: 'Nos Of Alarm'
                    }
                },
                series: [{
                    name: 'Owners',
                    data: seriesData
                }]
            });


            // Handle successful response
           // $('#result').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
        },
        error: function (xhr, status, error) {
            // Handle errors
           // console.error('AJAX Error: ' + status + ' - ' + error);
           // $('#result').html('<div class="alert alert-danger">Error fetching data.</div>');
        }
    });
}

function ownersdtalarm() {
    $.ajax({
        url: `Data/GetOwnerDtAlarm/${profile_id}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {
            // Data received successfully, prepare categories and series
            var seriesData = {};

            // Group data by owner_id
            data.forEach(function (item) {
                if (!seriesData[item.owner_id]) {
                    seriesData[item.owner_id] = {
                        name: item.owner_id,
                        data: []
                    };
                }

                // Convert dvtime to date object if not null
                var dvtime = item.dvtime ? new Date(item.dvtime) : null;// new Date('2024-05-20');              if (dvtime != null) { }
                if (dvtime != null) {
                    var dvtime = Date.UTC(dvtime.getFullYear(), dvtime.getMonth(), dvtime.getDate());

                    // Add point to series data
                    seriesData[item.owner_id].data.push({
                        x: dvtime,
                        y: parseInt(item.totalalarm)
                    });
                }
            });

            // Initialize Highcharts chart with dynamically fetched data
            Highcharts.chart('ownersdtalarm', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Total Alarms Over Time'
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Total Alarms'
                    }
                },
                series: Object.values(seriesData)
            });
        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error('AJAX Error: ' + status + ' - ' + error);
            $('#container').html('<div class="alert alert-danger">Error fetching data.</div>');
        }
    });
   
}

function cvtdttoddmmyyyy(vardt)
{
    let dt = vardt.getDate();
    let Mon = vardt.getMonth();
    Mon = Mon + 1;
    let yr = vardt.getFullYear();
    return yr + "-" + Mon + "-" + dt+" 00:00:00";


}

//ownersalarm();
//ownersdtalarm();

let dto = new Date();
let todt = cvtdttoddmmyyyy(dto);
//alert(frmdt);

dto = dto.setMonth(dto.getMonth() - 1);
dto = new Date(dto);
let frmdt =cvtdttoddmmyyyy(dto);
//alert(todt);
clickownersalarm(profile_id, frmdt, todt);
clickownersdtalarm(profile_id, frmdt, todt);
clickownersdtalarmpi(profile_id, frmdt, todt);
clickownertop10(profile_id, frmdt, todt);