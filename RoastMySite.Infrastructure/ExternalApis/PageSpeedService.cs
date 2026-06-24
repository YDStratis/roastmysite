using System.Text.Json;

namespace RoastMySite.Infrastructure.ExternalApis;

public class PageSpeedService
{
    private readonly HttpClient _httpClient;
    private readonly string? _apiKey;

    public PageSpeedService(HttpClient httpClient, string? apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
    }

    public async Task<PageSpeedResult> AnalyzeAsync(string url)
    {
        var result = new PageSpeedResult();

        try
        {
            var apiUrl = $"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={Uri.EscapeDataString(url)}&strategy=mobile";

            if (!string.IsNullOrEmpty(_apiKey))
                apiUrl += $"&key={_apiKey}";

            var response = await _httpClient.GetStringAsync(apiUrl);
            var json = JsonDocument.Parse(response);

            var categories = json.RootElement
                .GetProperty("lighthouseResult")
                .GetProperty("categories");

            // Performance score (0-100)
            if (categories.TryGetProperty("performance", out var perf))
                result.PerformanceScore = (int)(perf.GetProperty("score").GetDouble() * 100);

            // Accessibility score
            if (categories.TryGetProperty("accessibility", out var acc))
                result.AccessibilityScore = (int)(acc.GetProperty("score").GetDouble() * 100);

            // SEO score
            if (categories.TryGetProperty("seo", out var seo))
                result.SeoScore = (int)(seo.GetProperty("score").GetDouble() * 100);

            // Best practices
            if (categories.TryGetProperty("best-practices", out var bp))
                result.BestPracticesScore = (int)(bp.GetProperty("score").GetDouble() * 100);

            result.IsSuccess = true;
        }
        catch (Exception ex)
        {
            result.IsSuccess = false;
            result.ErrorMessage = ex.Message;

            // Default scores if API fails
            result.PerformanceScore = 50;
            result.AccessibilityScore = 50;
            result.SeoScore = 50;
            result.BestPracticesScore = 50;
        }

        return result;
    }
}

public class PageSpeedResult
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public int PerformanceScore { get; set; }
    public int AccessibilityScore { get; set; }
    public int SeoScore { get; set; }
    public int BestPracticesScore { get; set; }
}