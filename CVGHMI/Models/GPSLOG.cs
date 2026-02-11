namespace CVGHMI.Models
{
    public class GPSLOG
    {
        private double _latitude;
        private double _longitude;
        public int seq_no { get; set; }
        public string vehicle_id { get; set; }
        public string device_id { get; set; }
        public string gps_time { get; set; }
        
        public double longitude
        {
            set {
                _longitude = value;
            }

            get
            {
                return _longitude / 1000000.0;
            }
        }
            public double latitude
        {
            set
            {
                _latitude = value;
            }

            get
            {
                return _latitude / 1000000.0;
            }
        }

            public double gps_speed { get; set; }

       
}
}
