import minimist from 'minimist'
import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableLambda } from '@langchain/core/runnables'
import { getModel } from './ai.js'
import { logElapsedTime } from './utils.js'

const argv = minimist(process.argv.slice(2))
const modelParamValue = argv.model || "openai"

const model = getModel(modelParamValue)

const callStringOutputParser = async input => {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a talented comedian."],
        ["human", "Tell a dad joke based on the word {input}."],
    ])

    const outputParser = new StringOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    return chain.invoke(
        { input },
        {
            callbacks: [
                {
                    async handleChatModelStart(llm, messages) {
                        console.log('*** handleChatModelStart  ***')
                        console.log('messages:', JSON.stringify(messages, null, 2))
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

    const extractText = RunnableLambda.from(message => {
        const raw = message.content

        // If it's already a plain string, use it directly
        if (typeof raw === "string") return raw

        // If it's the Responses API array format, extract the text field
        if (Array.isArray(raw)) {
            return raw
                .filter((block) => block.type === "text")
                .map((block) => block.text)
                .join("\n")
        }

        return String(raw)
    })

    const stripFences = RunnableLambda.from(text =>
        text
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim()
    )

    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "the name of the person",
        age: "the age of the person",
    })

    const chain = prompt.pipe(model).pipe(extractText).pipe(stripFences).pipe(outputParser)

    console.log('=====  format_instructions  =====')
    console.log(outputParser.getFormatInstructions())
    console.log('=====  format_instructions  =====')

    return chain.invoke(
        {
            phrase,
            format_instructions: outputParser.getFormatInstructions(),
        },
        {
            callbacks: [
                {
                    async handleChatModelStart(llm, messages) {
                        console.log('*** handleChatModelStart  ***')
                        console.log('messages:', JSON.stringify(messages, null, 2))
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
await logElapsedTime(async () => {
    const response = await callStringOutputParser(input)
    console.log(response)
})

console.log("")

console.log("Structured Response")
console.log("-------------------")
const phrase = 'Max is 30 years old'
console.log(`input phrase: ${phrase}`)
await logElapsedTime(async () => {
    const response = await callStructuredOutputParser(phrase)
    console.log(response)
})
