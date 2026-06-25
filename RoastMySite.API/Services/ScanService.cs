using Microsoft.EntityFrameworkCore;
using RoastMySite.Core.Entities;
using RoastMySite.Core.Enums;
using RoastMySite.Infrastructure;
using RoastMySite.Infrastructure.AI;
using RoastMySite.Infrastructure.Crawling;
using RoastMySite.Infrastructure.ExternalApis;
using System.Text.Json;

namespace RoastMySite.API.Services;

public class ScanService
{
    private readonly AppDbContext _db;
    private readonly WebsiteCrawler _crawler;
    private readonly PageSpeedService _pageSpeed;
    private readonly ClaudeAiService _aiService;

    public ScanService(
        AppDbContext db,
        WebsiteCrawler crawler,
        PageSpeedService pageSpeed,
        ClaudeAiService aiService)
    {
        _db = db;
        _crawler = crawler;
        _pageSpeed = pageSpeed;
        _aiService = aiService;
    }

    public async Task<ScanReport> RunScanAsync(Guid scanRequestId)
    {
        var scanRequest = await _db.ScanRequests
            .FirstOrDefaultAsync(s => s.Id == scanRequestId)
            ?? throw new Exception("Scan request not found.");

        // Update status
        scanRequest.Status = ScanStatus.InProgress;
        await _db.SaveChangesAsync();

        try
        {
            
            var crawlResult = await _crawler.CrawlAsync(scanRequest.Url);

            
            var pageSpeedResult = await _pageSpeed.AnalyzeAsync(scanRequest.Url);

            
            var aiInput = new WebsiteAnalysisInput
            {
                Url = scanRequest.Url,
                Title = crawlResult.Title,
                MetaDescription = crawlResult.MetaDescription,
                H1 = crawlResult.H1,
                H2s = crawlResult.H2s,
                HasContactForm = crawlResult.HasContactForm,
                ImagesWithoutAlt = crawlResult.ImagesWithoutAlt,
                PerformanceScore = pageSpeedResult.PerformanceScore,
                SeoScore = pageSpeedResult.SeoScore,
                AccessibilityScore = pageSpeedResult.AccessibilityScore,
                BodyText = crawlResult.BodyText
            };

            var aiResult = await _aiService.AnalyzeWebsiteAsync(aiInput);

            
            var report = new ScanReport
            {
                ScanRequestId = scanRequestId,
                OverallScore = aiResult.OverallScore,
                OverallGrade = aiResult.OverallGrade,
                SeoScore = aiResult.SeoScore,
                UxScore = aiResult.UxScore,
                PerformanceScore = pageSpeedResult.PerformanceScore,
                TrustScore = aiResult.TrustScore,
                CompletenessScore = aiResult.CompletenessScore,
                TechScore = pageSpeedResult.BestPracticesScore,
                LegalScore = 50,
                RoastSummary = aiResult.RoastSummary,
                FullReportJson = JsonSerializer.Serialize(aiResult)
            };

            _db.ScanReports.Add(report);

            scanRequest.Status = ScanStatus.Completed;
            await _db.SaveChangesAsync();

            return report;
        }
        catch
        {
            scanRequest.Status = ScanStatus.Failed;
            await _db.SaveChangesAsync();
            throw;
        }
    }
}