import { api } from "../../utils/api";
import { useRouter } from "next/router";
import Hero from "../layout/hero";
// import { Flex, Input, Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import minilogo from "../../utilities/minilogo.png";
import { useSelector, useDispatch } from "react-redux";
import { setSmartAccount } from "~/redux/features/SmartAccountSlicer";

export default function RegisterPage() {
  const [user, setUser] = useState(false);
  return (
    <>
      {user ? (
        <Hero
          create="Create"
          loginlogoutbtn="Logout"
          onclick={"logoutHandle"}
        />
      ) : (
        <Hero create="Create" onclick={"loginHandle"} />
      )}
    </>
  );
}
