import { getOvhApiEndpoint, getOvhApiKey, getOvhModelName } from '../config';
import { ChatModel, EmbeddingModel } from '.';

export const PROVIDER_INFO = {
  key: 'ovh',
  displayName: 'OVH',
};

import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { Embeddings } from '@langchain/core/embeddings';

export const loadOvhChatModels = async () => {
  const ovhApiEndpoint = getOvhApiEndpoint();
  const ovhApiKey = getOvhApiKey();
  const ovhModelName = getOvhModelName();

  if (!ovhApiEndpoint || !ovhApiKey || !ovhModelName) return {};

  try {
    const chatModels: Record<string, ChatModel> = {};

    chatModels[ovhModelName] = {
      displayName: ovhModelName,
      model: new ChatOpenAI({
        apiKey: ovhApiKey,
        modelName: ovhModelName,
        temperature: 0.7,
        configuration: {
          baseURL: ovhApiEndpoint,
        },
      }) as unknown as BaseChatModel,
    };

    return chatModels;
  } catch (err) {
    console.error(`Error loading OVH models: ${err}`);
    return {};
  }
};

export const loadOvhEmbeddingModels = async () => {
  const ovhApiEndpoint = getOvhApiEndpoint();
  const ovhApiKey = getOvhApiKey();
  const ovhModelName = getOvhModelName();

  if (!ovhApiEndpoint || !ovhApiKey || !ovhModelName) return {};

  try {
    const embeddingModels: Record<string, EmbeddingModel> = {};

    // OVH may support embeddings, but we'll use the same model for now
    // If embeddings are not supported, this will return an empty object
    embeddingModels[ovhModelName] = {
      displayName: `${ovhModelName} (Embeddings)`,
      model: new OpenAIEmbeddings({
        apiKey: ovhApiKey,
        modelName: ovhModelName,
        configuration: {
          baseURL: ovhApiEndpoint,
        },
      }) as unknown as Embeddings,
    };

    return embeddingModels;
  } catch (err) {
    console.error(`Error loading OVH embedding models: ${err}`);
    return {};
  }
};



