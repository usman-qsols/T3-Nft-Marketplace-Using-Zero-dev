import React from "react";
import dynamic from "next/dynamic";

// const LoginPage = dynamic(() => import("../components/login/login"), {
//     ssr: false,
//   });

const NftCardContainer = dynamic(
  () => import("../components/layout/NftCardContainer"),
  {
    ssr: false,
  },
);

const ExploreNfts = () => {
  return <NftCardContainer />;
};

export default ExploreNfts;
