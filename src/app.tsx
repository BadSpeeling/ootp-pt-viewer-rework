import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);
root.render(<h2>Hello from React!</h2>);

(async () => {
    console.log(await window.electronAPI.get())
})()