import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

const SYSTEM_PROMPT = `
You are a helpful assistant that extracts data from images. Your main task is to extract the primary colors within an image and return the HEXCODE as a JSON object. Do not return anything else.

The JSON object should have the following format:

{
  "colors": [
    { "type": "primary", "name": "NAME", "hex": "HEXCODE" }
    { "type": "secondary", "name": "NAME", "hex": "HEXCODE" }
  ]
}

Example:

{
  "colors": [
    { "type": "primary", "name": "Red", "hex": "#FF0000" },
    { "type": "secondary", "name": "Blue", "hex": "#0000FF" }
  ]
}

Do not include any backticks, any other formatting, or any other text.
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
