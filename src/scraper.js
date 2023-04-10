import axios from "axios";
import { JSDOM } from "jsdom";
import fs from "fs";

// AEDEN 187744
// AVA 73618

const IDs = {
    AVA: 73618,
    AEDEN: 187744,
};

const headers = {
    "User-Agent": "Chrome/79",
    "Cache-Control": "no-cache",
};

// HEADERS extracted from request to https://ra.co/clubs/${clubId} via browser
// ------------------
// const headers = {
//     Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
//     "Accept-Encoding": "gzip, deflate, br",
//     "Accept-Language": "en-US,en;q=0.5",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//     Host: "js.refiner.io",
//     Pragma: "no-cache",
//     Referer: "https://ra.co/",
//     "Sec-Fetch-Dest": "iframe",
//     "Sec-Fetch-Mode": "navigate",
//     "Sec-Fetch-Site": "cross-site",
//     TE: "trailers",
//     "Upgrade-Insecure-Requests": "1",
//     "User-Agent":
//         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0",
// };

// Classes for DIV containing all events:
// Box-omzyfs-0 hzvomy

// Classes for DIV containing single event:
// Box-omzyfs-0 jyLLA

// Potential selector for all events:
// .hzvomy > .jyLLA

// Date inside single event:
// jmZufm

// Attendance:
// fQrgqr

const cleanHTML = (htmlFile) => {
    const cleanedHTML = htmlFile
        .replace(/(<head[\w\W]+head>)/g, "")
        .replace(/(<script[\w\W]+script>)/g, "")
        .replace(/(<picture[\w\W]+picture>)/g, "")
        .replace(/font-weight=\"([^"]*)\"/g, "")
        .replace(/color=\"([^"]*)\"/g, "")
        .replace(/data-tracking-id=\"([^"]*)\"/g, "")
        .replace(/data-button-tracking-id=\"([^"]*)\"/g, "")
        .replace(/style=\"([^"]*)\"/g, "")
        .replace(/display=\"([^"]*)\"/g, "")
        .replace(/width=\"([^"]*)\"/g, "")
        .replace(/data-testid=\"([^"]*)\"/g, "")
        .replace(/height=\"([^"]*)\"/g, "")
        .replace(/viewBox=\"([^"]*)\"/g, "")
        .replace(/fill=\"([^"]*)\"/g, "")
        .replace(/fill-rule=\"([^"]*)\"/g, "")
        .replace(/d=\"([^"]*)\"/g, "")
        .replace(/overflow=\"([^"]*)\"/g, "")
        .replace(/stroke=\"([^"]*)\"/g, "")
        .replace(/stroke-=\"([^"]*)\"/g, "")
        .replace(/(<picture[\w\W]+picture>)/g, "");
    return cleanedHTML;
};

const getPage = async (clubId) => {
    const { data: page } = await axios.get(`https://ra.co/clubs/${clubId}`, {
        headers,
        withCredentials: true,
    });
    return cleanHTML(page);
};

const extractData = async (clubId) => {
    const page = await getPage(clubId);
    const { document } = new JSDOM(page).window;

    const eventsDom = Array.from(document.querySelectorAll(".hzvomy > .jyLLA"));
    const events = { clubId, eventList: [] };
    eventsDom.forEach((event) => {
        const eventObj = {
            title: event.querySelector("h3").textContent,
            date: event.querySelector(".jmZufm").textContent,
            attendance: event.querySelector(".fQrgqr")
                ? event.querySelector(".fQrgqr").textContent
                : 0,
        };
        events.eventList.push(eventObj);
    });
    console.log(events);
};

extractData(IDs.AEDEN);
