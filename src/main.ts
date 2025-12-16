import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import Toast, { type ToastOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './styles/tokens.css'
import App from './App.vue'
import { router } from './router.ts'
import bgImageUrl from '@/assets/MISArcadeBG.png'

// Preload background image to avoid blocking content rendering
function preloadBackgroundImage() {
  const img = new Image()
  img.onload = () => {
    document.body.classList.add('loaded')
  }
  img.onerror = () => {
    // If image fails to load, still add loaded class to prevent indefinite waiting
    document.body.classList.add('loaded')
  }
  img.src = bgImageUrl
}

preloadBackgroundImage()

const app = createApp(App)

const toastOptions: ToastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  toastClassName: 'custom-toast',
  bodyClassName: 'custom-toast-body'
}

app.use(MotionPlugin)
app.use(Toast, toastOptions)
app.use(router)

// Global error handler to prevent blank screens
window.addEventListener('error', () => {})

window.addEventListener('unhandledrejection', () => {})

router.isReady().then(() => {
  app.mount('#app')
}).catch(() => {
  // Mount anyway to prevent blank screen
  app.mount('#app')
})

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use a relative path so the service worker registers under the correct scope
    const swUrl = new URL('sw.js', import.meta.env.BASE_URL).toString()
    
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              }
            })
          }
        })
      })
      .catch(() => {})
  })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Reload the page to get the latest version
    window.location.reload()
  })
}


