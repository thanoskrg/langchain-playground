import { Transform } from "node:stream"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { CallbackManager } from "langchain/callbacks"


function promptLanguageModel() {
  const stream = new Transform();

  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-16k",
    temperature: 0.7,
    streaming: true,
    callbacks: CallbackManager.fromHandlers({
      async handleLLMNewToken(token) {
        stream.push(token);
      },
      async handleLLMEnd() {
        stream.push('\nThis is the end!');
      },
    })
  });

  const template = `
Your job is to come up with a classic dish from the area that the users suggests.
% USER LOCATION
{user_location}

YOUR RESPONSE:
`.trim()

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["user_location"],
  });

  const summary = new LLMChain({
    llm,
    prompt,
    // verbose: true,
  });

  summary.call({
    user_location: "Greece"
  })

  return stream;
}

(async () => {
  try {
    const stream = promptLanguageModel();
    stream.pipe(process.stdout);
  } catch (err) {
    console.error(err)
  }
})()
