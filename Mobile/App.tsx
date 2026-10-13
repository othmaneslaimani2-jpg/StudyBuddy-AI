/**
 * Migrated to Expo Router File-Based Routing.
 *
 * The root navigation and layout are now managed under `src/app/`:
 * - Root layout: `src/app/_layout.tsx`
 * - Auth group: `src/app/(auth)/_layout.tsx`, `login.tsx`, `register.tsx`
 * - Authenticated stack: `src/app/(app)/_layout.tsx`
 *   - Bottom tabs: `src/app/(app)/(tabs)/_layout.tsx` (`index`, `tasks`, `notes`, `profile`)
 *   - Modals/Screens: `upload-note.tsx`, `add-task.tsx`, `ai-chat.tsx`
 *
 * The entry point is configured in `package.json` as `"main": "expo-router/entry"`.
 */
export { default } from './src/app/_layout';