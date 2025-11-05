#!/bin/bash

# Test curl request for /api/chat with custom prompt and restrictToSites
curl -X POST http://localhost:9000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "messageId": "test-msg-123",
      "chatId": "test-chat-456",
      "content": "What are the latest developments in AI?"
    },
    "focusMode": "webSearch",
    "optimizationMode": "balanced",
    "prompt": "You are a helpful AI assistant. Provide concise answers with citations. Always cite sources using [number] notation.",
    "restrictToSites": ["techcrunch.com", "wired.com"],
    "history": [],
    "files": []
  }'

