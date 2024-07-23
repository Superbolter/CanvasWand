import {cookies} from "../App"
import { isMobile, isIOS } from 'react-device-detect';
import axios from "axios";



const clearUserSessionCookies = () => {
   cookies.remove('USER-SESSION', { path: "/" })
   cookies.remove('EMAIL', { path: "/" })                     
   cookies.remove('LOGIN-RESPONSE', { path: "/" })
   window.OnLogout();
   window.location = window.location.origin
   window.GAEvent("Login", "SignOutClick", "")
}



export default class RomeDataManager        {

   static _roomTypes = [{ order: 1, key: 'bedroom', value: 'Bedroom' }, { order: 8, key: 'balcony', value: 'Balcony' },
   { order: 4, key: 'dining', value: 'Dining' }, { order: 3, key: 'kitchen', value: 'Kitchen' }, { order: 9, key: 'utility', value: 'Utility' },
   { order: 2, key: 'livingroom', value: 'Living room' }, { order: 5, key: 'pooja', value: 'Pooja' },
   { order: 10, key: 'toilet', value: 'Toilet' }, { order: 2, key: 'living-dining', value: 'Living/dining' },
   { order: 6, key: 'foyer', value: 'Foyer' }, { order: 8, key: 'dress', value: 'Dress' }, { order: 7, key: 'drawing', value: 'Drawing' },
   { order: 10, key: 'wash', value: 'Wash' }, { order: 10, key: 'hall', value: 'Hall' }, { order: 7, key: 'sitout', value: 'Sitout' },
   { order: 7, key: 'walkinwardrobe', value: 'Walk in wardrobe' },
   { order: 10, key: 'entrance', value: 'Entrance' }, { order: 10, key: 'stairs', value: 'Stairs' }, { order: 9, key: 'studyroom', value: 'Study Room' },
   { order: 9, key: 'powderroom', value: 'Powder Room' }, { order: 8, key: 'store', value: 'Store' }, { order: 10, key: 'lift', value: 'Lift' },
   { order: 8, key: 'maidroom', value: 'Maid room' }, { order: 7, key: 'restroom', value: 'Rest Room' }, { order: 10, key: 'dgroom', value: 'DG Room' },
   { order: 10, key: 'petroom', value: 'Pet room' }, { order: 8, key: 'commonarea', value: 'Common Area' },
   { order: 10, key: 'passagearea', value: 'Passage Area' }, { order: 10, key: 'gardenarea', value: 'Garden Area' }, { order: 10, key: 'parkingarea', value: 'Parking Area' }
   ];

   static _targetApiURL = process.env.REACT_APP_SERVER_URL


   static _targetWebApiURL = process.env.REACT_APP_SERVER_URL_WEB

   static _targetVsApiURL = process.env.REACT_APP_SERVER_URL_VS

   static _userEmail = process.env.REACT_APP_DEMO_EMAIL;

   static _access_token = null;

   static _siteType = process.env.REACT_APP_SITE_SOURCE;

   static _deviceType = "WebGLPlayer"
   //_userEmail = "power2dil@gmail.com";

   static logged_in = false;

   static _default_header = {
      "email": this._userEmail,
      "DEVICE_TYPE": this._deviceType,
      "SITE_TYPE": this._siteType
   }

   // MaxAge set to one week
   static _maxAge = 604800;

   static instantiate() {
      window.currentCDNIndex = 1;
      window.currentRomeCDNIndex = 1;
      window.env_app_name = process.env.REACT_APP_NAME
      window.env_build_version = process.env.REACT_APP_BUILD_VERSION
      window.env_asset_url = process.env.REACT_APP_ASSET_URL;
      window.env_rome_asset_url = process.env.REACT_APP_ROME_ASSET_URL;
      window.env_server_type = process.env.REACT_APP_SERVER_TYPE;
      window.env_demo_design = process.env.REACT_APP_DEMO_DESIGN;
      window.env_playground_design = process.env.REACT_APP_PLAYGROUND_DESIGN;
      window.env_beat_playground = process.env.REACT_APP_BEAT_PLAYGROUND;
      // window.env_beat_site = window.bool(process.env.REACT_APP_BETA_SITE)
      // window.assetCdnUrls.push(window.env_asset_url);

      // * Initilizing Device Type
      if (isMobile) {
         if (isIOS) {
            this._deviceType = "WebUSDZ"
         } else {
            this._deviceType = "WebGLB"
         }
      } else {
         this._deviceType = "WebGLPlayer"
      }

   }

