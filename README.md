# LangChain JavaScript Example

A sample Node script that uses LangChain to talk to LLMs.

You’ll need an API key for each LLM.  So just follow the instructions linked
below  to obtain your API keys.

- [OpenAI ChatGPT](https://platform.openai.com/api-keys)
- [Anthropic Claude](https://console.anthropic.com/settings/keys)
- [Google Gemini](https://aistudio.google.com/app/apikey)
- [DeepSeek R1](https://platform.deepseek.com/api_keys)

Save the keys to the `.env` file as the corresponding `..._API_KEY` environment
variable.  You can use `.env.template` as a  guide to structure your `.env`
file.

Install packages, if you haven't already.

```bash
pnpm install
```

## To Run

The sample logic is in the file `index.js`.

To run against OpenAI's ChatGPT:

```bash
pnpm main --model openai
```

To run against Anthropic's Claude:

```bash
pnpm main --model anthropic
```

To run against Google's Gemini:

```bash
pnpm main --model google
```

To run against DeekSeek's R1:

```bash
pnpm main --model deepseek
```

If you don't specify `--model`, it will default to `openai` and use ChatGPT.
