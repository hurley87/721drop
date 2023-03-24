// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Data = {
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prompt = req.body.prompt;
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: '1024x1024',
  });

  const url: string = response.data.data[0].url as string;
  res.status(200).json({ url });
}
