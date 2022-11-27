﻿namespace student_risk_hero.Data.Models
{
    public class Student : BaseEntity
    {
        public string ProfilePicture { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime Birthdate { get; set; }
        public Guid Course { get; set; }
        public string MothersFullName { get; set; }
        public string FathersFullName { get; set; }
        public string PhoneNumber1 { get; set; }
        public string PhoneNumber2 { get; set; }
    }
}
