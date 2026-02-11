namespace CVGHMI.Models.Location
{
    public class Alarminfo
    {
        public  string plate_no { get; set; }
         public string device_id { get; set; }
         public string device_model { get; set; }
         public string maker_id { get; set; }
         public string plate_color { get; set; }
         public string province_id { get; set; }
         public string owner_id { get; set; }
         public int id { get; set; }
         public int latitude { get; set; }
         public int longitude { get; set; }
        // public int speed { get; set; }

        private int _speed;
        public int speed
        {
            get;set;
        }
        public float speedf
        {
            get { return speed / 10.0f; }
        }
        public string type { get; set; }
         public int direction { get; set; }
         public string devicetime { get; set; }
         public int alarmid { get; set; }
         public string deviceid { get; set; }
         public string path { get; set; }
         public string log_time { get; set; }
         public string pic { get; set; }
         public string vid { get; set; }

        public string priority
        {
            get {
            if(type== "Eye Closure")
                {
                    return "Critical";
                }
            else if(type== "Seat Belt" || type== "Telephone" || type=="Yawning" || type.Split(' ')[0]=="Overspeed")
                {
                    return "Warning";
                }
                else
                {
                    return "Others";
                }
            
            }
        }

    }
}
