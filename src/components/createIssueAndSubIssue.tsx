// Define types for better type checking
type IssueData = {
  issueType: string;
  summary: string;
  description: string;
  subTasks?: IssueData[];
};

type AuthConfig = {
  username: string;
  password: string;
};

// Environment variables
const username = process.env.ATLASSIAN_USERNAME;
const password = process.env.ATLASSIAN_API_KEY;
const domain = process.env.DOMAIN;
const projectKey = process.env.PROJECT_KEY;

// Configuration for authentication. Fallbacks to empty strings if environment variables are not set.
const auth: AuthConfig = {
  username: username || "",
  password: password || "",
};

// Function to create an issue
export async function createIssue(issueData: IssueData): Promise<string> {
  try {
    const baseUrl = `https://${domain}.atlassian.net`;
    const url = `${baseUrl}/rest/api/2/issue`;
    const data = {
      fields: {
        project: { key: projectKey },
        summary: issueData.summary,
        description: issueData.description,
        issuetype: { name: "Task" }, // Hardcoded issue type as 'Task'
      },
    };

    console.log(data);
    console.log(auth);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Base64 encode username and password for Basic Authentication header
        Authorization: "Basic " + btoa(auth.username + ":" + auth.password),
      },
      body: JSON.stringify(data),
    });

    console.log("Issue Creation Response Status", response.status);

    if (!response.ok) {
      const errorBody = await response.text(); // Get the response body as text
      console.error("Detailed error response:", errorBody);
      throw new Error(`Error creating issue: ${response.statusText}`);
    }

    // responseData.key holds the key of the created issue used later as the parentIssueKey
    const responseData = await response.json();
    return responseData.key;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
}

// Function to create a sub-issue
export async function createSubIssue(
  parentIssueKey: string,
  issueData: IssueData
): Promise<string> {
  try {
    const baseUrl = `https://${domain}.atlassian.net`;
    const url = `${baseUrl}/rest/api/2/issue`;
    const data = {
      fields: {
        project: { key: projectKey },
        parent: { key: parentIssueKey },
        summary: issueData.summary,
        description: issueData.description,
        issuetype: { id: 10003 }, // 10003 is the ID for a sub-task
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(auth.username + ":" + auth.password),
      },
      body: JSON.stringify(data),
    });

    console.log("Sub-Issue Creation Response Status", response.status);

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Detailed error response:", errorBody);
      const errorMsg = errorBody.errorMessages
        ? errorBody.errorMessages.join(", ")
        : "Unknown error";
      throw new Error(`Error creating issue: ${errorMsg}`);
    }

    const responseData = await response.json();
    return responseData.key;
  } catch (error) {
    console.error("Error creating sub-issue:", error);
    throw error;
  }
}
