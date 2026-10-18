import { eveChannel } from "eve/channels/eve";
import { isAuthenticated } from '../lib/office-auth.mjs';

export default eveChannel({
  // Single-owner app: every session, stream and cancel route checks this cookie.
  auth: async (request: Request) => isAuthenticated(request) ? {
    authenticator: 'igor-office-cookie',
    principalId: 'igor-office-owner',
    principalType: 'user' as const,
    attributes: {},
  } : null,
});
