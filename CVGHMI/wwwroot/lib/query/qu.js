const alarmtypeSelect = document.getElementById('ddltype');
const choicestype = new Choices(alarmtypeSelect, {
    removeItemButton: true,
    searchEnabled: true,
    placeholderValue: 'Select Alarm Type',
    searchPlaceholderValue: 'Search...',
    shouldSort: false
});

//choicestype.setChoices([{ value: 'ALL', label: 'ALL' }], 'value', 'label', false);



const ddlorgSelect = document.getElementById('ddlorg');
const choicesddlorge = new Choices(ddlorgSelect, {
    removeItemButton: true,
    searchEnabled: true, 
    placeholderValue: 'Select Organization Name',
    searchPlaceholderValue: 'Search...',
    shouldSort: false
});




$('#btnsearch').click(async function () {

   // $('#tblData').empty();
    //showvalue();
    $('#tblData').empty();
    //setTimeout(() => { spnpress.classList.remove('d-none'); }, 1000);

    spnpress.classList.remove('d-none');
    await sleep(1000);
    const sitem = choicesddlorge.getValue();
    const sitemtype = choicestype.getValue()
    //let spnpress = document.getElementById("spnpress");
    const tasks = [];
    for (var i = 0; i < sitem.length; i++) {

        for (let j = 0; j < sitemtype.length; j++) {
            console.log(sitem[i].label + "," + sitemtype[j].label);
            tasks.push(showvalue(sitem[i].label, sitemtype[j].label));
            //showvalue(sitem[i].label, sitemtype[j].label)
            //await sleep(1000);
        }
    }
    await Promise.all(tasks);
    await sleep(1000);
    spnpress.classList.add('d-none');
    console.log("End of operation");
    //setTimeout(() => { spnpress.classList.add('d-none'); }, 1000);

});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function showvalue(ownerId,alarmType) {
    //var ownerId = $("#ddlorg").val();
    var fromDate = $("#frmdate").val();
    var toDate = $("#todate").val();
   // var alarmType = $("#ddltype").val();

    // Construct the API endpoint URL
    var apiUrl = `Data/Query/${encodeURIComponent(ownerId)}/${encodeURIComponent(fromDate)}/${encodeURIComponent(toDate)}/${encodeURIComponent(alarmType)}`;

    try {
        const data = await $.getJSON(apiUrl);
        await fillTable(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }



    // Make the AJAX call
   // $.ajax({
   //     url: apiUrl,
   //     method: "GET",
   //     dataType: "json",
   //     async: false,
   //     success: function (data) {
            // Process the data and fill the table
   //         await fillTable(data);
    //    },
     //   error: function (xhr, status, error) {
      //      console.error("Error fetching data:", error);
      //  }
   // });
}




// Function to fill the table with data
async function fillTable(data) {
    // Clear the existing table data
   // $('#tblData').empty();

    let index = 0;
    // Loop through the data and create table rows
    data.forEach(async function (item) {
        index = index + 1;
        if (index % 100 === 0) {
            await sleep(100);
        }
        let currentDate = new Date();

        // Specify the target date and time (without the "T")
        let targetDateString = item.devicetime;

        // Fix the format by replacing the space with "T"
        let formattedTargetDate = targetDateString.replace(" ", "T");

        // Parse the formatted date
        let targetDate = new Date(formattedTargetDate);

        // Calculate the difference in milliseconds
        let differenceInMs = currentDate - targetDate;
        let hoursDifference = differenceInMs / (1000 * 60 * 60);
        //console.log(hoursDifference);
        var vidurl = '';
        var imgurl = '';

        if (hoursDifference > 6 * 24) {
            var image = item.pic;
            var vid = item.vid;
            if (item.pic != null) {
                var im = image.split("/");
                //console.log(im);
                imgurl = `<a href="api/GCS/image/${im[2]}/${im[3]}"  target="_blank">View Pic</a>`;
            }
            else {
                imgurl = "No Any Image";
            }

            if (item.vid != null) {
                var vi = vid.split("/");
                //console.log(vi);
                vidurl = `<a href="/api/GCS/video/${vi[2]}/${vi[3]}" target="_blank">View Vid</a>`;
            }
            else {
                vidurl = "No Any Video";
            }





        }
        else {
            if (item.pic != null) {
                let folder = item.pic.split('/');
                let pic = folder[3];
                let fdr = folder[2];
                imgurl = "<a href='/api/GCS/fiimage/" + fdr + "/" + pic + "' target='_blank'>picture</a>";


                //imgurl = `<a href="https://10.137.9.50/${item.pic}" target="_blank">View Pic</a>`;
            }
            else {
                imgurl = "No Any Image";
            }

            if (item.vid != null) {
                let folder = item.vid.split('/');
                let vid = folder[3];
                let fdr = folder[2];
                vidurl = "<a href='/api/GCS/fivideo/" + fdr + "/" + vid + "' target='_blank'>video</a>";


                //vidurl = `<a href="https://10.137.9.50/${item.vid}"  target="_blank">View Vid</a>`;
            }
            else {
                vidurl = "No Any Video";
            }
        }




      

        const row = `
                <tr>
                    <td>${item.plate_no}</td>
                    <td>${item.owner_id}</td>
                    <td>${item.type}</td>
                    <td>${parseFloat(item.speed)/10.0}</td>
                    <td>${item.devicetime}</td>
                    <td>${vidurl}</td>
                    <td>${imgurl}</td>
                    <td><a href="https://maps.google.com/?q=${parseFloat(item.latitude)/1000000.0},${parseFloat(item.longitude)/1000000.0}" target="_blank">View Map</a></td>
                    
                </tr>
            `;
        // Append the row to the tbody
        $('#tblData').append(row);
    });
}


// Function to download table data as CSV
function downloadCSV(filename) {
    // Get the table data
    var rows = document.querySelectorAll("#tblmain tr");
    var csvContent = "";

    rows.forEach(function (row) {
        var cols = row.querySelectorAll("td, th");
        var rowData = Array.from(cols).map(function (col) {
            return `"${col.innerText.replace(/"/g, '""')}"`;
        }).join(",");
        csvContent += rowData + "\r\n";
    });

    // Create a Blob from the CSV data
    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);

    // Create a link element
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);

    // Append the link to the document body and click it
    document.body.appendChild(link);
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}

$("#btndownload").click(function () {
    downloadCSV("table_data.csv");
});
