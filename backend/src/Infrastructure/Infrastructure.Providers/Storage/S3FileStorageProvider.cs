using Application.Providers;

namespace Infrastructure.Providers.Storage;

public class S3FileStorageProvider : IStorageProvider
{
    public Task<string> UploadFileAsync(Stream fileStream, string fileName, string folderName, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("S3 Storage Provider requires AWS credentials configuration. Using LocalFileStorageProvider by default.");
    }

    public Task DeleteFileAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("S3 Storage Provider requires AWS credentials configuration.");
    }

    public Task<(Stream Stream, string ContentType, string FileName)> GetFileAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("S3 Storage Provider requires AWS credentials configuration.");
    }
}
