import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import axios from "axios";
import getStipePromise from "../../components/lib/stripe";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useFeeData,
} from "wagmi";
import { useSelector, useDispatch } from "react-redux";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { setUpdateNftData } from "~/redux/features/BuyNftSlicer";
import T3MarketJson from "../../components/contractAddressAndJson/T3MarketplaceContract.json";
import MyTokenJson from "../../components/contractAddressAndJson/MyToken.json";
import T3MarketAddress from "../../components/contractAddressAndJson/T3MarketplaceContract-address.json";
import MyTokenAddress from "../../components/contractAddressAndJson/MyToken-address.json";
import LoadingModal from "../../components/layout/loader";
const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    "pk_test_51O3IVKIdcf8l1iwJyfBoPIDsYS1uBVV9mYdwCGqurdSxg0deL02H6LUO8GZi9U1z3GLGb1GWw7db6BMidD9BAnQ700V5my261i",
);

type Data = {
  id: string;
  title: string;
  active: boolean | null;
  price: string | null;
  ipfsHash: string | null;
  description: string | null;
  tokenId: string | null;
  ownerAddress: string | null;
  created_at: Date;
  updated_at: Date;
};

const NftDetailPage = () => {
  const [data, setData] = useState<Data | null>();
  const [openInputModal, setOpenInputModal] = useState(false);
  const [price, setPrice] = useState("");

  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { id } = router.query;
  const Id: any = id;
  const dispatch = useDispatch();

  const { data: myNft } = api.nft.getSingleNft.useQuery({ id: Id });
  const updateNftData = api.nft.updateNft.useMutation();
  const updateBuyNft = api.nft.buyNft.useMutation();

  useEffect(() => {
    setData(myNft);
    console.log("data", data);
    console.log("address", address);
  }, [myNft]);

  const products = [
    {
      product: 1,
      name: data?.title,
      price: data?.price,
      quantity: 1,
    },
  ];

  const alertFunc = () => {
    alert(
      "If didn't buy and approve tokens , you can click on the buy token button before buying nft.",
    );
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    dispatch(
      setUpdateNftData({ ownerAddress: data?.ownerAddress, p_id: data?.id }),
    );

    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: products,
      email: "usamnrahim2000@gmail.com",
      p_id: data?.id,
      ownerAddress: address,
      oldOwnerAddress: data?.ownerAddress,
      price: data?.price,
      tokenId: data?.tokenId,
      amount: data?.price,
    });

    //Redirect user to checkout page
    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result?.error) alert(`Error: ${result?.error.message}`);
  };

  //////////////////////////////////////////////////////////////////
  ////////////////////// Listing Nft  //////////////////////////////
  //////////////////////////////////////////////////////////////////
  const { config: listConfig } = usePrepareContractWrite({
    address: "0xB35610f89D0d8EC1aC3F2F3887475eB16A78BC35",
    abi: T3MarketJson.abi,
    functionName: "listNft",
    args: [data?.tokenId, price],
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
  } = useWaitForTransaction({
    hash: listData?.hash,
    onSuccess: () => {
      updateNftData.mutateAsync({
        id: data?.id,
        price: price,
        active: true,
      });
      router.push("/");
    },
  });

  const listingSuccess = listTxIsSuccess;

  async function listingNft(e: any) {
    e.preventDefault();
    try {
      if (listMyNft) {
        listMyNft();
        console.log("hash", listData?.hash);
      }
      if (listWaitError) {
        alert(listWaitError);
      }
    } catch (error) {
      alert(error);
    }
  }

  //////////////////////////////////////////////////////////
  /////////////////// Buying Nft ///////////////////////////
  //////////////////////////////////////////////////////////

  // const { config: buyConfig } = usePrepareContractWrite({
  //   address: "0xB35610f89D0d8EC1aC3F2F3887475eB16A78BC35",
  //   abi: T3MarketJson.abi,
  //   functionName: "buy",
  //   args: [data?.tokenId, data?.price],
  // });
  // const {
  //   data: buyData,
  //   isLoading: buyIsLoading,
  //   isSuccess: buyIsSuccess,
  //   write: buyNft,
  // } = useContractWrite(buyConfig);

  const { config: buyConfig } = usePrepareContractWrite({
    address: "0xB35610f89D0d8EC1aC3F2F3887475eB16A78BC35",
    abi: T3MarketJson.abi,
    functionName: "buy",
    args: [data?.tokenId, data?.price],
  });
  const {
    data: buyData,
    isLoading: buyIsLoading,
    isSuccess: buyIsSuccess,
    write: buyNft,
  } = useContractWrite(buyConfig);

  const buyingSuccess = buyIsSuccess && !buyIsLoading;

  const {
    data: buyWaitData,
    isError: buyWaitError,
    isSuccess: buyTxIsSuccess,
    isLoading: buyWaitIsLoading,
  } = useWaitForTransaction({
    hash: buyData?.hash,
    onSuccess: () => {
      updateBuyNft.mutateAsync({
        id: data?.id,
        ownerAddress: address,
        price: "0",
        active: false,
      });

      router.push("/OwnerNfts/ownerAddress");
    },
  });

  // const buyingSuccess = buyTxIsSuccess;

  async function buyingNft(e: any) {
    e.preventDefault();
    console.log("helloo");

    if (buyNft) {
      console.log("helloo 1");
      buyNft();
      console.log("helloo 2");

      console.log("hash", buyData?.hash);
    }
    if (true) {
      console.log("helloo 4");
    }
    console.log("hellow 3");
    if (buyWaitError) {
      alert(buyWaitError);
    }
    console.log("token id", data?.tokenId);
  }

  return (
    <>
      <section className="body-font card explore-card overflow-hidden bg-white text-gray-700">
        <div className="container mx-auto px-5 py-24">
          <div className="mx-auto flex flex-wrap lg:w-4/5">
            <img
              alt="ecommerce"
              className="w-full rounded border border-gray-200 object-cover object-center lg:w-1/2"
              src={data?.ipfsHash ?? ""}
            />
            <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10">
              <h1 className="title-font mb-1 text-3xl font-medium text-sky-400">
                {data?.title}
              </h1>

              <p className="leading-relaxed text-gray-400">
                {data?.description}
              </p>
              <p className="leading-relaxed text-gray-400">
                Owner Address: {data?.ownerAddress}
              </p>

              <p className="leading-relaxed text-gray-400">
                Token Id : {data?.tokenId}
              </p>
              <p className="leading-relaxed text-gray-400">
                Price : $ {data?.price}
              </p>

              <div className="flex">
                {address === data?.ownerAddress || !data?.active
                  ? ""
                  : isConnected && (
                      <>
                        <button
                          className="ml-auto flex rounded border-0 bg-sky-600 px-6 py-2 text-white hover:bg-sky-800 focus:outline-none"
                          onClick={(e: any) => buyingNft(e)}
                        >
                          {buyIsLoading ? "Please Wait..." : "Buy Nft"}
                        </button>
                        <button
                          className="ml-auto flex rounded border-0 bg-sky-600 px-6 py-2 text-white hover:bg-sky-800 focus:outline-none"
                          onClick={(e: any) => router.push("/BuyTokens")}
                        >
                          Buy {data?.price} Tokens for ${data?.price}
                        </button>
                      </>
                    )}

                {!data?.active && address === data?.ownerAddress ? (
                  <button
                    className="ml-auto flex rounded border-0 bg-red-500 px-6 py-2 text-white hover:bg-red-600 focus:outline-none"
                    onClick={() => setOpenInputModal(!openInputModal)}
                  >
                    Re-sell
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        {openInputModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="flex shadow-md">
              <div className="flex h-[24rem] w-[24rem] flex-wrap content-center justify-center rounded-l-md border border-dashed border-red-500 bg-white">
                <div className="w-72">
                  <h1 className="text-xl font-semibold">Welcome back</h1>
                  <small className="text-gray-400">
                    Welcome back! Please enter the price on which you want to
                    re-sell your nft
                  </small>

                  <form className="mt-4">
                    <div className="mb-3">
                      <label className="mb-2 block text-xs font-semibold">
                        Price
                      </label>
                      <input
                        placeholder="Enter Price"
                        className="block w-full rounded-md border border-gray-300 px-1.5 py-1 text-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        required={true}
                        onChange={(e) => {
                          setPrice(e.target.value);
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <button
                        className="mb-1.5 block w-full rounded-md bg-red-500 px-2 py-1.5 text-center text-white hover:bg-red-600"
                        onClick={listingNft}
                      >
                        {listIsLoading ? "Listing..." : "List My Nft"}
                      </button>
                      <button
                        className="mb-1.5 block w-[30px] rounded-md bg-red-500 px-2 py-1.5 text-center text-white hover:bg-red-600"
                        onClick={() => setOpenInputModal(!openInputModal)}
                      >
                        X
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default NftDetailPage;
