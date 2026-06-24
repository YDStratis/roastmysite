using RoastMySite.Core.Enums;
namespace RoastMySite.Core.Entities;

public class ScanRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Url { get; set; } = string.Empty;
    public string? BusinessType { get; set; }
    public string? TargetAudience { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ScanStatus Status { get; set; } = ScanStatus.Pending;

    
    public ScanReport? Report { get; set; }
}