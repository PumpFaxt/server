// import { hashMessage, recoverAddress } from "viem";

// export function verifySignature(message: string, signature: string) {
//   if (!signature.match(/^0x/)) {
//     signature = "0x" + signature;
//   }
//   const recovered = recoverAddress({hash :hashMessage(message), signature});

//   return recovered;
// }

export function getAuthTokenFromHeader(req: any): string | false {
  const authHeader = (req.headers as any).authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return false;
  return token;
}

export function generateRandomHex(length: number): string {
  const characters = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function isFunction(obj: any) {
  return typeof obj === "function";
}
