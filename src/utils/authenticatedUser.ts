import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { isAccessTokenValid } from "@/utils/isAccessTokenValid";
import { cookies } from "next/headers";

export async function AuthenticatedUser() {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_COGNITO_REGION,
  });

  const cookieStore = cookies();
  const accessToken = cookieStore.get("AccessToken")?.value;

  if (accessToken) {
    const userId = await isAccessTokenValid(cognitoClient, accessToken);
    return userId;
  }
  return null;
}
