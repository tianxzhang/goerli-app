import { useMemo, useState } from "react";
import { SingleValue } from "react-select";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import contractInterface from "../contract-abi.json";
import SelectCount from "./SelectCount";

interface MintProps {
  countdownEnd: boolean;
}

const contractConfig = {
  addressOrName: "0x99701229936735D642433b4d73Dbb6cbb66A4422",
  contractInterface: contractInterface,
};

function Mint({ countdownEnd }: MintProps) {
  const [count, setCount] = useState<number>(1);
  const { isConnected } = useAccount();

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "mint",
    args: count,
  });

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(contractWriteConfig);

  const { data: txData, isSuccess: txSuccess } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const handleChange = (e: SingleValue<{ value: number; label: string }>) => {
    if (e?.value) {
      setCount(e.value);
    }
  };

  const btnEnable = useMemo(() => {
    if (!countdownEnd) {
      return false;
    }

    if (!mint || !isConnected) {
      return false;
    }

    return true;
  }, [countdownEnd, mint, isConnected]);

  const isMinted = txSuccess;

  return (
    <div className="flex flex-col items-center order-2 sm:order-1">
      <SelectCount handleChange={handleChange} />
      <button
        className={`w-80 hover:bg-[#44EEEE] active:bg-[#44EEEE] disabled:bg-gray-300 py-2 px-8 mb-4 rounded-lg text-xl font-bold ${
          isMintStarted || isMintLoading || isMinted
            ? "bg-[#44EEEE]"
            : "bg-[#AFEEEE]"
        }`}
        disabled={!btnEnable}
        onClick={() => mint?.()}
      >
        {isMintLoading && "Confirming in wallet"}
        {isMintStarted && !isMinted && "Minting..."}
        {!isMintLoading && isMintStarted && isMinted && "Minted!"}
        {!isMintLoading && !isMintStarted && !isMinted && "Mint"}
      </button>

      {!isConnected && (
        <p className="text-white text-sm">Connect your wallet to mint</p>
      )}

      {mintError && mintError.message && (
        <div className="w-80 max-h-40 overflow-scroll">
          <p className="text-center text-red-400 my-2 break-words">
            {mintError.message}
          </p>
        </div>
      )}

      {isMinted && (
        <a
          href={`https://goerli.etherscan.io//tx/${mintData?.hash}`}
          className="text-[#AFEEEE] hover:text-[hotpink]"
          target="_blank"
          rel="noreferrer"
        >
          View transaction
        </a>
      )}
    </div>
  );
}

export default Mint;
