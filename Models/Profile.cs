namespace Portfolio.Models;

public sealed class Profile
{
    public required string Name { get; init; }
    public required string Headline { get; init; }
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public required string LinkedInUrl { get; init; }
    public required string ResumePath { get; init; }

    public IReadOnlyList<string> About { get; init; } = [];
    public IReadOnlyList<Fact> QuickFacts { get; init; } = [];
    public IReadOnlyList<Job> Jobs { get; init; } = [];
    public IReadOnlyList<CaseStudy> Work { get; init; } = [];
    public IReadOnlyList<TestingStep> Checklist { get; init; } = [];
    public IReadOnlyList<SkillGroup> Skills { get; init; } = [];
    public IReadOnlyList<Degree> Education { get; init; } = [];
    public IReadOnlyList<string> Certifications { get; init; } = [];

    // "+1 (813) 755-9699" -> "+18137559699" for the tel: link
    public string PhoneHref => "tel:" + new string(Phone.Where(c => char.IsDigit(c) || c == '+').ToArray());
}

public sealed record Fact(string Term, string Detail);

public sealed record Job(
    string Slug,
    string Company,
    string Location,
    string Role,
    string Dates,
    IReadOnlyList<string> Highlights,
    IReadOnlyList<string> Stack);

public sealed record CaseStudy(
    string Slug,
    string Title,
    string Client,
    string Result,
    string Problem,
    string Built,
    IReadOnlyList<string> Tags);

public sealed record TestingStep(string Title, string Detail);

public sealed record SkillGroup(string Key, string Label, IReadOnlyList<string> Items);

public sealed record Degree(string Name, string School, string Years);
