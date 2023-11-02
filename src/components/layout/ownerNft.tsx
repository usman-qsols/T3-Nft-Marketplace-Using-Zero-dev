import React from "react";
import NftCard from "./NftCard";
import auction1 from "../../utilities/auction-1.jpg";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ZeroDevWeb3Auth } from "@zerodev/web3auth";
import { useAccount } from "wagmi";
import { api } from "~/utils/api";

const NftCardContainer = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  // const { ownerAddress } = router.query;

  const { data } = api.nft.getOwnersNfts.useQuery({
    ownerAddress: address,
  });
  console.log("data", data);

  return (
    <section className="section explore" id="explore">
      {isConnected ? (
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
      ) : (
        <div className="container">
          <p className="section-subtitle">Exclusive Assets</p>

          <div className="title-wrapper">
            <h2 className="h2 section-title">Explore</h2>
          </div>

          <h1>Please Login.</h1>
        </div>
      )}
    </section>
  );
};

export default NftCardContainer;
