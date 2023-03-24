import React, { ReactNode } from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import Head from 'next/head';
import { Connect } from './Connect';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children }: Props) => {
  return (
    <Box>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Ideas worth paying for" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@seedclubhq" />
        <meta name="twitter:title" content="Consumer Crypto Club" />
        <meta name="twitter:description" content="Ideas worth paying for" />
        <meta
          name="twitter:image"
          content={`https://consumercrypto.club/future.png`}
        />
        <meta property="og:url" content={`https://consumercrypto.club`} />
        <meta property="og:title" content="ClubLink" />
        <meta property="og:description" content="Ideas worth paying for" />
        <meta
          property="og:image"
          content={`https://consumercrypto.club/future.png`}
        />
      </Head>

      <Box p={2} maxW="74em" w="full" mx="auto">
        <Flex justify="space-between">
          <Link fontSize="xl" fontWeight="bold" href="/">
            721drop
          </Link>
          <Connect />
        </Flex>
        <Box mx="auto" maxW="lg" px="2" py="4">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
