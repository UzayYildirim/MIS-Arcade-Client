<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div 
        v-if="isVisible" 
        class="modal-backdrop"
        @click="handleBackdropClick"
      >
        <div 
          class="modal-container"
          @click.stop
          v-motion
          :initial="{ 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            rotateX: -15
          }"
          :enter="{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateX: 0,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }
          }"
          :leave="{ 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            rotateX: -15,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 40
            }
          }"
        >
          <div class="modal-header">
            <div class="header-content">
              <div class="modal-icon">
                <span class="icon-emoji">👤</span>
                <div class="icon-glow"></div>
              </div>
              <div class="header-text">
                <h2 class="modal-title">Choose Your Guest Avatar</h2>
                <p class="modal-subtitle">Select an avatar for the arcade games.</p>
              </div>
            </div>
            <button 
              @click="closeModal" 
              class="close-button"
              v-motion
              :initial="{ scale: 0, rotate: -90 }"
              :enter="{ 
                scale: 1, 
                rotate: 0,
                transition: { delay: 200, type: 'spring', stiffness: 400 }
              }"
            >
              <span class="close-icon">✕</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="avatar-grid">
              <div 
                v-for="(avatar, index) in avatars" 
                :key="index"
                class="avatar-item"
                :class="{ selected: selectedAvatar === avatar.path }"
                @click="selectAvatar(avatar)"
                v-motion
                :initial="{ opacity: 0, scale: 0.8 }"
                :enter="{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 50, type: 'spring', stiffness: 300 }
                }"
              >
                <div class="avatar-image-wrapper">
                  <img 
                    :src="avatar.path" 
                    :alt="avatar.name"
                    class="avatar-image"
                    loading="lazy"
                  />
                </div>
                <div class="avatar-name">{{ avatar.name }}</div>
              </div>
            </div>
          </div>

          <div class="modal-border">
            <div class="border-line border-top"></div>
            <div class="border-line border-right"></div>
            <div class="border-line border-bottom"></div>
            <div class="border-line border-left"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Balloonboi from '../avatars/Balloonboi.png'
import Balloongurl from '../avatars/Balloongurl.png'
import Bitcoin from '../avatars/Bitcoin.png'
import DOGE from '../avatars/DOGE.png'
import DUCK from '../avatars/DUCK.png'
import Eyecate from '../avatars/Eyecate.png'
import Foxeye from '../avatars/Foxeye.png'
import Glam from '../avatars/Glam.png'
import Hana from '../avatars/Hana.png'
import Idol from '../avatars/Idol.png'
import Muffincat from '../avatars/Muffincat.png'
import Orangecat from '../avatars/Orangecat.png'
import PaperAnish from '../avatars/Paper Anish.png'
import Paperita from '../avatars/Paperita.png'
import Paperito from '../avatars/Paperito.png'
import Priya from '../avatars/Priya.png'
import Priyanshu from '../avatars/Priyanshu.png'
import Pugs from '../avatars/Pugs.png'
import RoboDough from '../avatars/RoboDough.png'
import RoboFloat from '../avatars/RoboFloat.png'
import Seth from '../avatars/Seth.png'
import Soulman from '../avatars/Soulman.png'

