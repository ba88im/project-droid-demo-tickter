import React, { ReactNode } from "react";
import Markdown, { Components } from "react-markdown";

const customComponents: Components = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="text-3xl font-bold my-4">{children}</h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="text-2xl font-bold my-3">{children}</h2>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-2">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="list-disc list-inside my-4">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="list-decimal list-inside my-4">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="ml-4">{children}</li>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="border-l-4 border-gray-500 italic my-4 pl-4">
      {children}
    </blockquote>
  ),
};

const MarkdownContent = ({ response }: { response: string }) => {
  return <Markdown components={customComponents}>{response}</Markdown>;
};

export default MarkdownContent;
