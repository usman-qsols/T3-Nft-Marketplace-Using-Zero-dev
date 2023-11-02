import { type AppType } from "next/app";

import { api } from "~/utils/api";
import "@rainbow-me/rainbowkit/styles.css";
import "~/styles/globals.css";
import "@biconomy/web3-auth/dist/src/style.css";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { ReduxProviders } from "../redux/provider";
import dynamic from "next/dynamic";
// import ZeroDevWrapper from "~/components/zerodevwrapper/ZerodevWrapper";
const ZeroDevWrapper = dynamic(
  () =>
    import("../components/zerodevwrapper/ZerodevWrapper").then(
      (res) => res.default,
    ),
  { ssr: false },
);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ZeroDevWrapper>
        <ReduxProviders>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </ReduxProviders>
      </ZeroDevWrapper>
    </>
  );
};

export default api.withTRPC(MyApp);
