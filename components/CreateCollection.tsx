import React, { useEffect, useState } from 'react';
import { Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { useSigner } from 'wagmi';
import { ethers } from 'ethers';
import Drop from '../hooks/Drop.json';
import { useRouter } from 'next/router';
import PrimaryButton from './PrimaryButton';

type Props = {
  image?: string;
  prompt?: string;
};

const CreatorConnect = ({ image, prompt }: Props) => {
  const { data: signer } = useSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [maxSupply, setMaxSupply] = useState(100);
  const [description, setDescription] = useState('');
  const [maxMintPerAddress, setMaxMintPerAddress] = useState(2);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(5);
  const [royaltyAddress, setRoyaltyAddress] = useState('');
  const [mintPrice, setMintPrice] = useState('0.01');
  const router = useRouter();

  useEffect(() => {
    if (signer) {
      signer.getAddress().then((address) => {
        console.log(address);
        setRoyaltyAddress(address);
      });
    }
  }, [signer]);

  async function handleCreateCollection() {
    setIsLoading(true);

    try {
      if (!signer) {
        return;
      }

      const DropFactory = new ethers.ContractFactory(
        Drop.abi,
        Drop.bytecode,
        signer
      );

      const myNFT = await DropFactory.deploy(
        name,
        symbol,
        maxSupply,
        description,
        prompt,
        image,
        maxMintPerAddress,
        royaltyPercentage,
        royaltyAddress,
        ethers.utils.parseEther(mintPrice)
      );

      await myNFT.deployed();

      console.log('Contract deployed to:', myNFT.address);

      router.push(`/collections/${myNFT.address}`);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <Stack gap="4" pb="10">
      <Stack>
        <Text fontSize="sm" fontWeight="bold">
          Name
        </Text>
        <Input
          style={{ marginTop: '2px' }}
          type="text"
          placeholder="Collection name"
          value={name}
          size="sm"
          bg="white"
          onChange={(e) => setName(e.target.value)}
        />
      </Stack>
      <Stack>
        <Text fontSize="sm" fontWeight="bold">
          Symbol
        </Text>
        <Input
          style={{ marginTop: '2px' }}
          type="text"
          value={symbol}
          placeholder="GNS"
          bg="white"
          size="sm"
          onChange={(e) => setSymbol(e.target.value)}
        />
      </Stack>
      <Stack>
        <Text fontSize="sm" fontWeight="bold">
          Description
        </Text>
        <Textarea
          style={{ marginTop: '2px' }}
          value={description}
          placeholder="Collection description"
          bg="white"
          size="sm"
          onChange={(e) => setDescription(e.target.value)}
        />
      </Stack>
      <Stack>
        <Text fontSize="sm" fontWeight="bold">
          Price (ETH)
        </Text>
        <Input
          style={{ marginTop: '2px' }}
          type="number"
          value={mintPrice}
          bg="white"
          size="sm"
          onChange={(e) => setMintPrice(e.target.value)}
        />
        <Text style={{ marginTop: '1px' }} fontSize="xs">
          Collectors pay an additional 0.001 ETH fee mint fee
        </Text>
      </Stack>
      <Stack>
        <Text fontSize="sm" fontWeight="bold">
          Max Supply
        </Text>
        <Input
          style={{ marginTop: '2px' }}
          type="number"
          value={maxSupply}
          placeholder="$GNS"
          bg="white"
          size="sm"
          onChange={(e) => setMaxSupply(parseInt(e.target.value))}
        />
      </Stack>
      <Stack>
        <Text fontSize="sm" fontWeight="bold">
          Mint limit per address
        </Text>
        <Input
          style={{ marginTop: '2px' }}
          type="number"
          value={maxMintPerAddress}
          placeholder="100"
          bg="white"
          size="sm"
          onChange={(e) => setMaxMintPerAddress(parseInt(e.target.value))}
        />
      </Stack>
      <Stack>
        <Text fontSize="sm" fontWeight="bold">
          Royalty (%)
        </Text>
        <Input
          style={{ marginTop: '2px' }}
          type="number"
          value={royaltyPercentage}
          placeholder="$GNS"
          bg="white"
          size="sm"
          onChange={(e) => setRoyaltyPercentage(parseInt(e.target.value))}
        />
      </Stack>
      <Stack>
        <Text fontSize="sm" fontWeight="bold">
          Payout Address
        </Text>
        <Input
          style={{ marginTop: '2px' }}
          type="text"
          value={royaltyAddress}
          size="sm"
          bg="white"
          onChange={(e) => setRoyaltyAddress(e.target.value)}
        />
        <Text style={{ marginTop: '1px' }} fontSize="xs">
          The address that will receive any withdrawals and royalties.
        </Text>
      </Stack>

      <Stack>
        <PrimaryButton
          text="Create Collection"
          isLoading={isLoading}
          onClick={() => handleCreateCollection()}
        />
      </Stack>
    </Stack>
  );
};

export default CreatorConnect;
