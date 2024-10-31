# OpenAI Test

A sample Node that uses LangChain to talk to ChatGPT.

You’ll need an API key.  So just follow the instructions to
[obtain your OpenAI API key](https://platform.openai.com/api-keys).
Save it to the `.env` file as the `OPENAI_API_KEY` environment variable.  You
can use `.env.template` as a guide to structure your `.env` file.

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

If you don't specify `--model`, it will default to `openai` and use ChatGPT.
