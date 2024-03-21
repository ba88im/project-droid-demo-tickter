## About 

This take-home project involves developing a simplified version of Factory's 'Project Droid,' an AI-powered system designed to transform high-level task titles into detailed, well-scoped software engineering tickets

## Running locally in development mode

To get started, just clone the repository and run `npm install && npm run dev`:

    git clone https://github.com/ba88im/project-droid-demo-tickter
    npm install
    npm run dev

## Configuring

To configure just copy '.env.example' over to '.env' and fill in the options.

- OPENAI_API_KEY can be created [here](https://platform.openai.com/api-keys) 
- ATLASSIAN_USERNAME is the email registered with your Atlassian account
- ATLASSIAN_API_KEY can be created [here](https://id.atlassian.com/manage-profile/security/api-tokens)
- DOMAIN can be found through the link to your Jira project (https://DOMAIN.atlassian.net/jira/)
- PROJECT_KEY is the name of your Jira project and it can also be found through the link to your Jira project (https://DOMAIN.atlassian.net/jira/software/projects/PROJECT_KEY/boards/1/timeline)