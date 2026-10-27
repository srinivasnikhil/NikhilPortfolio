using Portfolio.Models;

namespace Portfolio.Content;

/// <summary>
/// Everything the site says about me lives here. No database on purpose:
/// when the resume changes, this is the one file to edit.
/// </summary>
public class ResumeContent
{
    public Profile Profile { get; } = Build();

    private static Profile Build() => new()
    {
        Name = "Nikhil Mallempati",
        Headline = "Senior Full Stack .NET Developer",
        Email = "nikhilsm0606@gmail.com",
        Phone = "+1 (813) 755-9699",
        LinkedInUrl = "https://www.linkedin.com/in/nikhil-m-3b159315a",
        ResumePath = "/files/Nikhil-Mallempati-Resume.docx",

        About =
        [
            "I've spent ten years building and supporting enterprise applications in C#, .NET and SQL Server, mostly for banks, health agencies and government programs. The people on the other end of that software are filing a dispute, checking a pension or uploading a medical document, and they shouldn't have to fight the screen to do it.",
            "So the front end gets as much care as the back end. I build with HTML5, Sass, TypeScript, Angular and Bootstrap, keep components consistent through shared design systems, and ship interfaces that meet WCAG 2.1 AA and Section 508. I test them the way people actually use them: keyboard only, with NVDA, and with WAVE as a backstop.",
            "Behind those screens I write ASP.NET Core APIs and tune SQL Server, run CI/CD in Azure DevOps and GitHub Actions, and move legacy Web Forms and MVC apps to ASP.NET Core without taking the business offline. These days I also lead design and code reviews and mentor newer developers."
        ],

        QuickFacts =
        [
            new("Now", "Full stack developer on a Capital One engagement, Plano, TX (since January 2025)"),
            new("Focus", "Accessible front ends on top of ASP.NET Core and SQL Server"),
            new("Recently finished", "M.S. in Information Systems & Cybersecurity, Saint Leo University (2026)"),
            new("Certified", "Azure Fundamentals (AZ-900) and Azure AI Engineer Associate (AI-102)")
        ],

        Jobs =
        [
            new("capital-one", "Capital One", "Plano, TX", "Full Stack AI Developer", "Jan 2025 – Present",
            [
                "Built a customer self-service portal in Angular and React where customers view accounts, file disputes, upload documents and track status, cutting inbound call center volume by 25%.",
                "Made customer-facing screens WCAG 2.1 AA and Section 508 compliant with semantic HTML, WAI-ARIA, visible focus, keyboard support and accessible error messages, verified in NVDA and WAVE before each release.",
                "Built and reused design-system components for forms, tables, dialogs and navigation, which kept screens consistent and removed duplicate front-end code.",
                "Built ASP.NET Core APIs on SQL Server, including a Credit Risk and Underwriting API that reduced re-underwriting incidents by 20%.",
                "Modernized Web Forms and MVC apps to .NET 6/8 and moved them from IIS to AWS with cutover and rollback plans.",
                "Acted as hands-on tech lead: design and code reviews, coding and testing standards, mentoring."
            ],
            ["C#", ".NET 8", "ASP.NET Core", "Angular", "React", "TypeScript", "Sass", "WCAG 2.1 AA", "SQL Server", "AWS", "Azure DevOps", "GitHub Actions"]),

            new("matrix-medical", "Matrix Medical", "Phoenix, AZ (from India)", "Full Stack Software Engineer", "Jan 2023 – Aug 2024",
            [
                "Built and maintained a healthcare management platform for 10+ federal and state health agencies, handling 6M+ transactions a year at 99.9% uptime.",
                "Delivered a Care Coordination Dashboard and a Patient Document Submission Portal in Angular, giving case managers real-time visibility into care plans, appointments and care gaps.",
                "Led the move from Crystal Reports to SSRS and Telerik Reporting, producing accessible, tagged PDF exports for government auditors.",
                "Developed a member eligibility verification service against government health registries, cutting manual verification during intake by 40%.",
                "Designed a 60+ table SQL Server schema with Entity Framework, stored procedures and indexed views, improving query performance by 20%."
            ],
            ["C#", ".NET Framework", "ASP.NET MVC", "Angular", "SQL Server", "SSRS", "Telerik", "OAuth 2.0", "HIPAA"]),

            new("apt-online", "APT Online Limited", "Hyderabad, India", ".NET Developer", "Mar 2021 – Dec 2022",
            [
                "Delivered full stack features for a government social security pensions platform processing 6M+ pension transactions a year at 99.9% uptime.",
                "Built a Section 508 compliant Citizen Self-Service Portal in Angular where beneficiaries track pension status, submit life certificates, update bank details and raise appeals. In-person office visits dropped by 60%.",
                "Built the pension eligibility and benefits calculation engine that turns service records and contribution histories into auditable disbursement amounts.",
                "Engineered a monthly disbursement service with .NET background services that generates bank payment files with full reconciliation.",
                "Set Git branching strategy, ran peer code reviews and wrote onboarding docs for new developers."
            ],
            ["C#", "VB.NET", "ASP.NET Web Forms", "ASP.NET MVC", "Web API", "WCF", "Angular", "SQL Server", "Dapper"]),

            new("sky-cop", "Sky Cop Inc.", "Hyderabad, India", ".NET Developer", "Sep 2016 – Feb 2021",
            [
                "Delivered features for a real-time license plate recognition platform used by law enforcement agencies across several jurisdictions.",
                "Split a monolithic API into six microservices, reducing deployment risk by 30%.",
                "Built responsive Angular monitoring dashboards with live map views and SignalR alerts for patrol operators.",
                "Tuned SQL Server queries over 1M+ records for 30% faster response times."
            ],
            ["Angular 8", "ASP.NET MVC", ".NET Core", "C#", "SignalR", "SQL Server", "IIS"])
        ],

        Work =
        [
            new("self-service", "Customer self-service portal", "Capital One",
                "25% fewer calls to the contact center",
                "Customers had to phone in to check account details, dispute a charge or send documents.",
                "Angular and React screens for account details, disputes, document upload and status tracking, built from the shared design system and tested with keyboard and NVDA before every release.",
                ["Angular", "React", "WCAG 2.1 AA", "ASP.NET Core"]),

            new("underwriting", "Credit risk and underwriting API", "Capital One",
                "20% fewer re-underwriting incidents",
                "Underwriting decisions were being revisited because inputs arrived inconsistent or late.",
                "An ASP.NET Core REST API with middleware on SQL Server, shipped through Azure DevOps YAML pipelines with automated tests and SonarQube gates.",
                ["ASP.NET Core", "SQL Server", "Azure DevOps", "SonarQube"]),

            new("eligibility", "Member eligibility verification", "Matrix Medical",
                "40% less manual verification at intake",
                "Intake staff checked member eligibility by hand against several government registries.",
                "A verification service integrated with government health data registries, wired into the intake flow of a platform serving 10+ agencies.",
                ["C#", "ASP.NET MVC", "OAuth 2.0", "HIPAA"]),

            new("care-dashboard", "Care coordination dashboard", "Matrix Medical",
                "Real-time view of care plans and gaps",
                "Case managers pieced together care plans, appointments and gaps from separate screens.",
                "An Angular dashboard plus a patient document submission portal on a platform handling 6M+ transactions a year at 99.9% uptime.",
                ["Angular", ".NET Framework", "SQL Server"]),

            new("citizen-portal", "Citizen pension self-service", "APT Online",
                "60% fewer in-person office visits",
                "Pension beneficiaries had to visit an office to check status or submit a life certificate.",
                "A Section 508 compliant Angular portal for status tracking, life certificates, bank detail updates and appeals, backed by the eligibility and disbursement engines.",
                ["Angular", "Sass", "Section 508", "Web API"]),

            new("lpr", "License plate recognition dashboards", "Sky Cop",
                "30% faster queries across 1M+ records",
                "Patrol operators needed live alerts, and a single large API made every deployment risky.",
                "Angular dashboards with live maps and SignalR alerts, a monolith split into six microservices, and tuned SQL Server queries.",
                ["Angular", "SignalR", "Microservices", "SQL Server"])
        ],

        Checklist =
        [
            new("Start with semantics", "Landmarks, a real heading outline, labels on every input and native controls before any ARIA."),
            new("Keyboard-only pass", "Every control reachable with Tab, a visible focus indicator, a logical order and no traps."),
            new("Screen reader pass", "NVDA reads the right name, role and state for each control, and errors are announced."),
            new("Automated scan", "WAVE catches missed labels and contrast problems. It backs up manual testing, never replaces it."),
            new("Zoom and reflow", "Text at 200% and a 320 pixel wide viewport without losing content or scrolling sideways."),
            new("Fix, retest, write it down", "Remediation goes into the backlog with the criterion it fails, and gets retested before release.")
        ],

        Skills =
        [
            new("frontend", "Front end", ["Angular", "Angular Material", "React", "TypeScript", "JavaScript", "jQuery", "HTML5", "CSS3", "Sass/SCSS", "Bootstrap", "Responsive design", "Design systems"]),
            new("accessibility", "Accessibility & UX", ["WCAG 2.1 AA", "Section 508", "WAI-ARIA", "Semantic HTML", "Keyboard navigation", "NVDA", "WAVE", "Accessible PDFs", "Usability"]),
            new("backend", "Back end", ["C#", ".NET 8", ".NET Framework", "ASP.NET Core", "ASP.NET MVC", "ASP.NET Web Forms", "Web API", "Entity Framework Core", "LINQ", "Dapper", "WCF", "SignalR"]),
            new("data", "Data", ["SQL Server", "T-SQL", "Azure SQL", "PostgreSQL", "Oracle", "SSRS"]),
            new("cloud", "Cloud & delivery", ["Azure DevOps YAML", "GitHub Actions", "AWS Lambda", "AWS ECS", "AWS RDS", "Azure App Service", "Azure Functions", "Docker", "IIS"]),
            new("quality", "Security & quality", ["OAuth 2.0", "OpenID Connect", "JWT", "Okta", "OWASP ZAP", "HIPAA", "xUnit", "NUnit", "Moq", "SonarQube"])
        ],

        Education =
        [
            new("M.S. in Information Systems & Cybersecurity", "Saint Leo University, Tampa Bay, Florida", "2024 – 2026"),
            new("B.Tech in Computer Science Engineering", "Sri Indu Institute of Engineering, JNTU Hyderabad", "2012 – 2016")
        ],

        Certifications =
        [
            "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
            "Microsoft Certified: Azure Fundamentals (AZ-900)",
            "Formal WCAG 2.1 AA and Section 508 accessibility training"
        ]
    };
}
