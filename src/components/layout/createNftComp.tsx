import React, { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import {
  usePrepareContractBatchWrite,
  useContractBatchWrite,
} from "@zerodev/wagmi";
import T3MarketJson from "../contractAddressAndJson/T3MarketplaceContract.json";
import MyTokenJson from "../contractAddressAndJson/MyToken.json";
import T3MarketAddress from "../contractAddressAndJson/T3MarketplaceContract-address.json";
import MyTokenAddress from "../contractAddressAndJson/MyToken-address.json";
import LoadingModal from "./loader";

const CreateNftComp = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState<string>("");
  const [ipfsUrl, setIpfsUrl] = useState<string>("");
  const [fileURL, setFileURL] = useState();
  const [message, updateMessage] = useState("");
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [listingLoader, setListingLoader] = useState(false);

  const { mutateAsync, error } = api.nft.createNft.useMutation();
  const router = useRouter();

  const active = true;
  const sellerAddress = "0xCDeD68e89f67d6262F82482C2710Ddd52492808a";
  const contractAddress = "0x43c99947D6E25497Dc69351FaBb3025F7ACC2A6b";

  const { address, isConnected } = useAccount();
  console.log("Add", address);

  async function OnChangeFile(e: any) {
    var file = e.target.files[0];
    try {
      //upload the file to IPFS

      updateMessage("Uploading image.. please dont click anything!");
      const response = (await uploadFileToIPFS(file, title)) as {
        success: boolean;
        pinataURL: string;
      };
      console.log("hello pinata res ", response);
      console.log(response);
      if (response && response.success === true) {
        updateMessage("");
        console.log("Uploaded image to Pinata: ", response?.pinataURL);
        setIpfsUrl(response.pinataURL);
        setDisableButton(false);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  async function uploadMetadataToIPFS() {
    //Make sure that none of the fields are empty
    if (!title || !description || !price || !ipfsUrl) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      title,
      description,
      price,
      ipfsUrl: fileURL,
    };

    try {
      //upload the metadata JSON to IPFS
      const response = (await uploadJSONToIPFS(nftJSON)) as {
        success: boolean;
        pinataURL: string;
      };
      console.log("res : ", response);
      if (response && response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response?.pinataURL);
        return response?.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  const MarketAddress = T3MarketAddress.address;
  console.log("t3", MarketAddress);

  //////////////////////////////////////////////////////////////////
  //////////////////////  Token ID  ////////////////////////////////
  //////////////////////////////////////////////////////////////////

  const {
    data: tokenIdData,
    isError,
    isLoading,
  } = useContractRead({
    address: "0xB35610f89D0d8EC1aC3F2F3887475eB16A78BC35",
    abi: T3MarketJson.abi,
    functionName: "_tokenIds",
  });

  console.log("token Id", tokenIdData?.toString());

  //////////////////////////////////////////////////////////////////
  ////////////////////// Listing Nft  //////////////////////////////
  //////////////////////////////////////////////////////////////////
  const { config: listConfig } = usePrepareContractWrite({
    address: "0xB35610f89D0d8EC1aC3F2F3887475eB16A78BC35",
    abi: T3MarketJson.abi,
    functionName: "listNft",
    args: [tokenIdData?.toString(), price],
  });
  const {
    data: listData,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    write: listMyNft,
  } = useContractWrite(listConfig);

  const {
    data: listWaitData,
    isError: listWaitError,
    isSuccess: listTxIsSuccess,
    isLoading: listTxIsLoading,
  } = useWaitForTransaction({
    hash: listData?.hash,
    onSuccess: () => {
      router.push("/OwnerNfts/ownerAddress");
    },
  });

  const listingSuccess = listTxIsSuccess;

  //////////////////////////////////////////////////////////////////
  //////////////////////  Minting Nft  /////////////////////////////
  //////////////////////////////////////////////////////////////////

  const { config: mintConfig } = usePrepareContractWrite({
    address: "0xB35610f89D0d8EC1aC3F2F3887475eB16A78BC35",
    abi: T3MarketJson.abi,
    functionName: "safeMint",
    args: [address, ipfsUrl],
  });
  const {
    data: mintData,
    write: safeMintNft,
    isSuccess: ismintStarted,
    isLoading: isMintLoading,
  } = useContractWrite(mintConfig);

  const {
    data: waitData,
    isError: waitError,
    isSuccess: txIsSuccess,
  } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess: async () => {
      setListingModalOpen(true);
    },
  });

  async function listingNft(e: any) {
    e.preventDefault();
    try {
      if (listMyNft) {
        listMyNft();
        console.log("hash", listData?.hash);
        setListingModalOpen(false);
        setListingLoader(true);
      }
      if (listWaitError) {
        alert(listWaitError);
      }

      mutateAsync({
        title: title,
        price: price,
        description: description,
        ipfsHash: ipfsUrl,
        ownerAddress: address?.toString(),
        tokenId: tokenIdData?.toString(),
        active: true,
      });
    } catch (error) {
      alert(error);
    }
  }

  function mintNft(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    console.log("Ipfs url--> ", ipfsUrl);

    try {
      if (safeMintNft) {
        safeMintNft();
        console.log("hash", mintData?.hash);
      }
      if (waitError) {
        alert(waitError);
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="container">
      <p className="section-subtitle mt-20">How It Works</p>

      <h2 className="h2 section-title">Create and sell your NFTs</h2>

      <div className="footer-list mb-20 mt-20 w-[100%] md:w-[50%]">
        <form action="" className="newsletter-form">
          <input
            type="text"
            className="newsletter-input mt-5"
            placeholder="Your Nft Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            className="newsletter-input mt-5"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            className="newsletter-input mt-5"
            placeholder="Price (in-USDC) > 0.000001"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            required
          />
          <input
            type="file"
            className="newsletter-input mt-5"
            placeholder="Upload Image"
            onChange={OnChangeFile}
            required
          />
          <p>{message}</p>

          <button
            type="submit"
            className={` mt-5 flex h-20 w-[100%] justify-center text-[2rem] ${
              disableButton || !isConnected ? "disableBtn" : "btn"
            } `}
            aria-label="Submit"
            disabled={disableButton || !isConnected ? true : false}
            onClick={mintNft}
          >
            Submit
          </button>
        </form>
      </div>

      {isMintLoading ? <LoadingModal h2="Minting, Please be patient" /> : ""}
      {listIsLoading || listingLoader ? (
        <LoadingModal h2="Listing, Please be patient" />
      ) : (
        ""
      )}
      {listingModalOpen ? (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-[10px] py-10">
          <div className="max-h-[300px] w-[300px] max-w-xl overflow-y-auto bg-white p-[10px] sm:rounded-2xl">
            <div className="w-full">
              <div className="m-8 mx-auto my-20 flex max-w-[400px] flex-col items-center justify-center">
                <h1 className="font-bold">
                  By clicking on the below button, your Nft will be listed on
                  our marketplace
                </h1>
                <button className="btn_list" onClick={listingNft}>
                  {listTxIsLoading ? "Liting, please wait..." : "List Your Nft"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CreateNftComp;
