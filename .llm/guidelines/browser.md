### FrontendAPIHints :frontend_api_hints:

When you are working with browser components like MediaRecorder e.t.c, you need to follow those rules:

1. When you are implementing stop for MediaRecorder, you have to stop all tracks:
```
mediaRecorder.stream.getTracks().forEach(track => track.stop());
```