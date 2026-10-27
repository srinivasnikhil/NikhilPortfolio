using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Content;
using Portfolio.Models;

namespace Portfolio.Controllers;

public class HomeController : Controller
{
    private readonly ResumeContent _content;
    private readonly ILogger<HomeController> _logger;

    public HomeController(ResumeContent content, ILogger<HomeController> logger)
    {
        _content = content;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View(new HomePageModel
        {
            Profile = _content.Profile,
            SentTo = TempData["SentTo"] as string
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Contact(ContactMessage form)
    {
        // Bots fill every field they can find. Act like it worked and move on.
        if (!string.IsNullOrWhiteSpace(form.Website))
        {
            return RedirectToContact(form.Name);
        }

        if (!ModelState.IsValid)
        {
            Response.StatusCode = StatusCodes.Status400BadRequest;
            return View("Index", new HomePageModel { Profile = _content.Profile, Contact = form });
        }

        // No database or mail server yet - just log it.
        // TODO: hook up SMTP / SendGrid here once the site is hosted.
        _logger.LogInformation("Contact form: {Name} <{Email}> from {Company}: {Message}",
            form.Name, form.Email, form.Company ?? "-", form.Message);

        return RedirectToContact(form.Name);
    }

    [HttpGet]
    public IActionResult Accessibility() => View(_content.Profile);

    [Route("Home/Status/{code:int}")]
    public IActionResult Status(int code) =>
        View(new StatusPageModel { Code = code });

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() =>
        View("Status", new StatusPageModel
        {
            Code = 500,
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
        });

    private IActionResult RedirectToContact(string name)
    {
        TempData["SentTo"] = name;
        return Redirect(Url.Action(nameof(Index)) + "#contact");
    }
}
