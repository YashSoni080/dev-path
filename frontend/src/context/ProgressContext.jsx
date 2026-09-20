import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";
import { useToast } from "./ToastContext.jsx";

const ProgressContext = createContext(null);
const LOCAL_STORAGE_KEY = "devpath_guest_progress";

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const { success, info } = useToast();
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Sync / Load when user logs in or out
  useEffect(() => {
    if (user) {
      // Sync any guest progress first
      const guestProgress = (() => {
        try {
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      })();

      if (guestProgress.length > 0) {
        api
          .post("/progress/sync", { topicIds: guestProgress })
          .then(({ data }) => {
            setCompletedTopics(data.completedTopics || []);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          })
          .catch(() => {
            // Fallback to fetching user's existing progress
            api
              .get("/progress")
              .then(({ data }) => setCompletedTopics(data.completedTopics || []))
              .catch(() => {});
          });
      } else {
        api
          .get("/progress")
          .then(({ data }) => setCompletedTopics(data.completedTopics || []))
          .catch(() => {});
      }
    } else {
      // Guest mode: load from localStorage
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        setCompletedTopics(saved ? JSON.parse(saved) : []);
      } catch {
        setCompletedTopics([]);
      }
    }
  }, [user]);

  const isCompleted = useCallback(
    (topicId) => {
      if (!topicId) return false;
      const tid = topicId.toString();
      return completedTopics.some((id) => id.toString() === tid);
    },
    [completedTopics]
  );

  const toggleCompleted = useCallback(
    async (topicId, topicTitle = "Waypoint") => {
      if (!topicId) return;
      const tid = topicId.toString();
      const willBeCompleted = !completedTopics.includes(tid);

      // Optimistic update
      setCompletedTopics((prev) =>
        willBeCompleted ? [...prev, tid] : prev.filter((id) => id !== tid)
      );

      if (willBeCompleted) {
        success(`Marked "${topicTitle}" as completed! 🎯`);
      } else {
        info(`Marked "${topicTitle}" as pending.`);
      }

      if (user) {
        try {
          const { data } = await api.post("/progress/toggle", { topicId: tid });
          setCompletedTopics(data.completedTopics || []);
        } catch (err) {
          // Revert on error
          setCompletedTopics((prev) =>
            willBeCompleted ? prev.filter((id) => id !== tid) : [...prev, tid]
          );
        }
      } else {
        // Guest mode: persist to localStorage
        try {
          const updated = willBeCompleted
            ? [...completedTopics, tid]
            : completedTopics.filter((id) => id !== tid);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // storage error ignore
        }
      }
    },
    [completedTopics, user, success, info]
  );

  const getDomainProgress = useCallback(
    (topics = []) => {
      if (!topics || topics.length === 0) {
        return { completedCount: 0, totalCount: 0, percentage: 0 };
      }
      const totalCount = topics.length;
      const completedCount = topics.filter((t) => isCompleted(t._id)).length;
      const percentage = Math.round((completedCount / totalCount) * 100);
      return { completedCount, totalCount, percentage };
    },
    [isCompleted]
  );

  return (
    <ProgressContext.Provider
      value={{
        completedTopics,
        isCompleted,
        toggleCompleted,
        getDomainProgress,
        loading,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
