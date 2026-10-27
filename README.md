# nikhil-portfolio

My personal site. ASP.NET Core MVC (.NET 8) with Bootstrap 5, jQuery and plain CSS/JS.
No database - all the content comes from one C# file.

## Running it

```bash
dotnet run
```

Then open http://localhost:5154 (or https://localhost:7154 with the `https` profile).
Visual Studio 2022 works too, just open `NikhilPortfolio.csproj` and hit F5.

Bootstrap, jQuery, jQuery Validation and the Atkinson Hyperlegible Next font are checked in under
`wwwroot/lib` and `wwwroot/fonts`, so there's no npm/LibMan step and no CDN calls at runtime.

## Where things are

| What | Where |
| --- | --- |
| All resume content (jobs, projects, skills...) | `Content/ResumeContent.cs` |
| Page sections | `Views/Home/_*.cshtml` (one partial per section) |
| Accessibility statement | `Views/Home/Accessibility.cshtml` |
| Styles | `wwwroot/css/site.css` |
| Behaviour (tabs, demo, filters, form) | `wwwroot/js/site.js` |
| Theme / motion preference (runs before paint) | `wwwroot/js/prefs.js` |
| Resume download | `wwwroot/files/Nikhil-Mallempati-Resume.docx` |

Updating the resume = edit `ResumeContent.cs` and swap the .docx. If the file size changes,
update the "(Word, 20 KB)" text in `_Hero.cshtml` and `Index.cshtml`.

## Accessibility notes

Target is WCAG 2.1 AA / Section 508.

- Skip link, landmarks, one `h1`, headings in order.
- Yellow focus ring with a dark edge on every focusable thing (visible on light and dark backgrounds).
- Light/dark theme and a "Reduce motion" switch, both remembered. The OS `prefers-reduced-motion`
  and `prefers-color-scheme` settings are used when nothing is saved.
- The hero demo auto-plays, so it has Pause/Play and Next stop buttons (2.2.2 Pause, Stop, Hide).
  The mock form is `aria-hidden`; screen reader users get the caption, and "Next stop" announces
  each step through a live region.
- Experience uses the ARIA tabs pattern (arrow keys, Home, End). Project details use
  disclosure buttons with `aria-expanded`.
- Contact form: visible labels, hints wired with `aria-describedby`, error summary that takes focus
  and links to each field, `aria-invalid` kept in sync. Server-side validation gives the same result
  with JavaScript off.
- Works without JavaScript: tabs and collapsible sections fall back to plain content.
- Reflows at 320px with no sideways scrolling; `forced-colors` (Windows High Contrast) handled.
- Strict Content-Security-Policy (`Program.cs`) - no inline scripts or styles.

Checked with axe-core (0 violations, both themes) and keyboard. Do an NVDA pass and a WAVE scan
before publishing changes.

## Contact form

There's no mail server wired up. `HomeController.Contact` validates the message and logs it.
To actually receive messages, send an email from there (SMTP, SendGrid, etc.) - see the TODO.

## Publishing

```bash
dotnet publish -c Release -o ./publish
```

Deploys fine to Azure App Service or IIS.
