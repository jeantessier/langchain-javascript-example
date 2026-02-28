import minimist from 'minimist'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatPerplexity } from '@langchain/community/chat_models/perplexity'
import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatDeepSeek } from '@langchain/deepseek'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatOpenAI } from '@langchain/openai'

const getOpenAiModel = () => new ChatOpenAI({
    model: process.env.OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
})

const getAnthropicModel = () => new ChatAnthropic({
    model: process.env.ANTHROPIC_MODEL,
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const getGoogleModel = () => new ChatGoogleGenerativeAI({
    model: process.env.GOOGLE_MODEL,
    apiKey: process.env.GOOGLE_API_KEY,
})

const getDeepSeekModel = () => new ChatDeepSeek({
    model: process.env.DEEPSEEK_MODEL,
    apiKey: process.env.DEEPSEEK_API_KEY,
})

const getPerplexityModel = () => new ChatPerplexity({
    model: process.env.PERPLEXITY_MODEL,
    apiKey: process.env.PERPLEXITY_API_KEY,
})

const argv = minimist(process.argv.slice(2))
const modelParamValue = argv.model || "openai"

let model
if (modelParamValue === 'openai') model = getOpenAiModel()
if (modelParamValue === 'anthropic') model = getAnthropicModel()
if (modelParamValue === 'google') model = getGoogleModel()
if (modelParamValue === 'deepseek') model = getDeepSeekModel()
if (modelParamValue === 'perplexity') model = getPerplexityModel()
if (model == null) {
    console.log(`Unsupported model: ${modelParamValue}`)
    process.exit(1)
}

const callStringOutputParser = async input => {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a talented comedian."],
        ["human", "Tell a dad joke based on the word {input}."],
    ])

    const outputParser = new StringOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    return await chain.invoke(
        { input },
        {
            callbacks: [
                {
                    async handleChatModelStart(llm, messages) {
                        console.log('*** handleChatModelStart  ***')
                        console.log('output:', JSON.stringify(messages, null, 2))
                    },
                    async handleLLMEnd(output) {
                        console.log('*** handleLLMEnd  ***')
                        console.log('output:', JSON.stringify(output, null, 2))
                    },
                }
            ],
        },
    )
}

const callStructuredOutputParser = async phrase => {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}
    `)

    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "the name of the person",
        age: "the age of the person",
    })

    const chain = prompt.pipe(model).pipe(outputParser)

    console.log('=====  format_instructions  =====')
    console.log(outputParser.getFormatInstructions())
    console.log('=====  format_instructions  =====')

    return await chain.invoke(
        {
            phrase,
            format_instructions: outputParser.getFormatInstructions(),
        },
        {
            callbacks: [
                {
                    async handleChatModelStart(llm, messages) {
                        console.log('*** handleChatModelStart  ***')
                        console.log('output:', JSON.stringify(messages, null, 2))
                    },
                    async handleLLMEnd(output) {
                        console.log('*** handleLLMEnd  ***')
                        console.log('output:', JSON.stringify(output, null, 2))
                    },
                }
            ],
        },
    )
}

console.log("String Response")
console.log("---------------")
const input = 'dog'
console.log(`input word: ${input}`)
const stringResponse = await callStringOutputParser(input)
console.log(stringResponse)

console.log("")

console.log("Structured Response")
console.log("-------------------")
const phrase = 'Max is 30 years old'
console.log(`input phrase: ${phrase}`)
const structuredResponse = await callStructuredOutputParser(phrase)
console.log(structuredResponse)
