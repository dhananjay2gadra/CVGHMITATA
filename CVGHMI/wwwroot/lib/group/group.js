




 


function chart1(_data)
{


//    var ppo=[['rts',100]];

 Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'ORGANIZATION DETAILS'
    },
    
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'NO ALARMS'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'NO OF <b>{point.y} ALARM</b>'
    },
    series: [{
        name: 'Population',
        data: _data,
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});

}










function chart2(_pop){

 Highcharts.chart('docontainer', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: 'Warning Event'
    },
    subtitle: {
        text: 'List of Different Alarm'
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45
        }
    },
    series: [{
        name: 'Warning Event',
        data: _pop
    }]
});

}


























function chart3(_data3)
{


Highcharts.chart('alrmcon', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Alarm Report'
    },
    subtitle: {
        text: 'No of Alarm Event Wise'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Nos'
        },
        min: 0
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.0f} Nos'
    },

    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },


    // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: _data3,

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                plotOptions: {
                    series: {
                        marker: {
                            radius: 2.5
                        }
                    }
                }
            }
        }]
    }
});




}



function chart4(_data4)
{


Highcharts.chart('alrmcon2', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'ORGANIZATION REPORT'
    },
    subtitle: {
        text: 'No of Alarms Organization Wise'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Nos'
        },
        min: 0
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.0f} Nos'
    },

    plotOptions: {
        series: {
            marker: {
                enabled: true
            }
        }
    },


    // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: _data4,

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                plotOptions: {
                    series: {
                        marker: {
                            radius: 2.5
                        }
                    }
                }
            }
        }]
    }
});




}









var frm_to=document.getElementById("frm_to");
var frm_date=document.getElementById("frm_date");










function fillData(org,f_date,t_date)
    {

   //alert(objVac);

   //Vac_Alarm_body


  // var _tblinfo=document.getElementById('tblData');
   
var p=[];


var objXMLHttpRequest = new XMLHttpRequest();
              objXMLHttpRequest.onreadystatechange = function() {
              if(objXMLHttpRequest.readyState === 4) {
                if(objXMLHttpRequest.status === 200) {
                  var obj = JSON.parse(objXMLHttpRequest.responseText);

                  for(var i=0;i<obj.Data.length;i++)
                  {

                   var d= [obj.Data[i].org, parseInt(obj.Data[i].no_of_alarm)];
                   p.push(d);

                  }
                 // p.push([,])
                  chart1(p);
                  //new_alarm=setInterval(getNewOneAlarm, 4000);

    
                  
                                                      }
                                                      }
                                                                } 
    
//var compid='<?php echo $_SESSION['j_username']; ?>';  
//alert(compid);
objXMLHttpRequest.open('GET', '../vaservice/vms_admin_vi_group_org.php?sub_id='+org+"&from_date="+f_date+"&to_date="+t_date,true);
objXMLHttpRequest.send();







    }






function fillData2(org,f_date,t_date)
    {

   //alert(objVac);

   //Vac_Alarm_body


  // var _tblinfo=document.getElementById('tblData');
   
var p=[];


var objXMLHttpRequest = new XMLHttpRequest();
              objXMLHttpRequest.onreadystatechange = function() {
              if(objXMLHttpRequest.readyState === 4) {
                if(objXMLHttpRequest.status === 200) {
                  var obj = JSON.parse(objXMLHttpRequest.responseText);

                  for(var i=0;i<obj.Data.length;i++)
                  {

                   var d= [obj.Data[i].type, parseInt(obj.Data[i].no_of_alarm)];
                   p.push(d);

                  }
                 // p.push([,])
                  chart2(p);
                  //new_alarm=setInterval(getNewOneAlarm, 4000);

    
                  
                                                      }
                                                      }
                                                                } 
    
//var compid='<?php echo $_SESSION['j_username']; ?>';  
//alert(compid);
objXMLHttpRequest.open('GET', '../vaservice/vms_admin_vi_group_type.php?sub_id='+org+"&from_date="+f_date+"&to_date="+t_date,true);
objXMLHttpRequest.send();







    }








