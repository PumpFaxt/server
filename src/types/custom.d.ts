import "node";

interface User {
  address: string;
  nickname: string;
  image: string;
  lastTokensBlock: number;
}

interface Token {
  address: string;
  creator: string;
  createdBlock: string;
  name: string;
  symbol: string;
  totalSupply: number;
  description: string;
  image: string;
  website: string;
  telegram: string;
  twitter: string;
  roomId?: string;
  replies: string[];
}

interface Config {
  tokensLastBlock: bigint;
  startBlock: bigint;
}
