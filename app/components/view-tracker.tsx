"use client";

import { useEffect, useRef } from "react";

/**
 * Client component that tracks views for businesses displayed on the catalog page.
 * Sends a single batch request with all unique businessIds on mount.
 */
export default function ViewTracker({
  businessIds,
}: {
  businessIds: string[];
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || businessIds.length === 0) return;
    tracked.current = true;

    // Deduplicate business IDs
    const uniqueIds = [...new Set(businessIds)];

    fetch("/api/catalog/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessIds: uniqueIds }),
    }).catch(() => {
      // Silently ignore tracking failures
    });
  }, [businessIds]);

  return null;
}