function fillData3(org,f_date,t_date)
    {

   //alert(objVac);

   //Vac_Alarm_body


  // var _tblinfo=document.getElementById('tblData');
   
var p=[];
var se=[];


var objXMLHttpRequest = new XMLHttpRequest();
              objXMLHttpRequest.onreadystatechange = function() {
              if(objXMLHttpRequest.readyState === 4) {
                if(objXMLHttpRequest.status === 200) {
                  var obj = JSON.parse(objXMLHttpRequest.responseText);


                    

                  var type = obj.Data.map( (value) => value.type).filter( (value, index, _arr) => _arr.indexOf(value) == index);

                  for(i=0;i<type.length;i++)
                  {

                  var p=[];

                  for(j=0;j<obj.Data.length;j++)
                  {
                    if(type[i]==obj.Data[j].type)
                    {

                        var dat=Date.parse(obj.Data[j].log_date);
                         dat=new Date(dat);



                   var d= [Date.UTC(dat.getFullYear(),dat.getMonth(),dat.getDate()), parseInt(obj.Data[j].no_of_alarm)];
                   p.push(d);
                    }

                  }

                  var sedata={name:type[i],data:p};
                  se.push(sedata);


                  }

                  console.log(se);
                 chart3(se);

                  //var valueArray = obj.Data.map({type} => type);
                // var data=obj.Data;

                  //var cars = data.from(new Set(array.map(({ type }) => type)));
                  //console.log(carValues);

                  //for(var i=0;i<obj.Data.length;i++)
                  //{

                  // var d= [obj.Data[i].type, parseInt(obj.Data[i].no_of_alarm)];
                   //p.push(d);

                  //}
                 // p.push([,])
                  //chart2(p);
                  //new_alarm=setInterval(getNewOneAlarm, 4000);

    
                  
                                                      }
                                                      }
                                                                } 
    
//var compid='<?php echo $_SESSION['j_username']; ?>';  
//alert(compid);
objXMLHttpRequest.open('GET', '../vaservice/vms_admin_vi_group_type_daily.php?sub_id='+org+"&from_date="+f_date+"&to_date="+t_date,true);
objXMLHttpRequest.send();







  }


function fillData4(org,f_date,t_date)
    {

   //alert(objVac);

   //Vac_Alarm_body


  // var _tblinfo=document.getElementById('tblData');
   
var p=[];
var se=[];


var objXMLHttpRequest = new XMLHttpRequest();
              objXMLHttpRequest.onreadystatechange = function() {
              if(objXMLHttpRequest.readyState === 4) {
                if(objXMLHttpRequest.status === 200) {
                  var obj = JSON.parse(objXMLHttpRequest.responseText);


                    

                  var type = obj.Data.map( (value) => value.orga).filter( (value, index, _arr) => _arr.indexOf(value) == index);

                  for(i=0;i<type.length;i++)
                  {

                  var p=[];

                  for(j=0;j<obj.Data.length;j++)
                  {
                    if(type[i]==obj.Data[j].orga)
                    {

                        var dat=Date.parse(obj.Data[j].log_date);
                         dat=new Date(dat);



                   var d= [Date.UTC(dat.getFullYear(),dat.getMonth(),dat.getDate()), parseInt(obj.Data[j].no_of_alarm)];
                   p.push(d);
                    }

                  }

                  var sedata={name:type[i],data:p};
                  se.push(sedata);


                  }

                  console.log(se);
                 chart4(se);

                  //var valueArray = obj.Data.map({type} => type);
                // var data=obj.Data;

                  //var cars = data.from(new Set(array.map(({ type }) => type)));
                  //console.log(carValues);

                  //for(var i=0;i<obj.Data.length;i++)
                  //{

                  // var d= [obj.Data[i].type, parseInt(obj.Data[i].no_of_alarm)];
                   //p.push(d);

                  //}
                 // p.push([,])
                  //chart2(p);
                  //new_alarm=setInterval(getNewOneAlarm, 4000);

    
                  
                                                      }
                                                      }
                                                                } 
    
//var compid='<?php echo $_SESSION['j_username']; ?>';  
//alert(compid);
objXMLHttpRequest.open('GET', '../vaservice/vms_admin_vigroup_org_daily.php?sub_id='+org+"&from_date="+f_date+"&to_date="+t_date,true);
objXMLHttpRequest.send();







  }




function showvalue(){


fillData(_comp_id,frm_date.value,frm_to.value);

fillData2(_comp_id,frm_date.value,frm_to.value);

fillData3(_comp_id,frm_date.value,frm_to.value);

fillData4(_comp_id,frm_date.value,frm_to.value);

}







const d = new Date();
var date1= d.getFullYear()+"-"+ (parseInt(d.getMonth()+1))+"-"+ d.getDate()+" 06:00:00";

const d2=new Date(d- 24 * 60 * 60 * 1000);

var date2= d2.getFullYear()+"-"+ (parseInt(d2.getMonth()+1))+"-"+ d2.getDate()+" 06:00:00";

fillData(_comp_id,date2,date1);

fillData2(_comp_id,date2,date1);

fillData3(_comp_id,date2,date1);

fillData4(_comp_id,date2,date1);

//chart2(10);
