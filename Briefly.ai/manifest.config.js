import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'Briefly.ai',
  version: '1.0.0',
  description: 'A lite weight AI based text summerizer for brief summeri',
  icons: {
    "48": "logo.png",
    "128": "logo.png"
  },
  side_panel: {
    "default_path": "index.html"
  },
  // These permissions are now FORCED and won't be stripped
  permissions: [
    "sidePanel",
    "scripting",
    "activeTab"
  ],
  host_permissions: [
    "https://*/*",
    "http://localhost:11434/*"
  ],
  background: {
    "service_worker": "src/background.js", // Ensure this path is correct
    "type": "module"
  }
})