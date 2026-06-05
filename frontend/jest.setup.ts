import "@testing-library/jest-dom";

jest.mock("@/src/env", () => ({
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
    NEXT_PUBLIC_NODE_ENV: "test",
  },
}));

if (typeof window.PointerEvent === "undefined") {
  class PointerEvent extends MouseEvent {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
    }
  }
  window.PointerEvent = PointerEvent as typeof window.PointerEvent;
}
