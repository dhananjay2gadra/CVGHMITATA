using CVGHMI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;

namespace CVGHMI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

  



        public async Task<IActionResult> Index( )
        {

            Response.Cookies.Delete(".AspNetCore.Session");

            //String usr_id=  HttpContext.Session.GetString("usr_id");
            //String profile_id=  HttpContext.Session.GetString("profile_id");
            ContextRequestInfo contextRequestInfo = new ContextRequestInfo();
            UserInfoData userInfoData = await contextRequestInfo.UserInfo(HttpContext);




            if (userInfoData.usr_id==null)
            {
               return RedirectToAction("Index", "Login");
                
            }
            else
            {
                ViewBag.usr_id = userInfoData.usr_id;
                ViewBag.profile_id = userInfoData.profile_id;
                ViewBag.usr_role = userInfoData.usr_role;

                DashInfoService dashInfoService = new DashInfoService();
                DashorgalarminfoService dashorgalarminfoService = new DashorgalarminfoService();

                var dashInfos = await dashInfoService.GetDashInfoAsync(userInfoData.profile_id);
                var dashorgalarminfos = await dashorgalarminfoService.GetDashorgalarminfosAsync(userInfoData.profile_id);


                if ( dashInfos != null && dashInfos.Count > 0 )
                {
                    ViewBag.seqnum= dashInfos[0].seqnum;    
                    ViewBag.nodevice= dashInfos[0].nodevice;
                    ViewBag.owner = dashInfos[0].owner;
                    ViewBag.totalalarm= dashInfos[0].totalalarm;  
                    ViewBag.doffline= dashInfos[0].doffline;


                }
                else
                {
                    ViewBag.seqnum = "00";
                    ViewBag.nodevice = "00";
                    ViewBag.owner = "00";
                    ViewBag.totalalarm = "00";
                }


                //Task<List<DashInfo>> ldashingo = dashInfoService.dashInfoService(profile_id);
                

                return View(dashorgalarminfos);
           }



            
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}