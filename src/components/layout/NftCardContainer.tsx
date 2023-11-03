import React from "react";
import NftCard from "./NftCard";

import { ZeroDevWeb3Auth } from "@zerodev/web3auth";
import { useAccount } from "wagmi";
import { api } from "~/utils/api";

const NftCardContainer = () => {
  const { isConnected } = useAccount();

  const { data } = api.nft.getNftListed.useQuery({});
  console.log("data", data);

  return (
    <section className="section explore" id="explore">
      <div className="container">
        <p className="section-subtitle">Exclusive Assets</p>

        <div className="title-wrapper">
          <h2 className="h2 section-title">Explore</h2>
        </div>

        <ul className="grid-list">
          {data?.map((e, i) => {
            return (
              <li key={i}>
                <NftCard
                  src={e.ipfsHash}
                  title={e.title}
                  ownerAddress={e.ownerAddress}
                  price={e.price}
                  active={e.active}
                  id={e.id}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default NftCardContainer;
