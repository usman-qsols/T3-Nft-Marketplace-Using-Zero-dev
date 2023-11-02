import dynamic from "next/dynamic";

const LoginPage = dynamic(() => import("../components/login/login"), {
  ssr: false,
});

export default function UserProfile() {
  //   let isUser = JSON.parse(localStorage.getItem("user"));
  return <LoginPage />;
}
