# ASP.NET Core 8 Web API Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy Solution & Project files for caching restore
COPY ["backend/src/Core/Domain/Domain.csproj", "backend/src/Core/Domain/"]
COPY ["backend/src/Core/Application/Application.csproj", "backend/src/Core/Application/"]
COPY ["backend/src/Infrastructure/Infrastructure.Persistence/Infrastructure.Persistence.csproj", "backend/src/Infrastructure/Infrastructure.Persistence/"]
COPY ["backend/src/Infrastructure/Infrastructure.Shared/Infrastructure.Shared.csproj", "backend/src/Infrastructure/Infrastructure.Shared/"]
COPY ["backend/src/Infrastructure/Infrastructure.Providers/Infrastructure.Providers.csproj", "backend/src/Infrastructure/Infrastructure.Providers/"]
COPY ["backend/src/Presentation/API/API.csproj", "backend/src/Presentation/API/"]

RUN dotnet restore "backend/src/Presentation/API/API.csproj"

# Copy full source and publish
COPY backend/ backend/
WORKDIR "/src/backend/src/Presentation/API"
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "API.dll"]
