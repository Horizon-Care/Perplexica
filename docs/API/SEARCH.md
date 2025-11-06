# Perplexica Search API Documentation

## Overview

Perplexica's Search API makes it easy to use our AI-powered search engine. You can run different types of searches, pick the models you want to use, and get the most recent info. Follow the following headings to learn more about Perplexica's search API.

## Endpoints

Perplexica provides two endpoints for performing searches:

### `/api/search` - Recommended for Most Use Cases

**POST** `http://localhost:3000/api/search`

This is the **recommended endpoint** for most use cases. It supports both streaming and non-streaming responses, making it flexible for different application needs.

**Key Features:**
- ✅ Supports both JSON (`stream: false`) and streaming (`stream: true`) responses
- ✅ Supports custom prompts (`retrieverPrompt` and `responsePrompt`)
- ✅ Simple request format with `query` field
- ✅ Easier to parse and integrate

**Use `/api/search` when:**
- You want a simple JSON response (set `stream: false`)
- You need custom prompts but prefer JSON responses
- You're building a standard API integration
- You want the most straightforward implementation

### `/api/chat` - For Chat-Based Applications

**POST** `http://localhost:3000/api/chat`

This endpoint is designed for chat-based applications that require persistent conversation contexts and automatic message history management.

**Key Features:**
- ✅ Always returns streaming responses (event-stream format)
- ✅ Supports custom prompts (`retrieverPrompt` and `responsePrompt`)
- ✅ Requires `message` object with `messageId` and `chatId`
- ✅ Automatically stores messages in database
- ✅ Designed for multi-turn conversations

**Use `/api/chat` when:**
- You're building a chat interface with persistent conversations
- You need automatic message history management
- You want to leverage Perplexica's built-in chat storage
- Your application can handle streaming responses (NDJSON format)

**Note**: `/api/chat` always returns streaming responses. If you need a JSON response, use `/api/search` with `stream: false`.

### Comparison Table

| Feature | `/api/search` | `/api/chat` |
|---------|--------------|-------------|
| Response Format | JSON (default) or Streaming | Always Streaming (NDJSON) |
| Request Format | Simple `query` field | Requires `message` object with `messageId` and `chatId` |
| Custom Prompts | ✅ Supported | ✅ Supported |
| Message Storage | ❌ Not automatic | ✅ Automatic (stores in database) |
| Best For | API integrations, simple searches | Chat applications, multi-turn conversations |
| Parsing Complexity | Simple (JSON) | More complex (NDJSON stream) |

### Recommendation

**For most use cases, use `/api/search` with `stream: false`**. It provides the simplest integration path and returns a clean JSON response that's easy to parse.

The rest of this documentation focuses on the `/api/search` endpoint. For `/api/chat` specific details, refer to the Chat API documentation (if available) or check the endpoint's expected request/response format.

---

## `/api/search` Endpoint Details

**Note**: Replace `3000` with any other port if you've changed the default PORT

### Request

The `/api/search` endpoint accepts a JSON object in the request body, where you define the focus mode, chat models, embedding models, and your query.

#### Request Body Structure

```json
{
  "chatModel": {
    "provider": "openai",
    "name": "gpt-4o-mini"
  },
  "embeddingModel": {
    "provider": "openai",
    "name": "text-embedding-3-large"
  },
  "optimizationMode": "speed",
  "focusMode": "webSearch",
  "query": "What is Perplexica",
  "history": [
    ["human", "Hi, how are you?"],
    ["assistant", "I am doing well, how can I help you today?"]
  ],
  "systemInstructions": "Focus on providing technical details about Perplexica's architecture.",
  "responsePrompt": "You are a technical expert. Answer in a concise format. Use context: {context}. Follow user instructions: {systemInstructions}. Current date: {date}",
  "retrieverPrompt": "You are an AI question rephraser. Rephrase the follow-up question into a standalone search query. Return the question inside <question> XML block.",
  "restrictToSites": ["example.com"],
  "stream": false
}
```

