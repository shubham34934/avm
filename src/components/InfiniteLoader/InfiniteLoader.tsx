import React, { useEffect, useRef, useCallback, useState } from "react";
import PropTypes from "prop-types";

const InfiniteLoader = ({
  children,
  onLoadMore,
  hasMore = true,
  isLoading,
  threshold = 0.1,
  loader = null,
  disabled = true, // New prop to disable infinite loading
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // If disabled, do not proceed with loading
      if (disabled) return;

      console.log("Intersection Observer entries:", entries);

      entries.forEach((entry) => {
        console.log("Entry details:", {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          hasMore,
          isLoading,
          disabled,
        });

        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= threshold &&
          !isLoading // Only trigger if not currently loading
        ) {
          console.log("Triggering onLoadMore");
          onLoadMore();
        }
      });
    },
    [hasMore, isLoading, onLoadMore, threshold, disabled]
  );

  useEffect(() => {
    // Ensure previous observer is disconnected
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Only create observer if not disabled
    if (!disabled) {
      // Create new observer with detailed options
      observerRef.current = new IntersectionObserver(handleObserver, {
        root: null, // viewport
        rootMargin: "0px", // no margin
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], // multiple thresholds for better tracking
      });

      // Observe the loader element if it exists
      if (loaderRef.current) {
        console.log("Starting to observe loader element");
        observerRef.current.observe(loaderRef.current);
      }
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, disabled]);

  // Debug render to ensure loader is present
  useEffect(() => {
    if (loaderRef.current) {
      console.log("Loader element exists:", loaderRef.current);

      // Additional visibility check
      const checkVisibility = () => {
        if (loaderRef.current) {
          const rect = loaderRef.current.getBoundingClientRect();
          const isVisible =
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
              (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
              (window.innerWidth || document.documentElement.clientWidth);

          console.log("Loader visibility check:", {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            isVisible,
          });

          setIsVisible(isVisible);
        }
      };

      // Check visibility on mount and scroll
      checkVisibility();
      window.addEventListener("scroll", checkVisibility);

      return () => {
        window.removeEventListener("scroll", checkVisibility);
      };
    }
  }, []);

  return (
    <>
      {children}
      {hasMore && (
        <div
          ref={loaderRef}
          style={{
            height: "50px",
            textAlign: "center",
            width: "100%",
            position: "relative",
            bottom: 0,
            opacity: disabled ? 0.5 : 1, // Visual indication of disabled state
          }}
        >
          {isLoading ? (
            loader || "Loading more..."
          ) : (
            <div>
              {disabled ? (
                <div
                  style={{
                    color: "#6c757d", // Muted text color
                    fontStyle: "italic",
                  }}
                >
                  Infinite loading is disabled
                </div>
              ) : (
                <div>{hasMore ? "Scroll to load more" : "No more items"}</div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

InfiniteLoader.propTypes = {
  children: PropTypes.node.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  threshold: PropTypes.number,
  loader: PropTypes.node,
  disabled: PropTypes.bool, // New prop type
};

export default InfiniteLoader;
