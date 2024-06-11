import "node";

interface User {
  address: string;
}

interface Token {
  address: string;
  creator: string;
  creator_nickname?: string;
  name: string;
  symbol: string;
  image: string;
  website: string;
  telegram: string;
  twitter: string;
}
