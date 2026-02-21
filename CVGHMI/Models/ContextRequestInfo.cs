using CVGHMI.Services;
using static Google.Apis.Requests.BatchRequest;

namespace CVGHMI.Models
{
    public class ContextRequestInfo
    {
        public async Task<UserInfoData>  UserInfo(HttpContext context)
        {
            context.Session.Clear();
            //Response.Cookies.Delete(".AspNetCore.Session");


            var adid = context.User.Identity.Name;
            //ViewBag.adid = adid;
            var usrname = "";
            if (adid != null)
            {
                var info = adid.Split('\\');
                if (info.Length > 0)
                {
                    //ViewBag.adid = info[0] + "," + info[1];
                    usrname = info[1];
                }
            }


            //usrname = "dhan";
            VehicleDataService vehicleDataService = new VehicleDataService();
            var data = await vehicleDataService.GetUserInfoAsync(usrname);
            UserInfoData userInfoData = new UserInfoData();

            if (data.Count > 0) 
            { 
            userInfoData.usr_id = data[0].adid.ToString();//);// userProfiles[0].user_id.ToString());
            userInfoData.profile_id = data[0].profileid.ToString();// userProfiles[0].profileid.ToString());
            userInfoData.usr_role = data[0].role.ToString();
            }

            return userInfoData;
        }

        public string getadid(HttpContext context)
        {
            var adid = context.User.Identity.Name;
            //ViewBag.adid = adid;
            var usrname = "";
            if (adid != null)
            {
                var info = adid.Split('\\');
                if (info.Length > 0)
                {
                    //ViewBag.adid = info[0] + "," + info[1];
                    usrname = info[1];
                }
            }
            return usrname;
        }


        //public string getUserInfo(string usrname)
    }
}
