"use client";

import { useEffect, useState } from "react";
import { VercelToolbar } from "@vercel/toolbar/next";

const KEY = "kigo-review-toolbar";

/* Production visitors who are not on the Vercel team get a login prompt from
   the toolbar, so reviewers opt in with ?comments=on (and out with
   ?comments=off). Framed copies on the review canvas never mount it. */
const wantsToolbar = () => {
  if (window.top !== window.self) return false;
  const param = new URLSearchParams(window.location.search).get("comments");
  try {
    if (param === "on") localStorage.setItem(KEY, "on");
    if (param === "off") localStorage.removeItem(KEY);
    return localStorage.getItem(KEY) === "on";
  } catch {
    return param === "on";
  }
};

export function ReviewToolbar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(process.env.NODE_ENV === "development" || wantsToolbar());
  }, []);

  return show ? <VercelToolbar /> : null;
}
