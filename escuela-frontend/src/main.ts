import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBars,
  faXmark,
  faHome,
  faClipboardCheck,
  faCalendarAlt,
  faUsers,
  faBook,
  faBell,
  faUser,
  faSignOutAlt,
  faClock,
  faCheck,
  faTimes,
  faFile,
  faCheckCircle,
  faSearch,
  faInfoCircle,
  faChevronDown,
  faLocationDot,
  faPhone,
  faDirections,
  faEnvelope,
  faLock
} from '@fortawesome/free-solid-svg-icons'

import {
  faFacebookSquare,
  faFacebook
} from '@fortawesome/free-brands-svg-icons'

import {
  faEnvelope as farEnvelope,
  faMap,
  faAddressBook,
  faBuilding,
  faEye,
  faEyeSlash,
  faUser as farUser
} from '@fortawesome/free-regular-svg-icons'

import App from './App.vue'
import router from './router'

// Add icons to the library
library.add(
  faBars,
  faXmark,
  faHome,
  faClipboardCheck,
  faCalendarAlt,
  faUsers,
  faBook,
  faBell,
  faUser,
  faSignOutAlt,
  faClock,
  faCheck,
  faTimes,
  faFile,
  faCheckCircle,
  faSearch,
  faInfoCircle,
  faChevronDown,
  faLocationDot,
  faPhone,
  faDirections,
  faEnvelope,
  faLock,
  faFacebookSquare,
  faFacebook,
  farEnvelope,
  faMap,
  faAddressBook,
  faBuilding,
  faEye,
  faEyeSlash,
  farUser
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
