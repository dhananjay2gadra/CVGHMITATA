namespace CVGHMI.Models.Location
{
    public class CallRequest
    {
        public string clientId{get;set;}
        public string ip { get; set; }
        public int tcpPort { get; set; }
        public int udpPort { get; set; }
        public int channelNo { get; set; } 
        public int mediaType { get; set; }
        public int streamType { get; set; }



    }
}
