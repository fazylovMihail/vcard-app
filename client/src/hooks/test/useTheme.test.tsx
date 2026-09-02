import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/store/features/themeSlice";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react";
import useTheme from "../useTheme";

describe("useTheme: Custom hook", () => {
  let store: ReturnType<typeof createTestStore>;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  const createTestStore = () => {
    const rootReducer = combineReducers({
      theme: themeReducer,
    });

    return configureStore({
      reducer: rootReducer,
      preloadedState: {
        theme: {
          mode: "light",
        },
      },
    });
  };

  beforeEach(() => {
    document.body.className = "";
    localStorage.clear();

    store = createTestStore();
    wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  });

  it("should initialize with light theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current[0]).toBe("light");
    expect(document.body.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("should toggle theme, update DOM and localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe("dark");
    expect(document.body.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe("light");
    expect(document.body.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
