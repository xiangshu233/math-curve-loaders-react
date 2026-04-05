"use client";

import { Highlight, themes, type PrismTheme } from "prism-react-renderer";

type StandaloneReactCodeBlockProps = {
  code: string;
};

/**
 * VS Code–style token colors on the same near-black as the rest of the UI (#050505),
 * instead of night-owl’s blue panel.
 */
const loaderCodeTheme: PrismTheme = {
  ...themes.vsDark,
  plain: {
    ...themes.vsDark.plain,
    backgroundColor: "#050505",
    color: "#d4d4d4",
  },
};

/**
 * Client-side syntax highlight for TSX (prism-react-renderer, no async flash).
 * Parent should set overflow when used in a flex panel.
 */
export function StandaloneReactCodeBlock({ code }: StandaloneReactCodeBlockProps) {
  const trimmed = code.trimEnd();

  return (
    <Highlight theme={loaderCodeTheme} code={trimmed} language="tsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} m-0 overflow-x-auto p-4 text-[11px] leading-[1.55]`}
          style={{ ...style, margin: 0 }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
