import { Button } from '@chakra-ui/react';

type Props = {
  text?: string;
  onClick: () => void;
  isLoading?: boolean;
};

const PrimaryButton = ({
  text = 'Connect Wallet',
  onClick,
  isLoading,
}: Props) => {
  return (
    <Button
      isLoading={isLoading}
      colorScheme="yellow"
      w="full"
      size="sm"
      borderRadius="xs"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
