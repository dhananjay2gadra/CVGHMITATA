using CVGHMI.Models;
using CVGHMI.Models.Location;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;
using Mysqlx.Crud;
using System.Collections.Generic;

namespace CVGHMI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DataController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("GetVehicleOwnerData/{ownerId}")]
        public async Task<IActionResult> GetVehicleOwnerData(string ownerId)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetVehicleDataOwnerAsync(ownerId);
            return Ok(data);
        }

        [HttpGet("GetVehicleData/{plateNo}")]
        public async Task<IActionResult> GetVehicleData(string plateNo)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetVehicleDataAsync(plateNo);
            return Ok(data);
        }


        [HttpGet("GetOwnerAlarmSummary/{ownerId}")]
        public async Task<IActionResult> GetOwnerAlarmSummary(string ownerId)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetOwnerAlarmSummaryAsync(ownerId);
            return Ok(data);
        }

        [HttpGet("GetOwnerDtAlarm/{ownerId}")]
        public async Task<IActionResult> GetOwnerDtAlarm(string ownerId)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetOwnerDtAlarmAsync(ownerId);
            return Ok(data);
        }


        [HttpGet("GetOwnerInfo/{profileid}")]
        public async Task<IActionResult> GetOwnerInfo(string profileid)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetOwnerInfoAsync(profileid);
            return Ok(data);
        }



        [HttpGet("GetOwnerVehicle/{profileid}/{ownerid}")]
        public async Task<IActionResult> GetOwnerVehicle(string profileid, string ownerid)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.OwnerVehicleAsync(profileid, ownerid);
            return Ok(data);
        }

        [HttpGet("GetOwnerdtVehicle/{profileid}/{ownerid}")]
        public async Task<IActionResult> GetOwnerdtVehicle(string profileid, string ownerid)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.OwnerdtVehicleAsync(profileid, ownerid);
            return Ok(data);
        }





        //GetDeviceModalAsync
        [HttpGet("GetDeviceSession")]
        public async Task<IActionResult> GetDeviceModal()
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetDeviceModalAsync();
            return Ok(data);
        }



        [HttpGet("Query/{owner}/{startDate}/{endDate}/{type}")]
        public async Task<IActionResult> GetQueryData(string owner, string startDate, string endDate, string type)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.FetchQueryDataAsync(owner, startDate, endDate, type);
            return Ok(data);
        }



        [HttpGet("Profile/{pid}")]
        public async Task<IActionResult> GetProfileData(string pid)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetProfileDataAsync(pid);
            return Ok(data);
        }


        [HttpGet("GetGps/{pid}")]
        public async Task<IActionResult> GetGpsData(string pid)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetGpsAsync(pid);
            return Ok(data);
        }

        [HttpGet("GetAlarmInfo/{pid}")]
        public async Task<IActionResult> GetAlarmData(string pid)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetAlarmAsync(pid);
            return Ok(data);
        }


        [HttpGet("GetContact/{ownerid}")]
        public async Task<IActionResult> GetContact(string ownerid)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetContactAsync(ownerid);
            return Ok(data);
        }




        [HttpGet("GetOffline/{ppid}/{logdate}")]
        public async Task<IActionResult> GetContact(string ppid, string logdate)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetOfflineAsync(ppid, logdate);
            return Ok(data);
        }



        [HttpGet("GetAlarmtotalrank/{pwonerid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetAlarmtotalrank(string pwonerid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetAlarmtotalrankAsync(pwonerid, pfromdt, ptodt);
            return Ok(data);
        }

        //getAlarmrank

        [HttpGet("GetAlarmrank/{palate_no}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetAlarmrank(string palate_no, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetAlarmrankAsync(palate_no, pfromdt, ptodt);
            return Ok(data);
        }


        [HttpGet("GetDevice/{owner_id}")]
        public async Task<IActionResult> GetDevice(string owner_id)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetDeviceAsync(owner_id);
            return Ok(data);
        }


        [HttpGet("GetUserInfo/{padid}")]
        public async Task<IActionResult> GetUserInfo(string padid)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetUserInfoAsync(padid);
            return Ok(data);
        }






        [HttpPost("Call/")]
        public async Task<IActionResult> MakeCall([FromBody] CallReq callReq)
        {
            //if (callReq == null)
            // {
            // //   return BadRequest("Invalid request data.");
            // }

            // Optional: Add validation logic if needed
            // if (!ModelState.IsValid)
            // {
            //    return BadRequest(ModelState);
            // }

            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.voicecallAsync(callReq.cid);

            return Ok(data);
        }

        [HttpPost("voicemulticall/")]
        public async Task<IActionResult> voicemulticall([FromBody] CallReq callReq)
        {
            //if (callReq == null)
            // {
            // //   return BadRequest("Invalid request data.");
            // }

            // Optional: Add validation logic if needed
            // if (!ModelState.IsValid)
            // {
            //    return BadRequest(ModelState);
            // }

            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.voicemulticallAsync(callReq.cid);

            return Ok(data);
        }








        [HttpPost("CallEnd/")]
        public async Task<IActionResult> MakeCallEnd([FromBody] CallReq callReq)
        {
            //if (callReq == null)
            // {
            // //   return BadRequest("Invalid request data.");
            // }

            // Optional: Add validation logic if needed
            // if (!ModelState.IsValid)
            // {
            //    return BadRequest(ModelState);
            // }

            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.VoiceCallEndAsync(callReq.cid);

            return Ok(data);
        }


        [HttpPost("VideoStart/")]
        public async Task<IActionResult> VideoStart([FromBody] VideoReq videoReq)
        {
            //if (callReq == null)
            // {
            // //   return BadRequest("Invalid request data.");
            // }

            // Optional: Add validation logic if needed
            // if (!ModelState.IsValid)
            // {
            //    return BadRequest(ModelState);
            // }

            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.VideocallAsync(videoReq.cid, videoReq.channel);

            return Ok(data);
        }

        [HttpPost("VideoStart2/")]
        public async Task<IActionResult> VideoStart2([FromBody] VideoReq videoReq)
        {
            //if (callReq == null)
            // {
            // //   return BadRequest("Invalid request data.");
            // }

            // Optional: Add validation logic if needed
            // if (!ModelState.IsValid)
            // {
            //    return BadRequest(ModelState);
            // }

            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.VideocallAsynctwo(videoReq.cid, videoReq.channel);

            return Ok(data);
        }






        [HttpPost("VideoEnd/")]
        public async Task<IActionResult> VideoEnd([FromBody] VideoReq videoReq)
        {
            //if (callReq == null)
            // {
            // //   return BadRequest("Invalid request data.");
            // }

            // Optional: Add validation logic if needed
            // if (!ModelState.IsValid)
            // {
            //    return BadRequest(ModelState);
            // }

            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.VideoCallEndAsync(videoReq.cid, videoReq.channel);

            return Ok(data);
        }


        //
        // Task<List<GpsInfo>> GetOnlineAsync(string ownerid, string pfromdt, string ptodt)
        [HttpGet("GetOnline/{ownerid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetOnline(string ownerid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetOnlineAsync(ownerid, pfromdt, ptodt);
            return Ok(data);
        }

        [HttpGet("Getgpsdis24hrs/{ownerid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> Getgpsdis24hrs(string ownerid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.Getgpsdis24hrsAsync(ownerid, pfromdt, ptodt);
            return Ok(data);
        }

        [HttpGet("Getgpslogs/{ownerid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> Getgpslogs(string ownerid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetgpslogsAsync(ownerid, pfromdt, ptodt);
            return Ok(data);
        }
        [HttpGet("Getalarmsumraw/{profileid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> Getalarmsumraw(string profileid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            return Ok(data);
        }

        #region group_page



        [HttpGet("GetTop10gr/{profileid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetTop10gr(string profileid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            List<Alarmraw> data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            var d = data.GroupBy(a => new {a.owner_id, a.plate_no })
                  .Select(g => new
                  {
                      name = g.Key.owner_id+"/"+g.Key.plate_no,

                      y =g.Sum(p=>(p.ect+p.yt))
                     


                  }

                ).OrderByDescending(a => a.y)
                .Take(10)

                .ToList();

            return Ok(d);
        }




        [HttpGet("GetOwneralarmsumraw/{profileid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetOwneralarmsumraw(string profileid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            List < Alarmraw > data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            var d = data.GroupBy(a => new { a.owner_id })
                  .Select(g => new
                  {
                      owner_id = g.Key.owner_id,
                      
                      totalal = g.Sum(p => p.total)

                  }

                ).OrderBy(a => a.owner_id)
                
                .ToList();

            return Ok(d);
        }

        [HttpGet("GetOwneralarmsumrawpi/{profileid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetOwneralarmsumrawpi(string profileid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            List<Alarmraw> data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            var d = data.Aggregate(new { daa = 0, ec = 0, ld=0, sb=0, sm = 0, tel = 0, yawn=0 },
                (acc, o) => new
                {
daa=acc.daa+o.dalt,
ec=acc.ec+o.ect,
ld=acc.ld+o.ldt,
sb=acc.sb+o.seatbelt,
sm=acc.sm+o.smokingt,
tel=acc.tel+o.telt,
yawn=acc.yawn+o.yt
                }
                );

            return Ok(d);
        }



        [HttpGet("GetOwneralarmsumrawdt/{profileid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetOwneralarmsumrawdt(string profileid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            List<Alarmraw> data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            var d = data.GroupBy(a => new { a.owner_id,a.aldate })
                  .Select(g => new
                  {
                      owner_id = g.Key.owner_id,
                      aldate=g.Key.aldate,
                      totalal = g.Sum(p => p.total)

                  }

                ).OrderBy(a => a.owner_id)
                .ThenBy(r=>r.aldate)

                .ToList();

            return Ok(d);
        }


        #endregion


        #region organizationpage

        [HttpGet("GetOrgalarmsumraw/{profileid}/{ownerid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetOrgalarmsumraw(string profileid,string ownerid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            List<Alarmraw> data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            var d = data.Where(s=>s.owner_id==ownerid)
                  .GroupBy(a => new { a.plate_no })
                  .Select(g => new
                  {
                      plate_no = g.Key.plate_no,

                      totalal = g.Sum(p => p.total)

                  }

                ).
                
                OrderBy(a => a.plate_no)

                .ToList();

            return Ok(d);
        }



        [HttpGet("GetOrgalarmsumrawdt/{profileid}/{ownerid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetOrgalarmsumrawdt(string profileid, string ownerid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            List<Alarmraw> data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            var d = data.Where(s => s.owner_id == ownerid)
                  
                  .Select(g => new
                  {
                      plate_no = g.plate_no,
                      dvtime = g.aldate,
                      totalal = g.total

                  }

                ).

                OrderBy(a => a.plate_no)

                .ToList();

            return Ok(d);
        }
        [HttpGet("GetTop10org/{owner_id}/{profileid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> GetTop10org(string owner_id,string profileid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            List<Alarmraw> data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            var d = data.Where(s=>s.owner_id==owner_id)
                .GroupBy(a => new { a.plate_no })
                  .Select(g => new
                  {
                      name =  g.Key.plate_no,

                      y = g.Sum(p => (p.ect + p.yt))



                  }

                ).OrderByDescending(a => a.y)
                .Take(10)

                .ToList();

            return Ok(d);
        }

        [HttpGet("Getorgalarmsumrawpi/{owner_id}/{profileid}/{pfromdt}/{ptodt}")]
        public async Task<IActionResult> Getorgalarmsumrawpi(string owner_id,string profileid, string pfromdt, string ptodt)
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            List<Alarmraw> data = await vehicleDataService.GetalarmsumrawAsync(profileid, pfromdt, ptodt);
            var d = data.Where(s=>s.owner_id==owner_id)
                
                .Aggregate(new { daa = 0, ec = 0, ld = 0, sb = 0, sm = 0, tel = 0, yawn = 0 },
                (acc, o) => new
                {
                    daa = acc.daa + o.dalt,
                    ec = acc.ec + o.ect,
                    ld = acc.ld + o.ldt,
                    sb = acc.sb + o.seatbelt,
                    sm = acc.sm + o.smokingt,
                    tel = acc.tel + o.telt,
                    yawn = acc.yawn + o.yt
                }
                );

            return Ok(d);
        }
        #endregion

        #region videopage
        [HttpGet("Getvideosession")]
        public async Task<IActionResult> Getvideosession()
        {
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.LiveVideoSession();
            return Ok(data);
        }

        #endregion

    }
}
