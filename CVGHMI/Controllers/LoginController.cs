using CVGHMI.Models;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CVGHMI.Controllers
{
    public class LoginController : Controller
    {
        public async Task<IActionResult> Index()
        {
            //var adid = HttpContext.User.Identity.Name;
            //ViewBag.adid = adid;
            // var usrname = "";
            // if (adid != null)
            // {
            //    var info = adid.Split('\\');
            //   if (info.Length > 0)
            //   {
            //ViewBag.adid = info[0] + "," + info[1];
            //usrname = info[1];
            //   }
            //}
            //else
            // {


            //    ViewBag.adid = adid;
            // }
            Response.Cookies.Delete(".AspNetCore.Session");
            ContextRequestInfo contextRequestInfo = new ContextRequestInfo();
            UserInfoData userInfoData = await contextRequestInfo.UserInfo(HttpContext);



             //VehicleDataService vehicleDataService = new VehicleDataService();
           // var data = await vehicleDataService.GetUserInfoAsync(usrname);
           if(userInfoData.usr_id==null)
            {
                // 🔐 Clear old session (prevents fixation)
                HttpContext.Session.Clear();
                // 🔴 2. Remove existing session cookie
                HttpContext.Response.Cookies.Delete(".AspNetCore.Session");
                return RedirectToAction("Index", "Info");
            }
            else
            {
                // 🔐 Clear old session (prevents fixation)
                //HttpContext.Session.Clear();
                // 🔴 2. Remove existing session cookie
                //HttpContext.Response.Cookies.Delete(".AspNetCore.Session");

                //HttpContext.Session.SetString("usr_id", data[0].adid.ToString());// userProfiles[0].user_id.ToString());
                //HttpContext.Session.SetString("profile_id", data[0].profileid.ToString());// userProfiles[0].profileid.ToString());
                //HttpContext.Session.SetString("usr_role", data[0].role.ToString());
                return RedirectToAction("Index", "Home");

                //return View("Index", null);
            }


            
           
        }



    }
}
