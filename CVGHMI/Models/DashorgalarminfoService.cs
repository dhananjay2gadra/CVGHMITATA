using System.Text.Json;

namespace CVGHMI.Models
{
    public class DashorgalarminfoService
    {

        public async Task<List<Dashorgalarminfo>> GetDashorgalarminfosAsync(string profile_id)
        {
            string url = $"{ConnectionSettings.connurl}dashorgalarminfo/{profile_id}";

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    // Send the GET request
                    HttpResponseMessage response = await client.GetAsync(url);
                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();

                        // Deserialize the JSON response into a list of UserProfile objects
                        List<Dashorgalarminfo> listdashorgalarminfo = JsonSerializer.Deserialize<List<Dashorgalarminfo>>(jsonResponse);

                        return listdashorgalarminfo;

                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception ex)
                {
                    return null;
                }
            }


        }
    }
}
