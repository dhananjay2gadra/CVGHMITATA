using Microsoft.Extensions.Hosting;
using Org.BouncyCastle.Ocsp;
using static System.Net.Mime.MediaTypeNames;
using System;
using Mysqlx.Crud;

namespace CVGHMI.Models
{
    public class Alarmraw
    {
        public int seq { get;set; }
        public string plate_no  { get;set; }
        public string owner_id     { get;set; }
        public int total  { get;set; }
        public int dalt  { get;set; }
        public int ect  { get;set; }
        public int ldt  { get;set; }
        public int seatbelt  { get;set; }
        public int smokingt  { get;set; }
        public int sost  { get;set; }
        public int telt  { get;set; }
        public int yt  { get;set; }
        public int aut  { get;set; }
        public int overspt  { get;set; }
        public string aldate  { get;set; }
    }
}
