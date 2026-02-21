function setTabel2(profileid, frmdt, todate) {
    var apiUrl = `Data/Getalarmsumraw/${profileid}/${frmdt}/${todate}`;

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
    //public int seq { get; set; }
    //    public string plate_no  { get; set; }
    //    public string owner_id     { get; set; }
    //    public int total  { get; set; }
    //    public int dalt  { get; set; }
    //    public int ect  { get; set; }
    //    public int ldt  { get; set; }
    //    public int seatbelt  { get; set; }
    //    public int smokingt  { get; set; }
    //    public int sost  { get; set; }
    //    public int telt  { get; set; }
    //    public int yt  { get; set; }
    //    public int aut  { get; set; }
    //    public int overspt  { get; set; }
    //    public string aldate  { get; set; }


        
        row.push([
            `${item.seq}`,
            `${item.plate_no}`,
            `${item.owner_id}`,
            `${item.total}`,
            `${item.dalt}`,
            `${item.ect}`,
            `${item.ldt}`,
            `${item.seatbelt}`,
            `${item.smokingt}`,
            `${item.sost}`,
            `${item.telt}`,
            `${item.yt}`,
            `${item.aut}`,
            `${item.overspt}`,
            `${item.aldate}`
            

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



