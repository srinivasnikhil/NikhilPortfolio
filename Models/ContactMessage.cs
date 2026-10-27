using System.ComponentModel.DataAnnotations;

namespace Portfolio.Models;

public class ContactMessage
{
    [Required(ErrorMessage = "Enter your name.")]
    [StringLength(80, ErrorMessage = "Name must be 80 characters or fewer.")]
    [Display(Name = "Your name")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Enter your email address.")]
    [EmailAddress(ErrorMessage = "Enter an email address like name@example.com.")]
    [StringLength(120)]
    [Display(Name = "Email address")]
    public string Email { get; set; } = "";

    [StringLength(120, ErrorMessage = "Company must be 120 characters or fewer.")]
    [Display(Name = "Company")]
    public string? Company { get; set; }

    [Required(ErrorMessage = "Enter a message.")]
    [StringLength(1500, MinimumLength = 10, ErrorMessage = "Message must be between 10 and 1,500 characters.")]
    [Display(Name = "Message")]
    public string Message { get; set; } = "";

    // Honeypot. Real people never see or fill this.
    public string? Website { get; set; }
}
