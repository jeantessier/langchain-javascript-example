# LangChain JavaScript Example

A sample Node script that uses LangChain to talk to LLMs.

You’ll need an API key for each LLM.  So just follow the instructions linked
below  to obtain your API keys.

- [OpenAI ChatGPT](https://platform.openai.com/api-keys)
- [Anthropic Claude](https://console.anthropic.com/settings/keys)
- [Google Gemini](https://aistudio.google.com/app/apikey)
- [DeepSeek R1](https://platform.deepseek.com/api_keys)

Save the keys to the `app/src/main/resources/.env` file as the corresponding
`..._API_KEY` environment variable.  You can use
`app/src/main/resources/.env.template` as a  guide to structure your `.env`
file.

Install packages, if you haven't already.

```bash
pnpm install
```

## To Run

The sample logic is in the file `index.js`.

To run against OpenAI's ChatGPT:

```bash
pnpm run main --model openai
```

To run against Anthropic's Claude:

```bash
pnpm run main --model anthropic
```

To run against Google's Gemini:

```bash
pnpm run main --model google
```

To run against DeekSeek's R1:

```bash
pnpm run main --model deepseek
```

If you don't specify `--model`, it will default to `openai` and use ChatGPT.
