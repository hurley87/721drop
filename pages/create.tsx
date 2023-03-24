import CreateCollection from '@/components/CreateCollection';
import { useSigner } from 'wagmi';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import { Box, Button, Input, Stack, Text, Flex, Image } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import PrimaryButton from '@/components/PrimaryButton';

export default function Home() {
  const { data: signer } = useSigner();
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate() {
    setIsGenerating(true);
    console.log('Calling OpenAI...');

    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const { url } = data;

      console.log('OpenAI Response: ', url);
      setPreview(url);
      setIsGenerating(false);
    } catch (e) {
      console.log('Error minting NFT: ', e);
      toast.error('Error minting NFT');
      setIsGenerating(false);
    }
  }

  return (
    <Layout>
      {signer && image !== '' && (
        <CreateCollection image={image} prompt={prompt} />
      )}
      {signer && image === '' && (
        <Box maxW="md" mx="auto">
          <Stack gap="1">
            <Text>Describe the art in your NFT collection.</Text>
            <Text fontSize="sm" fontWeight="bold">
              Prompt
            </Text>
            <Input
              type="text"
              placeholder="pfp of a generative AI artist, digital art, postmodernism"
              value={prompt}
              size="sm"
              bg="white"
              style={{ marginTop: '1px' }}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <PrimaryButton
              text="Generate"
              isLoading={isGenerating}
              onClick={generate}
            />
            {preview && (
              <>
                <Image
                  style={{ marginTop: '6px' }}
                  w="full"
                  h="auto"
                  alt="preview image"
                  src={preview}
                />
                <PrimaryButton
                  text="Continue"
                  onClick={() => setImage(preview)}
                />
              </>
            )}
          </Stack>
        </Box>
      )}
      {!signer && <Link href="/">Connect your wallet</Link>}
    </Layout>
  );
}
