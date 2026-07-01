let vol = 17;
let maxCh = 9;
let currPage = 1;

const baseUrl = `https://meionovels.com/novel/youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e/`;

function openNextPage() {
    if (currPage > maxCh) return;

    const targetUrl = `${baseUrl}volume-${vol}-chapter-${currPage}/`;
    const win = window.open(targetUrl, "_blank");

    currPage++;

    setTimeout(() => {
        openNextPage();
    }, 200);
}

openNextPage();