   static getMaxAge() {
      return this._maxAge;
   }

   static getUserEmail() {
      return this._userEmail;
   }

   static isLoggedIn() {
      return this.logged_in;
   }

  

   static setUserEmail(email, accessToken = null) {
      this._default_header = {
         "email": email,
         "DEVICE_TYPE": this._deviceType,
         "SITE_TYPE": this._siteType
      }

      this.logged_in = true
      if (!!accessToken) {
         this._access_token = accessToken;
      }
       console.log(accessToken)
       this._userEmail = email;
   }


   static getDefaultHeader() {
      if (!!this._access_token) {
         return {
            "email": this._userEmail,
            "DEVICE_TYPE": this._deviceType,
            "access_token": this._access_token,
            "SITE_TYPE": this._siteType
         };

      } else {
         return {
            "email": this._userEmail,
            "DEVICE_TYPE": this._deviceType,
            "SITE_TYPE": this._siteType
         };
      }
   }

   static getRoomTypes() {

      return this._roomTypes;

   }

   static getApiUrl() {
      return this._targetApiURL;
   }

   static getWebApiUrl() {
      return this._targetWebApiURL;
   }

   static getVsApiUrl() {
      return this._targetVsApiURL;
   }



   static toastMessage(dispatch, message, type) {
      let icon = null;

      if (type === 'success' || type === 'ok') {
         icon = "Images/success.png";
      } else if (type === 'alert' || type === 'error') {
         icon = "Images/alert.png";
      }

      if (icon) {
         dispatch({
            type: "TOAST_MESSAGE",
            toast_icon: icon,
            is_message: true,
            toast_message: message
         })
      }

   }

}




// * (Srinivas D):NOTE Do not Move the axios helper to a different file , as the axios was called even before the RomeDatamanagter was in Scope
const fetchWrapper = axios.create({
   baseURL: RomeDataManager.getApiUrl(),
})

fetchWrapper.interceptors.request.use((config)=>{
   config.headers=RomeDataManager.getDefaultHeader();
   return config;
},(error)=>{
   console.log("error on request",error)
   return Promise.reject(error);
})


fetchWrapper.interceptors.response.use(
   (response)=>{
       // console.log("Axios interceptor response",response)
       return response;
},
(error)=>{
   if(error.response.status === 401){
       let evt = new CustomEvent('loginPromptRequest', { detail: { } });
       window.dispatchEvent(evt);
   }
  
   // console.log("Axios interceptor error",error)
   return Promise.reject(error);
}
)


const fetchWrapperWeb = axios.create({
   baseURL: RomeDataManager.getWebApiUrl(),
})

fetchWrapperWeb.interceptors.request.use((config)=>{
   config.headers=RomeDataManager.getDefaultHeader();
   return config;
},(error)=>{
   console.log("error on request",error)
   return Promise.reject(error);
})


fetchWrapperWeb.interceptors.response.use(
   (response)=>{
       // console.log("Axios interceptor response",response)
       return response;
},
(error)=>{
   if(error.response.status === 401){
       let evt = new CustomEvent('loginPromptRequest', { detail: { } });
       window.dispatchEvent(evt);
   }
  
   // console.log("Axios interceptor error",error)
   return Promise.reject(error);
}
)

const fetchWrapperVs = axios.create({
   baseURL: RomeDataManager.getVsApiUrl(),
})

fetchWrapperVs.interceptors.request.use((config)=>{
   config.headers=RomeDataManager.getDefaultHeader();
   return config;
},(error)=>{
   console.log("error on request",error)
   return Promise.reject(error);
})


fetchWrapperVs.interceptors.response.use(
   (response)=>{
       // console.log("Axios interceptor response",response)
       return response;
},
(error)=>{
   if(error.response.status === 401){
       let evt = new CustomEvent('loginPromptRequest', { detail: { } });
       window.dispatchEvent(evt);
   }
  
   // console.log("Axios interceptor error",error)
   return Promise.reject(error);
}
)


export {fetchWrapper, fetchWrapperWeb, fetchWrapperVs};


