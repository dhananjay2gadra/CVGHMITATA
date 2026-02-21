using CVGHMI.Models;
using CVGHMI.Models.Location;
using CVGHMI.Services;

using Microsoft.AspNetCore.Mvc;

namespace CVGHMI.Controllers
{
    public class Video : Controller
    {
        public async Task<IActionResult> Index()
        {
            // String usr_id = HttpContext.Session.GetString("usr_id");
            // String profile_id = HttpContext.Session.GetString("profile_id");

            Response.Cookies.Delete(".AspNetCore.Session");
            ContextRequestInfo contextRequestInfo = new ContextRequestInfo();
            UserInfoData userInfoData = await contextRequestInfo.UserInfo(HttpContext);



            VehicleDataService vehicleDataService = new VehicleDataService();
            Profile profile = await vehicleDataService.GetProfileDataAsync(userInfoData.profile_id);

            LocData locData = new LocData();
            locData.profile = profile;
            locData.ownerInfos = await vehicleDataService.GetOwnerInfoAsync(userInfoData.profile_id);

            return View(locData);
        }
    }
}
