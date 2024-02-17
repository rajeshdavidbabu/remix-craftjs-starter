import { getHintUtils } from "@epic-web/client-hints";
import {
  clientHint as colorSchemeHint,
  subscribeToSchemeChange,
} from "@epic-web/client-hints/color-scheme";
import { useRevalidator, useRouteLoaderData } from "@remix-run/react";
import * as React from "react";
import type { loader as rootLoader } from "~/root";
import type { SerializeFrom } from "@remix-run/node";
import { useOptimisticTheme } from "~/routes/resources.theme-toggle";

const hintsUtils = getHintUtils({
  theme: colorSchemeHint,
});

export const { getHints } = hintsUtils;

// Remix theme utils below
export function useRequestInfo() {
  const data = useRouteLoaderData("root") as SerializeFrom<typeof rootLoader>;
  return data.requestInfo;
}

export function useHints() {
  const requestInfo = useRequestInfo();
  return requestInfo.hints;
}

export function ClientHintCheck({ nonce }: { nonce: string }) {
  const { revalidate } = useRevalidator();
  React.useEffect(
    () => subscribeToSchemeChange(() => revalidate()),
    [revalidate]
  );

  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
    />
  );
}

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticTheme = useOptimisticTheme();
  if (optimisticTheme) {
    return optimisticTheme === "system" ? hints.theme : optimisticTheme;
  }
  return requestInfo.userPrefs.theme ?? hints.theme;
}

// Use nonce for the script tag
const NonceContext = React.createContext<string>("");
export const useNonce = () => React.useContext(NonceContext);
