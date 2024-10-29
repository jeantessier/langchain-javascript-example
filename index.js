import 'dotenv/config'
import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
})

const messages = [
    new SystemMessage("Translate the following from English into Italian"),
    new HumanMessage("hi!"),
]

await model.invoke(messages)
