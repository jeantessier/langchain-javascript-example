import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { listKnownModels, getModel } from './ai.js'
import { logElapsedTime } from './utils.js'

const obfuscateKey = (key, prefixLength, suffixLength = 4) => `${key?.slice(0, prefixLength)}...${key?.slice(-suffixLength)}`

const getDisplayKey = modelName => {
    if (modelName === 'anthropic') return `ANTHROPIC_API_KEY: ${obfuscateKey(process.env.ANTHROPIC_API_KEY, 15)}`
    if (modelName === 'deepseek') return `DEEPSEEK_API_KEY: ${obfuscateKey(process.env.DEEPSEEK_API_KEY, 7)}`
    if (modelName === 'google') return `GOOGLE_API_KEY: ${obfuscateKey(process.env.GOOGLE_API_KEY, 7)}`
    if (modelName === 'openai') return `OPENAI_API_KEY: ${obfuscateKey(process.env.OPENAI_API_KEY, 14)}`
    if (modelName === 'perplexity') return `PERPLEXITY_API_KEY: ${obfuscateKey(process.env.PERPLEXITY_API_KEY, 9)}`
    return ''
}

const runSmokeTest = async model => {
    const prompt = ChatPromptTemplate.fromMessages([
        // ["system", "You are a professional translator.  You always provide an etymological explanation for your translations."],
        // ["human", "Say hello in Spanish."],
        ["human", "Hi"],
    ])

    const outputParser = new StringOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    return chain.invoke()
}

Promise.all(
    listKnownModels()
        .filter(modelName => ['anthropic', /* 'deepseek', 'google', */ 'openai', 'perplexity'].includes(modelName))
        .map(async modelName => {
            try {
                await logElapsedTime(async () => {
                    console.log(`Smoke test for ${modelName} ${getDisplayKey(modelName)}`)
                    await runSmokeTest(getModel(modelName))
                    console.log(`Smoke test for ${modelName}: OK`)
                })
            } catch (error) {
                console.log(`Smoke test for ${modelName}: ${error}`)
            }
        })
)