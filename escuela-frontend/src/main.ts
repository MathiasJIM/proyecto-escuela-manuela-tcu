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
  faBookOpen,
  faBell,
  faUser,
  faUserTie,
  faGraduationCap,
  faSignOutAlt,
  faClock,
  faCheck,
  faTimes,
  faFile,
  faCheckCircle,
  faSearch,
  faInfoCircle,
  faChevronDown,
  faChevronRight,
  faLocationDot,
  faPhone,
  faDirections,
  faEnvelope,
  faLock,
  faFolder,
  faBullhorn,
  faChartBar,
  faTableCellsLarge,
  faCalendar,
  faPlus,
  faArrowUp,
  faEye as faSolidEye
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

// Agregamos los iconos a la biblioteca
library.add(
  faBars,
  faXmark,
  faHome,
  faClipboardCheck,
  faCalendarAlt,
  faUsers,
  faBook,
  faBookOpen,
  faBell,
  faUser,
  faUserTie,
  faGraduationCap,
  faSignOutAlt,
  faClock,
  faCheck,
  faTimes,
  faFile,
  faCheckCircle,
  faSearch,
  faInfoCircle,
  faChevronDown,
  faChevronRight,
  faLocationDot,
  faPhone,
  faDirections,
  faEnvelope,
  faLock,
  faFolder,
  faBullhorn,
  faChartBar,
  faTableCellsLarge,
  faCalendar,
  faPlus,
  faArrowUp,
  faSolidEye,
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
