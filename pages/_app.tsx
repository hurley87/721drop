import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { Toaster } from 'react-hot-toast';
import { sepolia } from 'wagmi/chains';

const { chains, provider } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: () => ({
        http: 'https://spring-young-tent.ethereum-sepolia.quiknode.pro/828de30c760b7c7568ceabb66fed417ec80799fd/',
      }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: '712Drop',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <Component {...pageProps} />
          <Toaster position="top-center" />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
