import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState("");
  const [numPlayers, setNumPlayers] = useState("");
  const [recentWinner, setRecentWinner] = useState("");

  const { isWeb3Enabled } = useMoralis();

  const dispatch = useNotification();

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "success",
      message: "Transaction Complete",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const updateUI = async () => {
    const entranceFeeFromCall = await getEntranceFee();
    const numPlayersFromCall = await getNumberOfPlayers();
    const recentWinnerFromCall = await getRecentWinner();

    setEntranceFee(entranceFeeFromCall.toString());
    setNumPlayers(numPlayersFromCall.toString());
    setRecentWinner(recentWinnerFromCall.toString());
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }

    // Listen to the RaffleEventWinner event
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const raffleContract = new ethers.Contract(raffleAddress, abi, provider);

    // // Listen for the RaffleEventWinner
    // raffleContract.once("WinnerPicked", (winner) => {
    //   console.log(`New Winner: ${winner}`);
    //   setRecentWinner(winner);
    // });

    // return () => {
    //   raffleContract.removeAllListeners("WinnerPicked");
    // };
  }, [isWeb3Enabled]);

  const formattedEntranceFee =
    entranceFee && entranceFee !== "0"
      ? ethers.utils.formatUnits(entranceFee, 18)
      : "Loading...";

  return (
    <div>
      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}>
            Enter Raffle
          </button>
          <p> Entrance Fee: {formattedEntranceFee} ETH</p>
          <p> Players {numPlayers}</p>
          <p> Recent Winner: {recentWinner}</p>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
}
