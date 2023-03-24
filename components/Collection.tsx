import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Image, Flex, Badge, Stack } from '@chakra-ui/react';
import { useContract, useProvider, useSigner } from 'wagmi';
import Drop from '../hooks/Drop.json';
import { create } from 'ipfs-http-client';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import PrimaryButton from './PrimaryButton';
import { useRouter } from 'next/router';

type Props = {
  address?: string;
};

const projectId = process.env.NEXT_PUBLIC_INFRA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFRA_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      'base64'
    )}`,
  },
});

const Collection = ({ address }: Props) => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const contract = useContract({
    address,
    abi: Drop.abi,
    signerOrProvider: signer || provider,
  });
  const [isMinting, setIsMinting] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [maxSupply, setMaxSupply] = useState(100);
  const [image, setImage] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [maxMintPerAddress, setMaxMintPerAddress] = useState(2);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (contract && signer) {
        const totalSupply = await contract?.getTotalSupply();
        setTotalSupply(totalSupply.toNumber());
        const recipient = await signer?.getAddress();
        setRecipient(recipient);
        const prompt = await contract?.getPrompt();
        setPrompt(prompt);
        const description = await contract?.getDescription();
        setDescription(description);
        const name = await contract?.getName();
        setName(name);
        const symbol = await contract?.getSymbol();
        setSymbol(symbol);
        const maxSupply = await contract?.getMaxSupply();
        setMaxSupply(maxSupply.toNumber());
        const image = await contract?.getImage();
        setImage(image);
        const mintPrice = await contract?.getMintPrice();
        setMintPrice(ethers.utils.formatEther(mintPrice));
        const maxMintPerAddress = await contract?.getMaxMintPerAddress();
        setMaxMintPerAddress(maxMintPerAddress.toNumber());
      }
    }
    init();
  }, [contract, signer]);

  async function mint() {
    setIsMinting(true);
    console.log('Calling OpenAI...');

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

    const mintJson = {
      name,
      description: prompt,
      image: url,
    };
    const uploaded = await ipfs.add(JSON.stringify(mintJson));
    console.log('Uploaded Hash: ', uploaded);
    const path = uploaded.path;

    try {
      if (recipient) {
        const transaction = await contract?.mint(recipient, path, {
          gasLimit: ethers.utils.hexlify(1000000),
          value: ethers.utils.parseEther('0.011'),
        });
        console.log('Transaction: ', transaction);
        setTransactionHash(transaction?.hash);
        await transaction?.wait();
        toast.success('NFT minted!');
        setTotalSupply(totalSupply + 1);
      }
      setIsMinting(false);
    } catch (e) {
      console.log('Error minting NFT: ', e);
      setIsMinting(false);
    }
  }

  return (
    <Stack gap="2" px="6">
      <Flex justify="space-between" fontSize="lg">
        <Text fontWeight="bold">{name}</Text>
        <Text fontWeight="bold">${symbol}</Text>
      </Flex>
      <Image w="full" h="auto" alt="preview image" src={image} />
      <Stack gap="0">
        <Text fontSize="sm">{description}</Text>
      </Stack>

      {transactionHash === '' ? (
        <PrimaryButton
          text={`Mint for ${mintPrice} ETH`}
          isLoading={isMinting}
          onClick={mint}
        />
      ) : (
        <PrimaryButton
          text="View Transaction"
          onClick={() =>
            router.push(`https://etherscan.io/tx/${transactionHash}`)
          }
        />
      )}

      <Flex justify="space-between">
        <Text fontSize="sm">{maxMintPerAddress} per wallet</Text>
        <Text fontSize="xs">
          {totalSupply} / {maxSupply} Minted
        </Text>
      </Flex>
    </Stack>
  );
};

export default Collection;
