import React from 'react';
import RootView from './RootView';
import ToastView, { LONG } from './ToastView';

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
