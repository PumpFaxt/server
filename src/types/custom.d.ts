import "node";

interface User {
  address: string;
  nickname: string;
  image: string;
  queue: Partial<Token>[];
  lastTokensBlock: number;
}

interface Token {
  address: string;
  creator: string;
  name: string;
  symbol: string;
  totalSupply: number;
  description: string;
  image: string;
  website: string;
  telegram: string;
  twitter: string;
}

interface PriceFeed {
  address: string;
  lastRefreshedBlock: bigint;
  data: Array<{ price: bigint; timestamp: bigint; marketCap: bigint }>;
}

interface Config {
  tokensLastBlock: bigint;
}
