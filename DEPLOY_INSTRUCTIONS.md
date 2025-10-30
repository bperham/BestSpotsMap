# BestSpotsMap — Build & Deploy (Firebase App Hosting + Next.js 15)

## Prereqs
- Node.js 20.x
- Firebase CLI (latest):
  npm i -g firebase-tools@latest
  firebase login

## One-time
firebase use YOUR_PROJECT_ID

## Deploy (App Hosting)
firebase deploy --only hosting

## If you see legacy "webframeworks" error
firebase experiments:enable webframeworks
firebase deploy --only hosting