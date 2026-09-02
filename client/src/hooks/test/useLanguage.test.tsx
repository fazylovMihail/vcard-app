import { combineReducers, configureStore } from "@reduxjs/toolkit";
import languageReducer from "@/store/features/languageSlice";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react";
import useLanguage from "../useLanguage";

describe("useLanguage: Custom hook", () => {
  let store: ReturnType<typeof createTestStore>;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  const createTestStore = () => {
    const rootReducer = combineReducers({
      language: languageReducer,
    });

    return configureStore({
      reducer: rootReducer,
      preloadedState: {
        language: {
          lng: "ru",
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

  it("must return ru on the first launch", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe("ru");
  });

  it("must change the language", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.onToogleLanguage();
    });

    expect(result.current.language).toBe("en");

    act(() => {
      result.current.onToogleLanguage();
    });

    expect(result.current.language).toBe("ru");
  });
});
