﻿namespace student_risk_hero.Contracts
{
    public interface IAuditable
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }

        public bool? IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public int? DeletedBy { get; set; }
    }
}