interface Props {
  isVisible: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'select', avatarPath: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const GUEST_AVATAR_KEY = 'arcadeGuestAvatar'

const avatars = [
  { name: 'Balloonboi', path: Balloonboi },
  { name: 'Balloongurl', path: Balloongurl },
  { name: 'Bitcoin', path: Bitcoin },
  { name: 'DOGE', path: DOGE },
  { name: 'DUCK', path: DUCK },
  { name: 'Eyecate', path: Eyecate },
  { name: 'Foxeye', path: Foxeye },
  { name: 'Glam', path: Glam },
  { name: 'Hana', path: Hana },
  { name: 'Idol', path: Idol },
  { name: 'Muffincat', path: Muffincat },
  { name: 'Orangecat', path: Orangecat },
  { name: 'Paper Anish', path: PaperAnish },
  { name: 'Paperita', path: Paperita },
  { name: 'Paperito', path: Paperito },
  { name: 'Priya', path: Priya },
  { name: 'Priyanshu', path: Priyanshu },
  { name: 'Pugs', path: Pugs },
  { name: 'RoboDough', path: RoboDough },
  { name: 'RoboFloat', path: RoboFloat },
  { name: 'Seth', path: Seth },
  { name: 'Soulman', path: Soulman },
]

const selectedAvatar = ref(localStorage.getItem(GUEST_AVATAR_KEY) || null)

const selectAvatar = (avatar: { name: string; path: string }) => {
  localStorage.setItem(GUEST_AVATAR_KEY, avatar.path)
  selectedAvatar.value = avatar.path
  emit('select', avatar.path)
  closeModal()
}

const closeModal = () => {
  emit('close')
}

const handleBackdropClick = () => {
  closeModal()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: var(--panel-bg);
  border: 2px solid var(--panel-border);
  border-radius: 20px;
  max-width: 95vw;
  max-height: 95vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 32px 32px 20px 32px;
  border-bottom: 1px solid var(--panel-border);
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.modal-icon {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--darker-bg);
  border: 2px solid var(--neon-cyan);
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.icon-emoji {
  font-size: 32px;
  z-index: 2;
  position: relative;
}

.icon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: rgba(0, 255, 255, 0.1);
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

.header-text {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-family: 'Orbitron', monospace;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0;
  font-family: 'Rajdhani', sans-serif;
}

.close-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--darker-bg);
  border: 2px solid var(--panel-border);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.close-button:hover {
  border-color: var(--neon-pink);
  color: var(--neon-pink);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
  transform: scale(1.1);
}

.close-icon {
  font-size: 20px;
  font-weight: 700;
}

.modal-body {
  padding: 32px;
  max-height: 60vh;
  overflow-y: auto;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 12px;
  border-radius: 12px;
  background: var(--darker-bg);
  border: 2px solid transparent;
}

.avatar-item:hover {
  transform: translateY(-4px);
  border-color: var(--neon-cyan);
  box-shadow: 0 8px 25px rgba(0, 255, 255, 0.3);
  background: rgba(0, 255, 255, 0.05);
}

.avatar-item.selected {
  border-color: var(--neon-green);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
  background: rgba(0, 255, 0, 0.1);
}

.avatar-image-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--panel-border);
  transition: all 0.3s ease;
}

.avatar-item:hover .avatar-image-wrapper {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
}

.avatar-item.selected .avatar-image-wrapper {
  border-color: var(--neon-green);
  box-shadow: 0 0 25px rgba(0, 255, 0, 0.5);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  text-transform: capitalize;
  transition: color 0.3s ease;
}

.avatar-item:hover .avatar-name {
  color: var(--neon-cyan);
}

.avatar-item.selected .avatar-name {
  color: var(--neon-green);
  font-weight: 700;
}

.modal-footer {
  padding: 20px 32px 32px 32px;
  border-top: 1px solid var(--panel-border);
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: 16px 32px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Rajdhani', sans-serif;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  min-width: 120px;
  background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
  color: var(--dark-bg);
  border: 2px solid var(--neon-cyan);
  box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 255, 255, 0.5);
}

.btn-text {
  font-weight: 700;
  letter-spacing: 0.05em;
}

.modal-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border-radius: 20px;
  overflow: hidden;
}

.border-line {
  position: absolute;
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink), var(--neon-green));
  animation: borderFlow 3s linear infinite;
}

.border-top {
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  transform: translateX(-100%);
  animation-delay: 0s;
}

.border-right {
  top: 0;
  right: 0;
  bottom: 0;
  width: 2px;
  transform: translateY(-100%);
  animation-delay: 0.75s;
  animation-name: borderFlowVertical;
}

.border-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  transform: translateX(100%);
  animation-delay: 1.5s;
  animation-name: borderFlowHorizontal;
}

.border-left {
  top: 0;
  left: 0;
  bottom: 0;
  width: 2px;
  transform: translateY(100%);
  animation-delay: 2.25s;
  animation-name: borderFlowVerticalReverse;
}

@keyframes borderFlow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes borderFlowVertical {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes borderFlowHorizontal {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

@keyframes borderFlowVerticalReverse {
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
}

.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 95vw;
    margin: 20px;
  }
  
  .modal-header {
    padding: 24px 24px 16px 24px;
  }
  
  .modal-body {
    padding: 24px;
  }
  
  .modal-footer {
    padding: 16px 24px 24px 24px;
  }
  
  .header-content {
    gap: 16px;
  }
  
  .modal-icon {
    width: 56px;
    height: 56px;
  }
  
  .icon-emoji {
    font-size: 28px;
  }
  
  .modal-title {
    font-size: 1.8rem;
  }
  
  .avatar-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 16px;
  }
  
  .avatar-image-wrapper {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .modal-container {
    max-width: 95vw;
    margin: 10px;
  }
  
  .modal-header {
    padding: 20px 20px 12px 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 12px 20px 20px 20px;
  }
  
  .modal-title {
    font-size: 1.6rem;
  }
  
  .avatar-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
  }
  
  .avatar-image-wrapper {
    width: 70px;
    height: 70px;
  }
  
  .avatar-name {
    font-size: 0.8rem;
  }
  
  .modal-icon {
    width: 48px;
    height: 48px;
  }
  
  .icon-emoji {
    font-size: 24px;
  }
}
</style>
