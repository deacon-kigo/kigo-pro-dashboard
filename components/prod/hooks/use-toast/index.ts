import * as React from "react";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 1000;

type Action =
  | {
      toast: Partial<Toast>;
      type: "UPDATE_TOAST";
    }
  | {
      toast: Toast;
      type: "ADD_TOAST";
    }
  | {
      toastId: string | undefined;
      type: "DISMISS_TOAST";
    }
  | {
      toastId: string | undefined;
      type: "REMOVE_TOAST";
    };

interface State {
  toasts: Toast[];
}

interface Toast {
  action?: React.ReactElement;
  description?: string;
  duration?: number;
  id: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title?: string;
  variant?: "default" | "destructive" | "success" | "warning";
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      toastId,
      type: "REMOVE_TOAST",
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST": {
      const toBeClosed = state.toasts.slice(0, -TOAST_LIMIT).map((toast) => ({
        ...toast,
        open: false,
      }));
      const remaining = [...state.toasts, action.toast].slice(-TOAST_LIMIT);

      return {
        toasts: [...toBeClosed, ...remaining],
      };
    }

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined
            ? {
                ...toast,
                open: false,
              }
            : toast
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          toasts: [],
        };
      }

      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };

    case "UPDATE_TOAST":
      return {
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast
        ),
      };
  }
};

const listeners: ((state: State) => void)[] = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

const removeAllToasts = () =>
  dispatch({ toastId: undefined, type: "REMOVE_TOAST" });

function toast({ duration = 5000, ...props }: Omit<Toast, "id">) {
  const id = Math.random().toString(36).substring(2, 9);

  const update = (props: Partial<Toast>) =>
    dispatch({
      toast: { ...props, duration, id },
      type: "UPDATE_TOAST",
    });

  const dismiss = () => dispatch({ toastId: id, type: "DISMISS_TOAST" });

  dispatch({
    toast: {
      duration,
      ...props,
      id,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
      open: true,
    },
    type: "ADD_TOAST",
  });

  return {
    dismiss,
    id,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);

    return () => {
      const index = listeners.indexOf(setState);

      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    dismiss: (toastId?: string) => dispatch({ toastId, type: "DISMISS_TOAST" }),
    removeAllToasts,
    toast,
  };
}

export { removeAllToasts, toast, type Toast, useToast };
