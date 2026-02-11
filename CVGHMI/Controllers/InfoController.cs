using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class InfoController : Controller
    {
        public async Task<IActionResult> Index()
        {

            var adid = HttpContext.User.Identity.Name;
            if (adid != null)
            {
                var info = adid.Split('\\');
                var usrname = "";
                if (info.Length > 0)
                {
                    ViewBag.adid = info[1];
                    usrname = info[1];


                    VehicleDataService vehicleDataService = new VehicleDataService();
                    var data = await vehicleDataService.GetUserInfoAsync(usrname);
                    if (data.Count <= 0)
                    {
                        return View();

                    }
                    else
                    {
                        HttpContext.Session.SetString("usr_id", data[0].adid.ToString());// userProfiles[0].user_id.ToString());
                        HttpContext.Session.SetString("profile_id", data[0].profileid.ToString());// userProfiles[0].profileid.ToString());
                        HttpContext.Session.SetString("usr_role", data[0].role.ToString());
                        return RedirectToAction("Index", "Home");

                        //return View("Index", null);
                    }
                }
                else
                {
                    return View();
                }



            }
            else
            {

                //producation environment
               //ViewBag.adid = "AD/ID ...";
               //return View();

                //developer environment
               HttpContext.Session.SetString("usr_id", "dhan");// userProfiles[0].user_id.ToString());
               HttpContext.Session.SetString("profile_id", "p001");// userProfiles[0].profileid.ToString());
               HttpContext.Session.SetString("usr_role", "pdmin");
               return RedirectToAction("Index", "Home");
            }
            
        }
    }
}
