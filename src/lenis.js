import Lenis from 'lenis'

import './lenis.scss'

/**
 * Allow to customize default Lenis settings by adding an object to window.
 *
 * @see https://github.com/darkroomengineering/lenis
 */
const settings = window.anfbLenisSettings || {autoRaf: true}

window.anfbLenis = new Lenis(settings)
