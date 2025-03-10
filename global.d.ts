export {};

declare global {
  interface Window {
    Razorpay?: any;
    initSendOTP?: any;
    sendOtp?: any;
    verifyOtp?: any;
    retryOtp?: any;
    getWidgetData?: any;
    isCaptchaVerified?: any;
  }
}
