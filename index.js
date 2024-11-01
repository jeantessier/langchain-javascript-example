import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StructuredOutputParser } from 'langchain/output_parsers'

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

const callStringOutputParser = async () => {
    // const prompt = ChatPromptTemplate.fromMessages([
    //     new SystemMessage("You are a talented comedian.  Tell a joke based on a word provided by the user."),
    //     new HumanMessage("{input}"),
    // ])

    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a talented comedian.
        Tell a dad joke based on the word {input}.
    `)

    const outputParser = new StringOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    return await chain.invoke({
        input: "dog",
    })
}

const callStructuredOutputParser = async () => {
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

    return await chain.invoke({
        phrase: "Max is 30 years old",
        format_instructions: outputParser.getFormatInstructions(),
    })
}

console.log("String Response")
console.log("---------------")
const stringResponse = await callStringOutputParser()
console.log(stringResponse)

console.log("")

console.log("Structured Response")
console.log("-------------------")
const structuredResponse = await callStructuredOutputParser()
console.log(structuredResponse)
