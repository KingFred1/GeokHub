'use client';

import { useEffect } from 'react';

export function CodeScript() {
  useEffect(() => {
    let isInitialized = false;
    let prismLoaded = false;

    const initCodeBlocks = () => {
      const codeBlocks = document.querySelectorAll('pre');
      if (codeBlocks.length === 0) return;

      // Only load Prism once
      const loadPrism = prismLoaded 
        ? Promise.resolve()
        : Promise.all([
            import('prismjs'),
            import('prismjs/components/prism-javascript'),
            import('prismjs/components/prism-typescript'),
            import('prismjs/components/prism-jsx'),
            import('prismjs/components/prism-tsx'),
            import('prismjs/components/prism-python'),
            import('prismjs/components/prism-css'),
            import('prismjs/components/prism-bash'),
            import('prismjs/components/prism-json')
          ]).then(([Prism]) => {
            window.Prism = Prism.default;
            prismLoaded = true;
          });

      loadPrism.then(() => {
        // Remove old copy buttons but be more selective
        document.querySelectorAll('.copy-btn').forEach(btn => {
          // Only remove if it's not in a currently visible pre element
          if (!btn.closest('pre')?.isConnected) {
            btn.remove();
          }
        });
        
        // Highlight all code blocks
        window.Prism.highlightAll();
        
        // Add copy buttons only to pre elements that don't have them
        codeBlocks.forEach((pre) => {
          // Skip if already has a copy button
          if (pre.querySelector('.copy-btn')) return;
          
          const code = pre.querySelector('code');
          if (!code) return;

          const btn = document.createElement('button');
          btn.className = 'copy-btn';
          btn.textContent = 'Copy';
          
          btn.onclick = async () => {
            const text = code.textContent || '';
            try {
              await navigator.clipboard.writeText(text);
              btn.textContent = 'Copied!';
              setTimeout(() => btn.textContent = 'Copy', 2000);
            } catch {
              btn.textContent = 'Failed';
              setTimeout(() => btn.textContent = 'Copy', 2000);
            }
          };
          
          pre.appendChild(btn);
        });
      });
    };

    // Initial load with retry mechanism
    const initialLoad = () => {
      if (!isInitialized) {
        const timer = setTimeout(() => {
          initCodeBlocks();
          isInitialized = true;
        }, 150);
        return timer;
      }
      return null;
    };

    const timer = initialLoad();

    // More reliable content expansion handler
    const handleContentExpanded = () => {
      console.log('Content expanded - enhancing code blocks');
      // Wait a bit longer for React to finish rendering
      setTimeout(() => {
        initCodeBlocks();
      }, 500);
    };

    // Also listen for any DOM changes that might indicate new content
    const observer = new MutationObserver((mutations) => {
      let shouldRefresh = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if new pre elements were added or if content changed significantly
              if (element.querySelector('pre') || element.tagName === 'PRE') {
                shouldRefresh = true;
              }
            }
          });
        }
      });

      if (shouldRefresh) {
        setTimeout(initCodeBlocks, 300);
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });

    // Multiple event listeners for content expansion
    window.addEventListener('contentExpanded', handleContentExpanded);

    // Periodic check as ultimate fallback (less frequent)
    const interval = setInterval(() => {
      const codeBlocksWithoutButtons = document.querySelectorAll('pre:not(:has(.copy-btn))');
      if (codeBlocksWithoutButtons.length > 0) {
        console.log('Found code blocks without buttons, enhancing...');
        initCodeBlocks();
      }
    }, 2000);

    return () => {
      if (timer) clearTimeout(timer);
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener('contentExpanded', handleContentExpanded);
    };
  }, []);

  return null;
}