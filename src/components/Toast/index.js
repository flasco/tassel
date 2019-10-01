import React from 'react';
import RootView from './root-view';
import ToastView, { LONG } from './toast-view';

class Toast {
  static show(msg) {
    RootView.setView(
      <ToastView
        message={msg}
        onDismiss={() => {
          RootView.setView();
        }}
      />
    );
  }

  static showLong(msg) {
    RootView.setView(
      <ToastView
        message={msg}
        time={LONG}
        onDismiss={() => {
          RootView.setView();
        }}
      />
    );
  }
}

export default Toast;
