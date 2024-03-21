import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { fetchGitHubRepoRootContents } from "@/components/getRepoDetailsFromURL";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("running /api/create-ticket");

    // Extracting 'title' and 'githubRepo' from the JSON body of the request
    const { title, githubRepo } = await req.json();
    console.log(title, githubRepo);

    // Fetching the file titles of the root folder of the specified GitHub repository
    const repoRootFolderFiles = await fetchGitHubRepoRootContents(githubRepo);
    console.log(repoRootFolderFiles);

    const SystemPrompt = {
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        AI will expand a minimally described task into a completed scope for the task that could include descriptions, acceptance criteria, sub-tasks, assumptions, and any other relevant details.
        AI will take into the account the context of the task and the project using the ROOT DIRECTORY FILES and will provide a detailed and accurate scope.
        AI assistant will always respond using Markdown.
        The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes.
        AI assistant will response with "Title is not a valid ticket request" if the title is not a valid ticket request.

        TITLE: ${title}

        TITLE OF ROOT DIRECTORY FILES FOR CONTEXT OF TECHNOLOGIES USED: ${repoRootFolderFiles}
        `,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [{ role: "system", content: SystemPrompt.content }],
    });

    console.log("response", response.choices[0].message.content);

    // Returning the AI's response as a JSON object in the HTTP response
    return NextResponse.json(response.choices[0].message.content);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in /api/create-ticket:", error);

    // Return an error response
    return new NextResponse("Error processing request", {
      status: 500, // Internal Server Error
    });
  }
}
