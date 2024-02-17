import type { ReactNode, IframeHTMLAttributes } from 'react';
import { useState, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface ReactIframeProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  children: ReactNode;
  title: string;
}

export const ReactIframe = ({
  children,
  title,
  ...props
}: ReactIframeProps) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const iframeDoc = contentRef?.contentWindow?.document;

  useLayoutEffect(() => {
    if (iframeDoc) {
      // Clone and append all style elements from parent head to iframe head
      document.head.querySelectorAll('style').forEach((style) => {
        const frameStyles = style.cloneNode(true);
        iframeDoc.head.appendChild(frameStyles);
      });

      // Clone and append all meta elements from parent head to iframe head
      document.head.querySelectorAll('meta').forEach((meta) => {
        const frameMeta = meta.cloneNode(true);
        iframeDoc.head.appendChild(frameMeta);
      });

      document.head
        .querySelectorAll('link[rel="stylesheet"]')
        .forEach((stylesheet) => {
          const frameStylesheet = stylesheet.cloneNode(true);
          iframeDoc.head.appendChild(frameStylesheet);
        });

      // Inject Tailwind CSS script into iframe head
      const tailwindScript = document.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com';
      iframeDoc.head.appendChild(tailwindScript);

      // Add overflow hidden class to iframe body
      iframeDoc.body.classList.add('overflow-hidden');
    }
  }, [iframeDoc]);

  const mountRef = useCallback((node: HTMLIFrameElement | null) => {
    setContentRef(node);
  }, []);

  return (
    <iframe title={title} id="canvas-iframe" {...props} ref={mountRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
