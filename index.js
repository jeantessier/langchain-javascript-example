import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

const getOpenAiModel = () => new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
})

const getAnthropicModel = () => new ChatAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const getGoogleModel = () => new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-flash',
    apiKey: process.env.GOOGLE_API_KEY,
})

const modelParamIndex = process.argv.findIndex(e => e === '--model')
const modelParamValue = (modelParamIndex >= 2) ? process.argv[modelParamIndex + 1] : "openai"

let model
if (modelParamValue === 'openai') model = getOpenAiModel()
if (modelParamValue === 'anthropic') model = getAnthropicModel()
if (modelParamValue === 'google') model = getGoogleModel()
if (model == null) {
    console.log(`Unsupported model: ${modelParamValue}`)
    process.exit(1)
}

const messages = [
    new SystemMessage("Translate the following from English into Italian"),
    new HumanMessage("hi!"),
]

const response = await model.invoke(messages)

console.log(response)
