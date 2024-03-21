import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import {
  createIssue,
  createSubIssue,
} from "@/components/createIssueAndSubIssue";

export const runtime = "edge";

// Define a TypeScript type for the issue data structure.
type IssueData = {
  issueType: string;
  summary: string;
  description: string;
  subTasks?: IssueData[];
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to handle the creation of an issue and its sub-issues.
async function handleIssueCreation(issueResponse: IssueData) {
  try {
    // Extract and construct the main issue data from the response.
    const mainIssueData = {
      issueType: issueResponse.issueType,
      summary: issueResponse.summary,
      description: issueResponse.description,
    };

    // Create the main issue using a custom function and store the returned key.
    const parentIssueKey = await createIssue(mainIssueData);

    console.log("parentIssueKey", parentIssueKey);

    // Check if there are subtasks and create them
    if (issueResponse.subTasks && issueResponse.subTasks.length > 0) {
      for (const subTask of issueResponse.subTasks) {
        // Create each sub-issue, linked to the main issue.
        await createSubIssue(parentIssueKey, subTask);
      }
    }

    console.log("Main issue and sub-issues created successfully");
  } catch (error) {
    console.error("Error in handleIssueCreation:", error);
    throw error; 
  }
}

export async function POST(req: Request) {
  try {
    console.log("running /api/add-to-jira");

    const { response } = await req.json();

    const SystemPrompt = {
      content: `AI assistant is an expert in Jira and can help create issues and sub-issues in Jira.
        Follow the format below to using the ticket provided:

        FORMAT in this JSON format: 
        {
            issueType: 'Story',
            summary: 'Enhance PDF Viewer Functionality',
            description: 'Task to enhance the existing PDF viewer functionality within the project including design changes, functionality enhancements, performance optimization, testing, and documentation.',
            subTasks: [
                {
                    issueType: 'Task',
                    summary: 'Research and Requirement Gathering',
                    description: 'Gather requirements from stakeholders for the improved PDF viewer and conduct research for possible enhancements.'
                },
                {
                    issueType: 'Task',
                    summary: 'Design Changes',
                    description: 'Update the design of the PDF viewer interface to improve usability and implement necessary design changes.'
                },
                {
                    issueType: 'Task',
                    summary: 'Functionality Enhancement',
                    description: 'Improve the functionality of the PDF viewer by adding new features and ensuring smooth navigation, zooming, and search capabilities.'
                },
            ]
        }
        
        TICKET TO TRANSFORM INTO FORMAT: ${response}


        OPTIONS FOR ISSUE TYPES ARE; Epic, Task
        
        PLEASE ONLY RESPONSE WITH THE FORMAT THE JSON FORMAT ABOVE`,
    };

    // Making a call to OpenAI's API to generate issue data based on the provided format.
    const issueResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: SystemPrompt.content }],
    });

    console.log("generated json for /api/add-to-jira", issueResponse.choices[0].message.content);

    // Parse the AI-generated json into the IssueData type.
    const issueData: IssueData = JSON.parse(
      issueResponse.choices[0].message.content as string
    );
    if (issueData) {
      await handleIssueCreation(issueData);
    } else {
      console.error("Invalid issue data, cannot create issue");
    }

    return NextResponse.json({ message: "Issue created successfully" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in /api/add-to-jira:", error);

    // Return an error response
    return new NextResponse("Error processing request", {
      status: 500, // Internal Server Error
    });
  }
}
