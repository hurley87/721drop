import { ConnectButton } from '@rainbow-me/rainbowkit';
import PrimaryButton from './PrimaryButton';

export const Connect = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <PrimaryButton
                    text="Connect Wallet"
                    onClick={openConnectModal}
                  />
                );
              }
              if (chain.unsupported) {
                return (
                  <PrimaryButton
                    text="Wrong network"
                    onClick={openChainModal}
                  />
                );
              }
              return (
                <PrimaryButton
                  text={`${account.displayName}`}
                  onClick={openAccountModal}
                />
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
