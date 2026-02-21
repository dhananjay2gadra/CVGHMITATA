using CVGHMI.Models;
using CVGHMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class Alarm24Controller : Controller
    {
        public async Task<IActionResult> Index()
        {
            Response.Cookies.Delete(".AspNetCore.Session");
            //String usr_id = HttpContext.Session.GetString("usr_id");
            //String profile_id = HttpContext.Session.GetString("profile_id");
            VehicleDataService vehicleDataService = new VehicleDataService();

            ContextRequestInfo contextRequestInfo = new ContextRequestInfo();
            UserInfoData userInfoData = await contextRequestInfo.UserInfo(HttpContext);

            if (userInfoData.usr_id == null)
            {
                return RedirectToAction("Index", "Login");

            }
            else
            {
                ViewBag.usr_id = userInfoData.usr_id;
                ViewBag.profile_id = userInfoData.profile_id;
                ViewBag.usr_role = userInfoData.usr_role;
                var ownerinfos = await vehicleDataService.GetOwnerInfoAsync(userInfoData.profile_id);
                return View(ownerinfos);
            }
        }
    }
}
