using Application.Providers;
using Microsoft.AspNetCore.Hosting;

namespace Infrastructure.Providers.Storage;

public class LocalFileStorageProvider : IStorageProvider
{
    private readonly IWebHostEnvironment _environment;

    public LocalFileStorageProvider(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string folderName, CancellationToken cancellationToken = default)
    {
        var webRootPath = _environment.WebRootPath;
        if (string.IsNullOrEmpty(webRootPath))
        {
            webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        }

        var uploadsFolder = Path.Combine(webRootPath, "uploads", folderName);
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(fileName)}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var destinationStream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(destinationStream, cancellationToken);
        }

        return Path.Combine("uploads", folderName, uniqueFileName).Replace("\\", "/");
    }

    public Task DeleteFileAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var fullPath = Path.Combine(webRootPath, relativePath.TrimStart('/'));
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
        return Task.CompletedTask;
    }

    public Task<(Stream Stream, string ContentType, string FileName)> GetFileAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var fullPath = Path.Combine(webRootPath, relativePath.TrimStart('/'));

        if (!File.Exists(fullPath))
        {
            throw new FileNotFoundException($"File not found at path: {relativePath}");
        }

        var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
        var fileName = Path.GetFileName(fullPath);
        var contentType = GetContentType(fileName);

        return Task.FromResult<(Stream, string, string)>((stream, contentType, fileName));
    }

    private static string GetContentType(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        return ext switch
        {
            ".pdf" => "application/pdf",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".doc" => "application/msword",
            ".zip" => "application/zip",
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };
    }
}
