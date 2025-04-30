# Environment Setup for AI Assistant

This document describes how to set up the environment variables needed for the AI Assistant functionality.

## Environment Variables

Create a `.env.local` file in the root directory of the project with the following variables:

```
# AI Service Provider API Keys
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Model Configuration
NEXT_PUBLIC_OPENAI_MODEL=gpt-4o
NEXT_PUBLIC_ANTHROPIC_MODEL=claude-3-opus-20240229

# Default Provider (openai or anthropic)
NEXT_PUBLIC_DEFAULT_AI_PROVIDER=openai
```

## Variable Descriptions

### API Keys

- `NEXT_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_ANTHROPIC_API_KEY`: Your Anthropic API key

### Model Configuration

- `NEXT_PUBLIC_OPENAI_MODEL`: The OpenAI model to use (default: gpt-4o)
- `NEXT_PUBLIC_ANTHROPIC_MODEL`: The Anthropic model to use (default: claude-3-opus-20240229)
- `NEXT_PUBLIC_DEFAULT_AI_PROVIDER`: The default AI provider to use (openai or anthropic)

## Obtaining API Keys

### OpenAI

1. Visit [OpenAI's platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API keys section
4. Create a new secret key
5. Copy the key and add it to your `.env.local` file

### Anthropic

1. Visit [Anthropic's console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to the API keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Note on Security

- Never commit your `.env.local` file to the repository
- Keep your API keys secure and rotate them periodically
- Consider using environment variable management systems for production deployments
