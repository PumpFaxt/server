import { hashMessage, recoverAddress } from "ethers";

export function verifySignature(message: string, signature: string) {
  if (!signature.match(/^0x/)) {
    signature = "0x" + signature;
  }
  const recovered = recoverAddress(hashMessage(message), signature);

  return recovered;
}

export function getAuthTokenFromHeader(req: any): string | false {
  const authHeader = (req.headers as any).authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return false;
  return token;
}
