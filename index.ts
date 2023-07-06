import { ChatOpenAI } from "langchain/chat_models/openai"
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { CallbackManager } from "langchain/callbacks"

async function main() {
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-16k",
    temperature: 0.7,
    streaming: true,
    callbacks: CallbackManager.fromHandlers({
      async handleLLMNewToken(token) {
        process.stdout.write(token)
      }
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
    inputVariables: ["user_location"]
  });

  const summary = new LLMChain({
    llm,
    prompt,
    // verbose: true,
  });

  await summary.run("Rome")
}

(async () => {
  try {
    await main();
  } catch (err) {
    console.error(err)
  }
})()
