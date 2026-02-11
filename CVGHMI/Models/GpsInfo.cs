using System.Security.Permissions;

namespace CVGHMI.Models
{
    public class GpsInfo
    {
        public int seq_no { get; set; }
        public double discover { get; set; }
        public double totalhr { get; set; }
        public string plate_no { get; set; }
        public string fromdt { get; set; }
        public string todt { get; set; }


    }
}
