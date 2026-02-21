function setTabel2(plateno, frmdt, todate) {
    var apiUrl = `Data/GetAlarmrank/${plateno}/${frmdt}/${todate}`;

    // Make the AJAX call
    $.ajax({
        url: apiUrl,
        method: "GET",
        dataType: "json",
        success: function (data) {
            // Process the data and fill the table
            fillTable(data);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
        }
    });
}




function fillTable(data) {
    // Clear the existing table data
    //$('#example').empty();

    // Loop through the data and create table rows

    var table = $('#example').DataTable();
    table.clear().draw();
   // table.add.rows(data);
    let row=[];
    data.forEach(function (item) {
        let currentDate = new Date();

        // Specify the target date and time (without the "T")
        let targetDateString = item.log_time;

        // Fix the format by replacing the space with "T"
        let formattedTargetDate = targetDateString.replace(" ", "T");

        // Parse the formatted date
        let targetDate = new Date(formattedTargetDate);

        // Calculate the difference in milliseconds
        let differenceInMs = currentDate - targetDate;
        let hoursDifference = differenceInMs / (1000 * 60 * 60); 
        console.log(hoursDifference);
        console.log(item.pic2);
       var vidurl = '';
       var imgurl = '';

        if (hoursDifference > 6*24)
        {
            var image = item.pic2;
            var vid = item.vid1;
            if (item.pic2 != null) {
                var im = image.split("/");
                console.log(im);
                imgurl = `<a href="api/GCS/image/${im[2]}/${im[3]}"  target="_blank">View Pic</a>`;
            }
            else {
                imgurl = "No Any Image";
            }

            if (item.vid1 != null) {
                var vi = vid.split("/");
                console.log(vi);
                vidurl = `<a href="api/GCS/video/${vi[2]}/${vi[3]}" target="_blank">View Vid</a>`;
            }
            else {
                vidurl = "No Any Video";
            }
           
            
            
            

        }
        else
        {
            if (item.pic2 != null) {

                let folder = item.pic2.split('/');
                let pic = folder[3];
                let fdr = folder[2];
                imgurl = "<a href='/api/GCS/fiimage/" + fdr + "/" + pic + "' target='_blank'>picture</a>";



                //imgurl = `<a href="https://10.137.9.50/${item.pic2}" target="_blank">View Pic</a>`;
            } 
            else {
                imgurl = "No Any Image";
            }

            if (item.vid1 != null) {

                let folder = item.vid1.split('/');
                let vid = folder[3];
                let fdr = folder[2];
                vidurl = "<a href='/api/GCS/fivideo/" + fdr + "/" + vid + "' target='_blank'>video</a>";



                //vidurl = `<a href="https://10.137.9.50/${item.vid1}"  target="_blank">View Vid</a>`;
            }
            else {
                vidurl = "No Any Video";
            }
        }

        

        row.push([
            `${item.plate_no}`,
            `${item.type}`,
            `${item.log_time}`,
            `${imgurl}`,
            `${vidurl}`

        ]);
        //table.row
        //    .add([
        //        `${item.plate_no}`,
        //        `${item.type}`,
        //        `${item.log_time}`,
        //        `<a href="https://10.137.9.50/${item.pic2}"  target="_blank">View Pic</a>`,
        //        `<a href="https://10.137.9.50/${item.vid1}" target="_blank">View Vid</a></td>`
                
        //    ])
        //    .draw(false);
    });
   // console.log(row);
    table.rows.add(row).draw(false);
}



