If your Vite project is using Tailwind CSS v3 with the PostCSS setup and you'd like to migrate to the official Tailwind CSS v4 approach using the `@tailwindcss/vite` plugin, here's how to clean up the old configuration and set up the new one properly.([Tailwind CSS][1])

---

## 🧹 Step 1: Remove Old Tailwind v3/PostCSS Setup

1. **Uninstall old dependencies:**

   ```bash
   npm uninstall tailwindcss postcss autoprefixer
   ```



2. **Delete old configuration files:**

   ```bash
   rm tailwind.config.js postcss.config.js
   ```



3. **Clean up old CSS directives:**

   * Open your CSS file (e.g., `src/index.css`) and remove the old Tailwind directives:

     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

   * If you had custom styles, back them up before deleting.

4. **Remove Tailwind imports in JavaScript/TypeScript files:**

   * Check files like `main.js` or `main.tsx` and remove any imports related to the old Tailwind CSS setup.

---

## ✅ Step 2: Install Tailwind CSS v4 with the Vite Plugin

1. **Install the new dependencies:**

   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```



2. **Configure Vite to use the Tailwind plugin:**

   * Edit your `vite.config.js` or `vite.config.ts` file:

     ```js
     import { defineConfig } from 'vite';
     import tailwindcss from '@tailwindcss/vite';

     export default defineConfig({
       plugins: [tailwindcss()],
     });
     ```

3. **Create a new CSS file for Tailwind:**

   * Create a file like `src/index.css` and add the Tailwind import:

     ```css
     @import "tailwindcss";
     ```

4. **Import the new CSS file in your application:**

   * In your main JavaScript or TypeScript file (e.g., `main.js` or `main.tsx`), add:

     ```js
     import './index.css';
     ```

---

## 🧪 Step 3: Test the Setup

1. **Start the development server:**

   ```bash
   npm run dev
   ```



2. **Add a test element to verify Tailwind is working:**

   * In your main component (e.g., `App.jsx` or `App.vue`), add:

     ```jsx
     <h1 className="text-3xl font-bold underline text-blue-600">
       Hello Tailwind v4!
     </h1>
     ```

   * Ensure that the styles are applied correctly in the browser.([Tailwind CSS][2])

---

## 🛠️ Optional: Customize Tailwind (If Needed)

With Tailwind CSS v4, you can configure your design tokens directly in your CSS using the `@theme` directive. For example:([Tailwind CSS][1])

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.7 0.2 200);
  --spacing: 0.25rem;
}
```



This approach eliminates the need for a separate `tailwind.config.js` file, streamlining your configuration process.

---

For more details and advanced configurations, refer to the official Tailwind CSS documentation:

* [Tailwind CSS Installation with Vite](https://tailwindcss.com/docs/installation/using-vite)

* [Tailwind CSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

[1]: https://tailwindcss.com/blog/tailwindcss-v4?utm_source=chatgpt.com "Tailwind CSS v4.0"
