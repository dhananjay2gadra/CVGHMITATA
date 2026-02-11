
namespace CVGHMI.Models
{
    public class DeviceModal
    {

        public bool Udp { get; set; }
        public string RemoteAddressStr { get; set; }
        public string CreationTime { get; set; }
        public string LastAccessedTime { get; set; }
        public Attributes attributes { get; set; }
        public string ClientId { get; set; }
        public bool Registered { get; set; }
        public string Id { get; set; }
        public List<string> AttributeNames { get; set; }


        public class DeviceLocation
        {
            public int WarnBit { get; set; }
            public int StatusBit { get; set; }
            public int Latitude { get; set; }
            public int Longitude { get; set; }
            public int Altitude { get; set; }
            public int Speed { get; set; }
            public int Direction { get; set; }
            public string DeviceTime { get; set; }
            public double Lng { get; set; }
            public double Lat { get; set; }
            public double SpeedKph { get; set; }
        }

        public class Device
        {
            public string DeviceId { get; set; }
            public string MobileNo { get; set; }
            public string PlateNo { get; set; }
            public int ProtocolVersion { get; set; }
            public DeviceLocation Location { get; set; }
        }

        public class Attributes
        {
            public Device Device { get; set; }
        }

    }
}