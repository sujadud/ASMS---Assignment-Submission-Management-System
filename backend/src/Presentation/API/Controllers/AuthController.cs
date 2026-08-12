using Application.Common.Interfaces;
using Application.DTOs;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ICurrentUserService _currentUserService;

    public AuthController(ApplicationDbContext context, IJwtTokenGenerator jwtTokenGenerator, ICurrentUserService currentUserService)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _currentUserService = currentUserService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var user = await _context.Users
            .Include(u => u.Classroom)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower());

        if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = _jwtTokenGenerator.GenerateToken(user);
        var userDto = new UserDto(
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            user.ClassroomId,
            user.Classroom?.Name,
            user.CreatedAt
        );

        return Ok(new LoginResponse(token, userDto));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = _currentUserService.UserId;
        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.Classroom)
            .FirstOrDefaultAsync(u => u.Id == userId.Value);

        if (user == null)
        {
            return NotFound(new { message = "User profile not found." });
        }

        var userDto = new UserDto(
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            user.ClassroomId,
            user.Classroom?.Name,
            user.CreatedAt
        );

        return Ok(userDto);
    }
}
