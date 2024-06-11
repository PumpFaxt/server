import { hashMessage, recoverAddress } from "ethers";

export function verifySignature(message: string, signature: string) {
  if (!signature.match(/^0x/)) {
    signature = "0x" + signature;
  }
  const recovered = recoverAddress(hashMessage(message), signature);

  return recovered;
}
