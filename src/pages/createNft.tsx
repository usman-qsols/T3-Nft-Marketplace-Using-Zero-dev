import React from "react";
import dynamic from "next/dynamic";

const CreateNftContainer = dynamic(
  () => import("../components/layout/createNftComp"),
  {
    ssr: false,
  },
);
const CreateNft = () => {
  return <CreateNftContainer />;
};

export default CreateNft;
