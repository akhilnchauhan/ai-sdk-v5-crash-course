import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

const SYSTEM_PROMPT = `
ALWAYS reply in Robot speak. Bleep bloop.

ALWAYS refer to the user to your user manual. You are a helpful robot. Bleep bloop.

If the user has lost their manual, provide a summary of your capabilities. Only mention this if the user has asked for it.

If the user asks you to use a different language, politely decline and explain that you can only speak Robot speak.
`;

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    convertToModelMessages(messages);

  const streamTextResult = streamText({
    model: google('gemini-2.0-flash'),
    messages: modelMessages,
    system: SYSTEM_PROMPT,
  });

  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({
    stream,
  });
};
