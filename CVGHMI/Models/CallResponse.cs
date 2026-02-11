using System.Text.Json.Serialization;

namespace CVGHMI.Models
{
    public class CallResponse
    {
        [JsonPropertyName("code")]
        public int Code { get; set; }

        [JsonPropertyName("msg")]
        public string Msg { get; set; }

        [JsonPropertyName("detailMsg")]
        public string DetailMsg { get; set; }

        [JsonPropertyName("data")]
        public Data Data { get; set; }

        [JsonPropertyName("success")]
        public bool Success { get; set; }

    }

    public class Data
    {
        [JsonPropertyName("messageId")]
        public int MessageId { get; set; }

        [JsonPropertyName("properties")]
        public int Properties { get; set; }

        [JsonPropertyName("protocolVersion")]
        public int ProtocolVersion { get; set; }

        [JsonPropertyName("clientId")]
        public string ClientId { get; set; }

        [JsonPropertyName("serialNo")]
        public int SerialNo { get; set; }

        [JsonPropertyName("packageTotal")]
        public int PackageTotal { get; set; }

        [JsonPropertyName("packageNo")]
        public int PackageNo { get; set; }

        [JsonPropertyName("verified")]
        public bool Verified { get; set; }

        [JsonPropertyName("responseSerialNo")]
        public int ResponseSerialNo { get; set; }

        [JsonPropertyName("responseMessageId")]
        public int ResponseMessageId { get; set; }

        [JsonPropertyName("resultCode")]
        public int ResultCode { get; set; }

        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("version")]
        public bool Version { get; set; }

        [JsonPropertyName("bodyLength")]
        public int BodyLength { get; set; }

        [JsonPropertyName("subpackage")]
        public bool Subpackage { get; set; }

        [JsonPropertyName("encryption")]
        public int Encryption { get; set; }

        [JsonPropertyName("reserved")]
        public bool Reserved { get; set; }
    }

}
