// Cookie consent for Google Analytics, using Google Consent Mode v2.
// Until a visitor accepts, GA runs without cookies (analytics_storage "denied"). Ads storage is always denied
// (the site shows no ads). The visitor's choice is kept in localStorage under CONSENT_KEY.

export const CONSENT_KEY = "cookie-consent";
export type ConsentChoice = "granted" | "denied";
/** Event the footer's "Cookie settings" link fires to reopen the banner. */
export const OPEN_CONSENT_EVENT = "open-cookie-settings";

/**
 * Runs in <head> before anything else: sets the consent defaults (from a saved choice, else denied) and queues
 * the GA config, so the gtag.js library (loaded later, after the page) applies them from its first hit.
 */
export function gaBootScript(measurementId: string): string {
  return [
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}",
    `var c=null;try{c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})}catch(e){}`,
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:c==='granted'?'granted':'denied'});",
    "gtag('js',new Date());",
    `gtag('config',${JSON.stringify(measurementId)});`,
  ].join("");
}
