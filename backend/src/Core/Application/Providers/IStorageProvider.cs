namespace Application.Providers;

public interface IStorageProvider
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string folderName, CancellationToken cancellationToken = default);
    Task DeleteFileAsync(string relativePath, CancellationToken cancellationToken = default);
    Task<(Stream Stream, string ContentType, string FileName)> GetFileAsync(string relativePath, CancellationToken cancellationToken = default);
}
