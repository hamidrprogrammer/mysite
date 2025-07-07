// Import styles
import './styles/reset.css';
import './styles/radiance.css';

// TypeScript entry point
console.log("Vite + TypeScript project is running!");

// Logic from template will be added here or in other modules
// The existing HTML content is already in index.html,
// so we might not need to manipulate #app's innerHTML here unless for dynamic parts.
// For now, let's keep the console log and remove the default app content injection.

// Example of how you might re-attach event listeners or initialize JS components if needed:
// import { setupCounters } from './counter'; // Example if you extract JS to modules
// setupCounters(document.querySelector<HTMLButtonElement>('#counter')!);

// If your template's JS (bundle.min.js, inline_scripts.js) needs to run globally
// after the DOM is loaded, and after libraries are available,
// you might import their main functions here or ensure they are loaded correctly.
// This will be handled in the JavaScript migration step.
