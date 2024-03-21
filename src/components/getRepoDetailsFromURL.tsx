export async function fetchGitHubRepoRootContents(
  repoUrl: string
): Promise<string[]> {
  try {
    // Extracting the repository name and owner from the URL
    const repoPath = new URL(repoUrl).pathname;
    const apiUrl = `https://api.github.com/repos${repoPath}/contents/`;

    // Fetching data from GitHub API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();

    // Filtering and returning the file and directory names
    return data.map((item: { name: string }) => item.name).join(", ");
  } catch (error) {
    console.error("Failed to fetch repository contents:", error);
    return [];
  }
}
