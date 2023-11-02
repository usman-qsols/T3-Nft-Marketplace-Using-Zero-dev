import React from "react";
import Image from "next/image";
import logoImage from "../../utilities/logoImage.png";
import linkedin from "../../utilities/linkedin.png";
import github from "../../utilities/github.png";
import facebook from "../../utilities/facebook.png";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Footer = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="logo">
              {/* <img src="./assets/images/logo.svg" width="68" height="48" alt="NFTC Logo"> */}
              <Image
                src={logoImage}
                className="h-15 mr-2 w-80"
                alt="Logo"
              ></Image>
            </a>

            <p className="footer-text">
              The best and user friendly Nft Marketplace where you can explore
              and create fanstastic Nfts.
            </p>

            <ul className="social-list">
              <li>
                <a
                  href="https://www.linkedin.com/in/usman-rahim-2000urk/"
                  className="social-link"
                >
                  <Image
                    src={linkedin}
                    alt="linked"
                    className="h-12 w-12 contrast-200 grayscale filter hover:opacity-50"
                  ></Image>
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/usman-2000/"
                  className="social-link"
                >
                  <Image
                    src={github}
                    alt="linked"
                    className="h-12 w-12 contrast-200 grayscale filter hover:opacity-50"
                  ></Image>
                </a>
              </li>

              <li>
                <a href="www.facebook.com" className="social-link">
                  <Image
                    src={facebook}
                    alt="linked"
                    className="h-12 w-12 contrast-200 grayscale filter hover:opacity-50"
                  ></Image>
                </a>
              </li>

              {/* <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-discord"></ion-icon>
                  <ion-icon name="logo-discord"></ion-icon>
                </a>
              </li> */}
            </ul>
          </div>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Useful Links</p>
            </li>

            <li>
              <a
                onClick={() => router.push("/exploreNfts")}
                className="footer-link"
              >
                All NFTs
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                How It Works
              </a>
            </li>

            <li>
              <a
                className="footer-link"
                onClick={() => router.push("/createNft")}
              >
                Create
              </a>
            </li>

            <li>
              <a
                onClick={() => router.push("/exploreNfts")}
                className="footer-link"
              >
                Explore
              </a>
            </li>

            <li>
              <a
                onClick={() => router.push("/exploreNfts")}
                className="footer-link"
              >
                Privacy & Terms
              </a>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Community</p>
            </li>

            <li>
              <a href="#" className="footer-link">
                Help Center
              </a>
            </li>

            {/* <li>
              <a href="#" className="footer-link">
                Partners
              </a>
            </li> */}

            {/* <li>
              <a href="#" className="footer-link">
                Suggestions
              </a>
            </li> */}

            <li>
              <a href="#" className="footer-link">
                Blog
              </a>
            </li>

            {/* <li>
              <a href="#" className="footer-link">
                Newsletter
              </a>
            </li> */}
          </ul>

          <div className="footer-list">
            <p className="footer-list-title">Subscribe Us</p>

            <form action="" className="newsletter-form">
              {/* <input type="email" name="email" placeholder="info@yourmail.com" required className="newsletter-input"> */}
              <input
                type="email"
                className="newsletter-input"
                placeholder="info@yourmail.com"
                required
              />

              <button
                type="submit"
                className="newsletter-btn"
                aria-label="Submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; 2023{" "}
            <a href="#" className="copyright-link">
              codewithusman
            </a>
            . All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
