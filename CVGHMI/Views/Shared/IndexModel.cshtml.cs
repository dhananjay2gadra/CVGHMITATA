using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CVGHMI.Views.Shared
{
    public class IndexModelModel : PageModel
    {
        private readonly IHttpContextAccessor _httpContextAccessor;


        public IndexModelModel(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        // Properties and methods for the Page Model
        public string UserId { get; set; }
        public string ProfileId { get; set; }

        // OnGet method for handling GET requests
        public void OnGet()
        {
            UserId = _httpContextAccessor.HttpContext.Session.GetString("usr_id");
            ProfileId = _httpContextAccessor.HttpContext.Session.GetString("profile_id");

            if (string.IsNullOrEmpty(UserId))
            {

                Response.Redirect("/Login/Index");
            }

            // Additional logic can be added here
        }


       
    }
}
