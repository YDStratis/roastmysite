using HtmlAgilityPack;
using RoastMySite.Core.Entities;

namespace RoastMySite.Infrastructure.Crawling;

public class WebsiteCrawler
{
    private readonly HttpClient _httpClient;

    public WebsiteCrawler(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (compatible; RoastMySite/1.0)");
        _httpClient.Timeout = TimeSpan.FromSeconds(30);
    }

    public async Task<CrawlResult> CrawlAsync(string url)
    {
        var result = new CrawlResult { Url = url };

        try
        {
            var html = await _httpClient.GetStringAsync(url);
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            // Title
            result.Title = doc.DocumentNode
                .SelectSingleNode("//title")?.InnerText?.Trim();

            // Meta description
            result.MetaDescription = doc.DocumentNode
                .SelectSingleNode("//meta[@name='description']")
                ?.GetAttributeValue("content", null);

            // H1
            result.H1 = doc.DocumentNode
                .SelectSingleNode("//h1")?.InnerText?.Trim();

            // All H2s
            result.H2s = doc.DocumentNode
                .SelectNodes("//h2")
                ?.Select(n => n.InnerText.Trim())
                .ToList() ?? new List<string>();

            // Links
            result.Links = doc.DocumentNode
                .SelectNodes("//a[@href]")
                ?.Select(n => n.GetAttributeValue("href", ""))
                .Where(h => !string.IsNullOrWhiteSpace(h))
                .ToList() ?? new List<string>();

            // Images without alt
            result.ImagesWithoutAlt = doc.DocumentNode
                .SelectNodes("//img[not(@alt) or @alt='']")
                ?.Count ?? 0;

            // Forms
            result.HasContactForm = doc.DocumentNode
                .SelectNodes("//form") != null;

            
            result.BodyText = doc.DocumentNode
                .SelectSingleNode("//body")
                ?.InnerText
                ?.Replace("\n", " ")
                ?.Replace("\r", " ")
                ?.Trim();

            if (result.BodyText?.Length > 5000)
                result.BodyText = result.BodyText[..5000];

            result.IsSuccess = true;
        }
        catch (Exception ex)
        {
            result.IsSuccess = false;
            result.ErrorMessage = ex.Message;
        }

        return result;
    }
}

public class CrawlResult
{
    public string Url { get; set; } = string.Empty;
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public string? Title { get; set; }
    public string? MetaDescription { get; set; }
    public string? H1 { get; set; }
    public List<string> H2s { get; set; } = new();
    public List<string> Links { get; set; } = new();
    public int ImagesWithoutAlt { get; set; }
    public bool HasContactForm { get; set; }
    public string? BodyText { get; set; }
}