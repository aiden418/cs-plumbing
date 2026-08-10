declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
    oaiq: (...args: any[]) => void;
  }
}

export {};
