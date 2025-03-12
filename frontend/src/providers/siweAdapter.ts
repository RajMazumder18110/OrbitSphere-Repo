/** @notice library imports */
import { createSiweMessage } from "viem/siwe";
import { SiweMessage, generateNonce } from "siwe";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { removeAuthCookie, setCookieOnAuth } from "@/actions/authentication";

export const siweAuthenticationAdapter = createAuthenticationAdapter({
  /// Nonce
  getNonce: async () => generateNonce(),

  /// Message
  createMessage: ({ nonce, address, chainId }) => {
    return createSiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with OrbitSphere",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },

  verify: async ({ message, signature }) => {
    try {
      const siweObject = new SiweMessage(message);
      const {
        data: { address, nonce },
      } = await siweObject.verify({ signature });
      console.log({ address, nonce });

      /// Add cookies
      await setCookieOnAuth({ address, nonce });
      return true;
    } catch (error) {
      return false;
    }
  },

  signOut: async () => {
    // remove cookie
    await removeAuthCookie();
  },
});
