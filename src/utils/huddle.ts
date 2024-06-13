import { AccessToken } from "@huddle01/server-sdk/auth";

export async function createToken(
  roomId: string,
  role: string,
  displayName: string
) {
  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE_API_KEY,
    roomId: roomId as string,
    role: role,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
    options: {
      metadata: {
        displayName,
      },
    },
  });

  const token = await accessToken.toJwt();

  return token;
}
