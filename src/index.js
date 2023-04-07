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

const extractData = async () => {
    const page = await getPage(IDs.AVA);
    const { document } = new JSDOM(page).window;

    console.log(document.querySelector("h1").textContent);
};

extractData();
