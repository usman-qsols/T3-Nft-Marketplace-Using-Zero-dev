import axios from "axios";
//require('dotenv').config();
// const key: string = process.env.REACT_APP_PINATA_KEY ?? "";
// const secret: string = process.env.REACT_APP_PINATA_SECRET ?? "";

// const key: string =
//   typeof process.env.REACT_APP_PINATA_KEY === "string"
//     ? process.env.REACT_APP_PINATA_KEY
//     : "";
// const secret: string =
//   typeof process.env.REACT_APP_PINATA_SECRET === "string"
//     ? process.env.REACT_APP_PINATA_SECRET
//     : "";

const JWT = `${process.env.NEXT_PUBLIC_PINATA_JWT}`;
const API_KEY = `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`;
const API_SECRET = `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`;

// const axios = require("axios");
const FormData = require("form-data");
// import FormData from "form-data";

// type Headers = {
//   success: boolean;
//   pinataURL: any;
// };

export const uploadJSONToIPFS = async (JSONBody:any) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //making axios POST request to Pinata ⬇️
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: API_KEY,
        pinata_secret_api_key: API_SECRET,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataURL: `https://gateway.pinata.cloud/ipfs/ + ${response.data.IpfsHash}`,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const uploadFileToIPFS = async (file: any, name: string) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //making axios POST request to Pinata ⬇️

  let data = new FormData();
  data.append("file", file);

  const metadata = JSON.stringify({
    name: name,
    // keyvalues: {
    //   exampleKey: "exampleValue",
    // },
    keyvalues: {
      PINATA_API_KEY: API_KEY,
      PINATA_API_SECRET: API_SECRET,
    },
  });
  data.append("pinataMetadata", metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    // customPinPolicy: {
    //   regions: [
    //     {
    //       id: "FRA1",
    //       desiredReplicationCount: 1,
    //     },
    //     {
    //       id: "NYC1",
    //       desiredReplicationCount: 2,
    //     },
    //   ],
    // },
  });
  data.append("pinataOptions", pinataOptions);

  return axios
    .post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: API_KEY,
        pinata_secret_api_key: API_SECRET,
      },
    })
    .then(function (response) {
      console.log("response : ",response.data)
      console.log("image uploaded", response.data.IpfsHash);
      return {
        success: true,
        pinataURL:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
