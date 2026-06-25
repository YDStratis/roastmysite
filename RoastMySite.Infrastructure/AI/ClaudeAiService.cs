using System.Text;
using System.Text.Json;

namespace RoastMySite.Infrastructure.AI;

public class ClaudeAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public ClaudeAiService(HttpClient httpClient, string apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
    }

    public async Task<AiAnalysisResult> AnalyzeWebsiteAsync(WebsiteAnalysisInput input)
    {
        var prompt = BuildPrompt(input);

        var requestBody = new
        {
            model = "deepseek-chat",
            max_tokens = 2000,
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(
            "https://api.deepseek.com/v1/chat/completions", content);

        var responseJson = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(responseJson);

        var text = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "";

        return ParseResponse(text);
    }

    private string BuildPrompt(WebsiteAnalysisInput input)
    {
        var jsonTemplate = @"{
            ""overallGrade"": ""B"",
            ""overallScore"": 72,
            ""seoScore"": 65,
            ""uxScore"": 70,
            ""completenessScore"": 75,
            ""trustScore"": 68,
            ""roastSummary"": ""A funny but honest 2-3 sentence roast of this website"",
            ""criticalIssues"": [""issue 1"", ""issue 2"", ""issue 3""],
            ""quickWins"": [""fix 1"", ""fix 2"", ""fix 3""],
            ""proReport"": ""A professional 3-4 sentence summary for the paid report""
        }";

        return $"""
            You are a brutally honest website auditor with a sharp sense of humor.
            Analyze this website data and provide a roast-style audit.

            URL: {input.Url}
            Title: {input.Title ?? "Missing!"}
            Meta Description: {input.MetaDescription ?? "Missing!"}
            H1: {input.H1 ?? "Missing!"}
            H2s: {string.Join(", ", input.H2s)}
            Has Contact Form: {input.HasContactForm}
            Images without alt text: {input.ImagesWithoutAlt}
            Performance Score: {input.PerformanceScore}/100
            SEO Score: {input.SeoScore}/100
            Accessibility Score: {input.AccessibilityScore}/100
            Body Text Preview: {input.BodyText?[..Math.Min(1000, input.BodyText?.Length ?? 0)]}

            Respond ONLY with a JSON object in this exact format, no markdown:
            {jsonTemplate}
            """;
    }

    private AiAnalysisResult ParseResponse(string text)
    {
        try
        {
            var clean = text.Trim();
            if (clean.StartsWith("```json"))
                clean = clean[7..];
            if (clean.StartsWith("```"))
                clean = clean[3..];
            if (clean.EndsWith("```"))
                clean = clean[..^3];
            clean = clean.Trim();

            var doc = JsonDocument.Parse(clean);
            var root = doc.RootElement;

            return new AiAnalysisResult
            {
                OverallGrade = root.GetProperty("overallGrade").GetString() ?? "C",
                OverallScore = root.GetProperty("overallScore").GetInt32(),
                SeoScore = root.GetProperty("seoScore").GetInt32(),
                UxScore = root.GetProperty("uxScore").GetInt32(),
                CompletenessScore = root.GetProperty("completenessScore").GetInt32(),
                TrustScore = root.GetProperty("trustScore").GetInt32(),
                RoastSummary = root.GetProperty("roastSummary").GetString() ?? "",
                CriticalIssues = root.GetProperty("criticalIssues")
                    .EnumerateArray()
                    .Select(x => x.GetString() ?? "")
                    .ToList(),
                QuickWins = root.GetProperty("quickWins")
                    .EnumerateArray()
                    .Select(x => x.GetString() ?? "")
                    .ToList(),
                ProReport = root.GetProperty("proReport").GetString() ?? ""
            };
        }
        catch
        {
            return new AiAnalysisResult
            {
                OverallGrade = "C",
                OverallScore = 50,
                RoastSummary = "We couldn't roast your site properly. That's almost impressive."
            };
        }
    }
}

public class WebsiteAnalysisInput
{
    public string Url { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? MetaDescription { get; set; }
    public string? H1 { get; set; }
    public List<string> H2s { get; set; } = new();
    public bool HasContactForm { get; set; }
    public int ImagesWithoutAlt { get; set; }
    public int PerformanceScore { get; set; }
    public int SeoScore { get; set; }
    public int AccessibilityScore { get; set; }
    public string? BodyText { get; set; }
}

public class AiAnalysisResult
{
    public string OverallGrade { get; set; } = "C";
    public int OverallScore { get; set; }
    public int SeoScore { get; set; }
    public int UxScore { get; set; }
    public int CompletenessScore { get; set; }
    public int TrustScore { get; set; }
    public string RoastSummary { get; set; } = string.Empty;
    public List<string> CriticalIssues { get; set; } = new();
    public List<string> QuickWins { get; set; } = new();
    public string ProReport { get; set; } = string.Empty;
}