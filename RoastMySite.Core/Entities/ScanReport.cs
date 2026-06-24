namespace RoastMySite.Core.Entities;

public class ScanReport
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ScanRequestId { get; set; }

    // Scores
    public int OverallScore { get; set; }
    public int SeoScore { get; set; }
    public int UxScore { get; set; }
    public int PerformanceScore { get; set; }
    public int TrustScore { get; set; }
    public int CompletenessScore { get; set; }
    public int TechScore { get; set; }
    public int LegalScore { get; set; }

    // Roast
    public string OverallGrade { get; set; } = string.Empty;
    public string RoastSummary { get; set; } = string.Empty;
    public string FullReportJson { get; set; } = string.Empty;

    // Meta
    public bool IsPaid { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ScanRequest? ScanRequest { get; set; }
}