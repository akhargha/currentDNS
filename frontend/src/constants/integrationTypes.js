export const integrationTypes = [
  {
    id: 'bluesky',
    name: 'Bluesky',
    description: 'Detect DID proof in a TXT record for Bluesky domain verification.',
    lookupHost: '_atproto.domain.com',
    matchPattern: 'did=...',
  },
  {
    id: 'keybase',
    name: 'Keybase',
    description: 'Detect keybase-site-verification proof in apex domain TXT records.',
    lookupHost: 'domain.com (TXT records)',
    matchPattern: 'keybase-site-verification=...',
  },
  {
    id: 'github-org',
    name: 'GitHub Organization',
    description: 'Detect organization DNS proof under the GitHub host naming pattern.',
    lookupHost: '_gh-<organizationname>-o.domain.com',
    matchPattern: 'TXT record exists',
  },
]
