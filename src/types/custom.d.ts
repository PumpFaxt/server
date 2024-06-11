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
  description: string;
  image: string;
  website: string;
  telegram: string;
  twitter: string;
}