### Request Parameters

- **`chatModel`** (object, optional): Defines the chat model to be used for the query. For model details you can send a GET request at `http://localhost:3000/api/models`. Make sure to use the key value (For example "gpt-4o-mini" instead of the display name "GPT 4 omni mini").

  - `provider`: Specifies the provider for the chat model (e.g., `openai`, `ollama`).
  - `name`: The specific model from the chosen provider (e.g., `gpt-4o-mini`).
  - Optional fields for custom OpenAI configuration:
    - `customOpenAIBaseURL`: If you’re using a custom OpenAI instance, provide the base URL.
    - `customOpenAIKey`: The API key for a custom OpenAI instance.

- **`embeddingModel`** (object, optional): Defines the embedding model for similarity-based searching. For model details you can send a GET request at `http://localhost:3000/api/models`. Make sure to use the key value (For example "text-embedding-3-large" instead of the display name "Text Embedding 3 Large").

  - `provider`: The provider for the embedding model (e.g., `openai`).
  - `name`: The specific embedding model (e.g., `text-embedding-3-large`).

- **`focusMode`** (string, required): Specifies which focus mode to use. Available modes:

  - `webSearch`, `academicSearch`, `writingAssistant`, `wolframAlphaSearch`, `youtubeSearch`, `redditSearch`.

- **`optimizationMode`** (string, optional): Specifies the optimization mode to control the balance between performance and quality. Available modes:

  - `speed`: Prioritize speed and return the fastest answer.
  - `balanced`: Provide a balanced answer with good speed and reasonable quality.

- **`query`** (string, required): The search query or question.

- **`systemInstructions`** (string, optional): Custom instructions provided by the user to guide the AI's response. These instructions are treated as user preferences and have lower priority than the system's core instructions. For example, you can specify a particular writing style, format, or focus area. These instructions are injected into the response prompt via the `{systemInstructions}` template variable.

- **`responsePrompt`** (string, optional): Custom prompt that overrides the default response/answering prompt. Controls how the final answer is formatted and generated after context is retrieved. When provided, this completely replaces the default focus mode prompt template. You can use template variables: `{context}`, `{systemInstructions}`, `{query}`, and `{date}`. If not provided, the default prompt for the selected focus mode is used.

- **`retrieverPrompt`** (string, optional): Custom prompt that overrides the default query retriever prompt. Controls how the user's query is parsed, rephrased, and what searches are performed. When provided, this completely replaces the default retriever prompt. The retriever prompt should return responses in XML format: questions in `<question>...</question>` tags, and URLs in `<links>...</links>` tags (one per line). You can use template variables: `{chat_history}` and `{query}`. If not provided, the default retriever prompt is used.

- **`restrictToSites`** (array of strings, optional): Restricts web searches to specific domains. When provided, the search will only query results from the specified domains. For example, `["example.com", "docs.example.com"]` will only search within those domains. This only applies to focus modes that support web search.

- **`history`** (array, optional): An array of message pairs representing the conversation history. Each pair consists of a role (either 'human' or 'assistant') and the message content. This allows the system to use the context of the conversation to refine results. Example:

  ```json
  [
    ["human", "What is Perplexica?"],
    ["assistant", "Perplexica is an AI-powered search engine..."]
  ]
  ```

- **`stream`** (boolean, optional): When set to `true`, enables streaming responses. Default is `false`.

### Response

The response from the API includes both the final message and the sources used to generate that message.

#### Standard Response (stream: false)

