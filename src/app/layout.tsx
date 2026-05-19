import React from 'react'

// The (payload) route group layout renders the full <html>/<body> via Payload's RootLayout.
// This root layout just passes children through so there's no double html/body.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
