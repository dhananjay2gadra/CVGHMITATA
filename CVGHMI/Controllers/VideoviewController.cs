using CVGHMI.Models.Location;
using CVGHMI.Models;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class VideoviewController : Controller
    {
        public async  Task<IActionResult> Index()
        {

            String usr_id = HttpContext.Session.GetString("usr_id");
            String profile_id = HttpContext.Session.GetString("profile_id");

            VehicleDataService vehicleDataService = new VehicleDataService();
            if (usr_id == null || usr_id == "")
            {
                return RedirectToAction("Index", "Login");

            }
            else
            {
                ViewBag.usr_id = usr_id;
                ViewBag.profile_id = profile_id;
                Profile profile = await vehicleDataService.GetProfileDataAsync(profile_id);

                LocData locData = new LocData();
                locData.profile = profile;
                locData.ownerInfos = await vehicleDataService.GetOwnerInfoAsync(profile_id);

                return View(locData);
            }

            //return View();
        }
    }
}
