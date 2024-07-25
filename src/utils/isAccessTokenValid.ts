import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function isAccessTokenValid(
  client: CognitoIdentityProviderClient,
  token: string
) {
  const input = {
    AccessToken: token,
  };
  try {
    const response = await client.send(new GetUserCommand(input));
    return response.Username;
  } catch (e) {
    return false;
  }
}
