import Head from "next/head";
import ManualHeader from "../components/ManualHeader";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Anime Code Lord Raffle</title>
        <meta
          name="description"
          content="Our smart contract lottery"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      {/* <ManualHeader /> */}
      <Header />
      <LotteryEntrance />
    </div>
  );
}
