import React from "react";
import dynamic from "next/dynamic";

// const LoginPage = dynamic(() => import("../components/login/login"), {
//     ssr: false,
//   });

const OwnerNftContainer = dynamic(
  () => import("../../components/layout/ownerNft"),
  {
    ssr: false,
  },
);

const exploreNfts = () => {
  return <OwnerNftContainer />;
};

export default exploreNfts;
