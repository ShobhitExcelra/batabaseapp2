import { LogLevel } from "@azure/msal-browser";
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

// Config object to be passed to Msal on creation
export const msalConfig = {
    auth: {
        // clientId: "3fba556e-5d4a-48e3-8e1a-fd57c12cb82e",
        // authority: "https://login.windows-ppe.net/common",
        // redirectUri: "/",
        // postLogoutRedirectUri: "/"
        // clientId: "2b8a4455-bbfd-4d8f-b410-42f20c20244e",
        // authority: "https://login.microsoftonline.com/e8f7fe02-a765-41f5-97c6-54d3ab09d4c2",
        
        //clientId: "25d03d58-eacc-4ebb-ae12-a9af0ab2e104",
        //authority: "https://login.microsoftonline.com/8c813108-1234-4cc9-aca7-a1698afddedb",

        clientId: "9d65f5b3-f7e9-46da-9a7f-75b10ad7786c",
        authority: "https://login.microsoftonline.com/a146a12b-eb46-42d6-8535-040afd3fe7ac",

        // clientId: "df118437-16ef-4b39-b71a-9218059673c9",
        // authority: "https://login.microsoftonline.com/8c813108-1234-4cc9-aca7-a1698afddedb",
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: isIE || isEdge || isFirefox
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {	
                    return;	
                }
                
                switch (level) {	
                    case LogLevel.Error:	
                        console.error(message);	
                        return;	
                    case LogLevel.Info:	
                       // console.info(message);	
                        return;	
                    case LogLevel.Verbose:	
                        console.debug(message);	
                        return;	
                    case LogLevel.Warning:	
                        console.warn(message);	
                        return;	
                    default:
                        return;
                }
            }
        }
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
    scopes: ["User.Read"]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft-ppe.com/v1.0/me"
};