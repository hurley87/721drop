import { Stack, Text, Image } from '@chakra-ui/react';
import { useSigner } from 'wagmi';
import Layout from '@/components/Layout';
import PrimaryButton from '@/components/PrimaryButton';
import { Connect } from '@/components/Connect';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: signer } = useSigner();
  const router = useRouter();

  return (
    <Layout>
      <Stack gap="1">
        <Text
          fontSize="3xl"
          fontWeight="bolder"
          textAlign="center"
          style={{ lineHeight: '120%' }}
        >
          Create any NFT collection you can imagine only using text
        </Text>
        <Image
          w="full"
          h="auto"
          alt="preview image"
          src="https://pollock-art.s3.amazonaws.com/pollock-art2518586.jpg"
        />
        {signer ? (
          <Stack gap="1">
            <PrimaryButton
              text="Create Collection"
              onClick={() => router.push('/create')}
            />
          </Stack>
        ) : (
          <Connect />
        )}
      </Stack>
    </Layout>
  );
}
