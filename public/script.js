alert("JS Loaded");
let nextToken = "";
let prevTokens = [];
let page = 1;

async function search(reset = true) {
    const keyword = document.getElementById("keyword").value;
    const [minSubs, maxSubs] = document.getElementById("subs").value.split("-");

    if (reset) {
        nextToken = "";
        prevTokens = [];
        page = 1;
    }

    const res = await fetch(
        `/channels?keyword=${keyword}&minSubs=${minSubs}&maxSubs=${maxSubs}&pageToken=${nextToken}`
    );

    const data = await res.json();

    prevTokens.push(nextToken);
    nextToken = data.nextPageToken;

    const results = document.getElementById("results");
    results.innerHTML = "";

    data.channels.forEach(ch => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <img src="${ch.snippet.thumbnails.medium.url}">
            <div>
              <h3>${ch.snippet.title}</h3>
              <p>${Number(ch.statistics.subscriberCount).toLocaleString()} subs</p>
            </div>
            <a href="https://youtube.com/channel/${ch.id}" target="_blank">View</a>
        `;

        results.appendChild(div);
    });

    document.getElementById("page").innerText = page;
}

function nextPage() {
    page++;
    search(false);
}

function prevPage() {
    if (page > 1) {
        page--;
        nextToken = prevTokens[page - 1] || "";
        search(false);
    }
}
