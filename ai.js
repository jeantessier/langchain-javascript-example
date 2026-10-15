import { ChatAnthropic } from '@langchain/anthropic'
import { ChatDeepSeek } from '@langchain/deepseek'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPerplexity } from '@langchain/perplexity'

export const listKnownModels = () => ['openai', 'anthropic', 'google', 'deepseek', 'perplexity']

const getAnthropicModel = () => new ChatAnthropic({
    model: process.env.ANTHROPIC_MODEL,
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const getDeepSeekModel = () => new ChatDeepSeek({
    model: process.env.DEEPSEEK_MODEL,
    apiKey: process.env.DEEPSEEK_API_KEY,
})

const getGoogleModel = () => new ChatGoogleGenerativeAI({
    model: process.env.GOOGLE_MODEL,
    apiKey: process.env.GOOGLE_API_KEY,
})

const getOpenAiModel = () => new ChatOpenAI({
    model: process.env.OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    useResponsesApi: true,
})

const getPerplexityModel = () => new ChatPerplexity({
    model: process.env.PERPLEXITY_MODEL,
    apiKey: process.env.PERPLEXITY_API_KEY,
})

export const getModel = modelName => {
    if (modelName === 'openai') return getOpenAiModel()
    if (modelName === 'anthropic') return getAnthropicModel()
    if (modelName === 'google') return getGoogleModel()
    if (modelName === 'deepseek') return getDeepSeekModel()
    if (modelName === 'perplexity') return getPerplexityModel()

    const errorMessage = `Unsupported model "${modelName}" is not one of ${listKnownModels().map((model) => `"${model}"`).join(', ')}`
    console.log(errorMessage)
    throw new Error(errorMessage)
}