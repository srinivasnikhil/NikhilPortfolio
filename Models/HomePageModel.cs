namespace Portfolio.Models;

public class HomePageModel
{
    public required Profile Profile { get; init; }
    public ContactMessage Contact { get; init; } = new();
    public string? SentTo { get; init; }
}

public class StatusPageModel
{
    public int Code { get; init; }
    public string? RequestId { get; init; }
}
