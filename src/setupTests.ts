import "@testing-library/jest-dom";

// jsdom does not implement these, but the calendar calls scrollIntoView() on
// mount, so component tests need the shims.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = jest.fn();
}
