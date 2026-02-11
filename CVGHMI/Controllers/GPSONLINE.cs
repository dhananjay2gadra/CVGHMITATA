using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class GPSONLINE : Controller
    {
        public async Task<IActionResult> Index()
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
                var ownerinfos = await vehicleDataService.GetOwnerInfoAsync(profile_id);
                return View(ownerinfos);
            }
        }
    }
}
