//alert('welcome to js');
//$(document).ready(function () {

//const { profile } = require("console");


//http://localhost:8080/ownersalarm/p001

//ownersdtalarm

$('#btnsearch').click(function () {

    var orgname = $("#ddlorg").val();
    //alert($("#ddlorg").val());// + " " + $("#frmdate").val() + " " + $("#todate").val());
    ownersalarm(orgname, $("#frmdate").val(), $("#todate").val());
    ownersdtalarm(orgname, $("#frmdate").val(), $("#todate").val());

    clickownersdtalarmpi(orgname, profile_id, $("#frmdate").val(), $("#todate").val());

    clickownertop10(orgname, profile_id, $("#frmdate").val(), $("#todate").val());

});


function clickownersdtalarmpi(orgname,pfid, dt1, dt2) {
    $.ajax({
        url: `Data/Getorgalarmsumrawpi/${orgname}/${pfid}/${dt1}/${dt2}`,
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
                { name: 'Yawning', y: data.yawn }

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

function clickownertop10(owner_id,pfid, dt1, dt2) {
    $.ajax({
        url: `Data/GetTop10org/${owner_id}/${pfid}/${dt1}/${dt2}`,
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



function ownersalarm(orgname,frmdate,todate) {

    $.ajax({
        url: `Data/GetOrgalarmsumraw/${profile_id}/${orgname}/${frmdate}/${todate}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {

            var categories = []; // Array to hold categories
            var seriesData = []; // Array to hold series data

            // Assuming data structure is an array of objects with 'category' and 'value' properties
            $.each(data, function (index, item) {
                categories.push(item.plate_no); // Add category to categories array
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



function ownersdtalarm(orgname, frmdate, todate) {
    $.ajax({
        url: `Data/GetOrgalarmsumrawdt/${profile_id}/${orgname}/${frmdate}/${todate}`,
        type: 'GET',
        dataType: 'json', // Assuming the response is JSON
        success: function (data) {
            // Data received successfully, prepare categories and series
            var seriesData = {};

            // Group data by owner_id
            data.forEach(function (item) {
                if (!seriesData[item.plate_no]) {
                    seriesData[item.plate_no] = {
                        name: item.plate_no,
                        data: []
                    };
                }

                // Convert dvtime to date object if not null
                var dvtime = item.dvtime ? new Date(item.dvtime) : null;// new Date('2024-05-20');              if (dvtime != null) { }
                if (dvtime != null) {
                    var dvtime = Date.UTC(dvtime.getFullYear(), dvtime.getMonth(), dvtime.getDate());

                    // Add point to series data
                    seriesData[item.plate_no].data.push({
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
