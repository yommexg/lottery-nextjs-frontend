import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="p-5 border-2 flex flex-row">
      <h1> Anime Lottery</h1> <ConnectButton moralisAuth={false} />
    </div>
  );
}