```json
{
  "message": "Perplexica is an innovative, open-source AI-powered search engine designed to enhance the way users search for information online. Here are some key features and characteristics of Perplexica:\n\n- **AI-Powered Technology**: It utilizes advanced machine learning algorithms to not only retrieve information but also to understand the context and intent behind user queries, providing more relevant results [1][5].\n\n- **Open-Source**: Being open-source, Perplexica offers flexibility and transparency, allowing users to explore its functionalities without the constraints of proprietary software [3][10].",
  "sources": [
    {
      "pageContent": "Perplexica is an innovative, open-source AI-powered search engine designed to enhance the way users search for information online.",
      "metadata": {
        "title": "What is Perplexica, and how does it function as an AI-powered search ...",
        "url": "https://askai.glarity.app/search/What-is-Perplexica--and-how-does-it-function-as-an-AI-powered-search-engine"
      }
    },
    {
      "pageContent": "Perplexica is an open-source AI-powered search tool that dives deep into the internet to find precise answers.",
      "metadata": {
        "title": "Sahar Mor's Post",
        "url": "https://www.linkedin.com/posts/sahar-mor_a-new-open-source-project-called-perplexica-activity-7204489745668694016-ncja"
      }
    }
        ....
  ]
}
```

#### Streaming Response (stream: true)

When streaming is enabled, the API returns a stream of newline-delimited JSON objects. Each line contains a complete, valid JSON object. The response has Content-Type: application/json.

Example of streamed response objects:

```
{"type":"init","data":"Stream connected"}
{"type":"promptUsed","data":"Your custom response prompt or default prompt..."}
{"type":"sources","data":[{"pageContent":"...","metadata":{"title":"...","url":"..."}},...]}
{"type":"response","data":"Perplexica is an "}
{"type":"response","data":"innovative, open-source "}
{"type":"response","data":"AI-powered search engine..."}
{"type":"done"}
```

Clients should process each line as a separate JSON object. The different message types include:

- **`init`**: Initial connection message
- **`promptUsed`**: The prompt template that was actually used for generating the response (either your custom `responsePrompt` or the default)
- **`sources`**: All sources used for the response
- **`response`**: Chunks of the generated answer text
- **`done`**: Indicates the stream is complete

### Fields in the Response

- **`message`** (string): The search result, generated based on the query and focus mode.
- **`sources`** (array): A list of sources that were used to generate the search result. Each source includes:
  - `pageContent`: A snippet of the relevant content from the source.
  - `metadata`: Metadata about the source, including:
    - `title`: The title of the webpage.
    - `url`: The URL of the webpage.
- **`promptUsed`** (string, in non-streaming responses): The prompt template that was actually used for generating the response. This will be your custom `responsePrompt` if provided, or the default prompt for the selected focus mode.

### Custom Prompts

Perplexica supports custom prompt overrides for both the query retrieval phase and the response generation phase:

#### Response Prompt (`responsePrompt`)

The response prompt controls how the final answer is formatted and generated. You can use these template variables:

- `{context}` - The retrieved documents/context from search
- `{systemInstructions}` - User-provided system instructions
- `{query}` - The user's query (automatically inserted by the system)
- `{date}` - Current date and time in ISO format (UTC)

Example:
```json
{
  "responsePrompt": "You are a technical expert. Answer in bullet points. Use context: {context}. Follow instructions: {systemInstructions}. Date: {date}"
}
```

#### Retriever Prompt (`retrieverPrompt`)

The retriever prompt controls how queries are parsed and rephrased before searching. You can use these template variables:

- `{chat_history}` - Conversation history (formatted as string)
- `{query}` - The user's current query

The retriever prompt should return responses in XML format:
- Questions in `<question>...</question>` tags
- URLs in `<links>...</links>` tags (one per line)

Example:
```json
{
  "retrieverPrompt": "Always perform searches. Rephrase the question into a standalone query. Return in <question> XML block."
}
```

For more detailed examples and testing instructions, see [TESTING_CUSTOM_PROMPTS.md](../TESTING_CUSTOM_PROMPTS.md).

### Error Handling

If an error occurs during the search process, the API will return an appropriate error message with an HTTP status code.

- **400**: If the request is malformed or missing required fields (e.g., no focus mode or query), or if an invalid model is selected.
- **500**: If an internal server error occurs during the search.
