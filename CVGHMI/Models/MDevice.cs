namespace CVGHMI.Models
{
    using System;

    public class MDevice
    {
        public bool Udp { get; set; }
        public string RemoteAddressStr { get; set; }
        public string CreationTime { get; set; } // JSON represents timestamps as strings
        public string LastAccessedTime { get; set; } // JSON represents timestamps as strings
        public DeviceAttributes Attributes { get; set; }
        public string ClientId { get; set; }
        public bool Registered { get; set; }
        public string Id { get; set; }
        public string[] AttributeNames { get; set; }

        public class DeviceAttributes
        {
            public Device Device { get; set; }
        }

        public class Device
        {
            public string DeviceId { get; set; }
            public string MobileNo { get; set; }
            public string PlateNo { get; set; }
            public int ProtocolVersion { get; set; }
            public Location Location { get; set; }
        }

        public class Location
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
            public int SpeedKph { get; set; }
        }
    }

}
