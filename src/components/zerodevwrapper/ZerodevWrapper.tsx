import React from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
// import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { polygonMumbai } from "wagmi/chains";
import {
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  googleWallet,
  facebookWallet,
  githubWallet,
  discordWallet,
  twitchWallet,
  twitterWallet,
} from "@zerodev/wagmi/rainbowkit";

export const projectId = "aec66fa3-9e4f-4d6a-a5a8-7172d367b286";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: "GNcwwQapYYPCVYzdNODhNff-OtR8nlad" })],
);

const connectors = connectorsForWallets([
  {
    groupName: "Social",
    wallets: [
      googleWallet({ chains, options: { projectId } }),
      facebookWallet({ chains, options: { projectId } }),
      githubWallet({ chains, options: { projectId } }),
      discordWallet({ chains, options: { projectId } }),
      twitchWallet({ chains, options: { projectId } }),
      twitterWallet({ chains, options: { projectId } }),
    ],
  },
]);

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function ZeroDevWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider
        theme={darkTheme()}
        chains={chains}
        modalSize="compact"
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default ZeroDevWrapper;
