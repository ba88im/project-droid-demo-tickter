"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MarkdownContent from "@/components/markdownRender";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// formSchema defines the validation rules for the form fields using Zod library
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  githubRepo: z.string().url({
    message: "Invalid URL format.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function TicketForm() {

  // zodResolver is used to integrate Zod with react-hook-form for validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // State hooks for managing the UI state
  const [loading, setLoading] = useState(false);
  const [addingtoJira, setaddingtoJira] = useState(false);
  const [response, setResponse] = useState(null);


  // onSubmit function is triggered when the form is submitted
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // API call to create a ticket with the form data
      const response = await fetch("/api/create-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      setResponse(responseData); // Save the response data in the state
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setLoading(false); // Reset loading state regardless of the outcome
    }
  };

  // Function to add the created ticket to Jira
  const addTicketToJira = async () => {
    if (!response) return;
    setaddingtoJira(true);
    try {
      const jiraResponse = await fetch("/api/add-to-jira", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response }),
      });

      if (jiraResponse.ok) {
        const jiraData = await jiraResponse.json();
        console.log("Added to Jira:", jiraData);
        toast.success("Ticket added to Jira");
      } else {
        console.error("Error response from Jira");
        toast.error("Error adding to Jira");
      }
    } catch (error) {
      console.error("Error adding to Jira:", error);
      toast.error("Error adding to Jira");
    } finally {
      setaddingtoJira(false);
    }
  };

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Create Ticket</CardTitle>
        <CardDescription>
          Fill out the form to create a new ticket
        </CardDescription>
      </CardHeader>
      {/* Conditional rendering is used to display different UI states */}
      {loading ? (
        <CardContent className="flex justify-center items-center">
          <img
            src="/factoryLoader.gif"
            alt="Loading..."
            className="loading-gif"
          />
        </CardContent>
      ) : response ? (
        // If there's a response, show the MarkdownContent and the option to add to Jira
        <CardContent>
          <MarkdownContent response={response} />
          <div className="flex justify-center">
            {addingtoJira ? (
              <Button className="bg-blue-500 w-48" size="sm" disabled>
                Adding...
              </Button>
            ) : (
              <Button
                onClick={addTicketToJira}
                className="bg-blue-600 w-48"
                size="sm"
              >
                Add to Jira
              </Button>
            )}
          </div>
        </CardContent>
      ) : (
        <CardContent>

          {/* The actual form fields are rendered here */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of desired ticket" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the title of the ticket you want to generate.
                    </FormDescription>
                    {errors.title && (
                      <FormMessage>{errors.title.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubRepo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Github Repo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="URL of GitHub repository"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the URL of the GitHub repository for context.
                    </FormDescription>
                    {errors.githubRepo && (
                      <FormMessage>{errors.githubRepo.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="bg-green-950">
                Generate
              </Button>
            </form>
          </Form>
        </CardContent>
      )}
      <CardFooter></CardFooter>
    </Card>
  );
}
