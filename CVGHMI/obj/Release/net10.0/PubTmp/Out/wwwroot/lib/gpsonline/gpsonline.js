function setTabel2(ownerid, frmdt, todate) {
    var apiUrl = `Data/GetOnline/${ownerid}/${frmdt}/${todate}`;

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
 
        
        row.push([
            `${item.seq_no}`,
            `${item.plate_no}`,
            `${item.discover}`,
            `${item.totalhr}`,
            `${item.fromdt}`,
            `${item.todt}`
            

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



