export const timelineMock = [
  {
    id: 'entry-1',
    integration: 'Bluesky',
    status: 'valid',
    firstSeen: '2026-04-01 09:00 UTC',
    lastValid: '2026-04-12 08:00 UTC',
    brokenAt: null,
    txtRecord: 'did=plc:example123',
  },
  {
    id: 'entry-2',
    integration: 'Keybase',
    status: 'broken',
    firstSeen: '2026-03-10 11:00 UTC',
    lastValid: '2026-04-08 11:00 UTC',
    brokenAt: '2026-04-09 11:00 UTC',
    txtRecord: 'keybase-site-verification=abcxyz',
  },
  {
    id: 'entry-3',
    integration: 'GitHub Organization',
    status: 'valid',
    firstSeen: '2026-04-03 15:00 UTC',
    lastValid: '2026-04-12 08:00 UTC',
    brokenAt: null,
    txtRecord: '_gh-my-org-o.domain.com -> TXT present',
  },
]
