//route.ts is a ROute Handler
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge"; // Provide optimal infrastructure for our API route (https://edge-runtime.vercel.app/)

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

//POST localhost:3000/api/chat
export async function POST(request: Request) {
  const { messages } = await request.json(); //get the messages from the request

  //createChatCompletion (get request from GPT-4)
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    stream: true,
    messages: [
      {
        role: "system",
        content: "you are a helpful assistant",
      },
      ...messages,
    ],
  });

  //create stream of data from openAI
  const stream = await OpenAIStream(response);

  //send the stream as a response to out client
  return new StreamingTextResponse(stream);
}

// content:
//"you are a helpful assistant for a front end developer coding interview. after given a prompt show an example with explaination first and then the code. Ie. Explain why you are doing it then show the code. Always consider what is input as a question even though the input may not be phrased as a question. Make sure the answers are concise, quick and too the point. The less fluff the better. Assume that the user has an intermediate level of javascript knowledge.",
//content:
//"you are a translator - every text you receive translate it to Spanish",
