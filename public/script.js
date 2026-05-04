alert("JS Loaded");

let nextToken = "";
let prevTokens = [];
let page = 1;

const API_URL = "https://youtube-finder-k8lo.onrender.com"; // 👈 your Render URL

async function search(reset = true) {
    console.log("Search clicked");

    let keyword = document.getElementById("keyword").value.trim();
    const [minSubs, maxSubs] = document.getElementById("subs").value.split("-");

    // ✅ Fix empty keyword
    if (!keyword) keyword = "minecraft";

    if (reset) {
        nextToken = "";
        prevTokens = [];
        page = 1;
    }

    const results = document.getElementById("results");
    results.innerHTML = "<p>Loading...</p>"; // 👈 loading UI

    try {
        const res = await fetch(
            `${API_URL}/channels?keyword=${keyword}&minSubs=${minSubs}&maxSubs=${maxSubs}&pageToken=${nextToken}`
        );

        console.log("Status:", res.status);

        if (!res.ok) {
            results.innerHTML = "<p>❌ API Error. Check server.</p>";
            return;
        }

        const data = await res.json();
        console.log("DATA:", data);

        // ✅ No results handling
        if (!data.channels || data.channels.length === 0) {
            results.innerHTML = "<p>No channels found 😢</p>";
            return;
        }

        prevTokens.push(nextToken);
        nextToken = data.nextPageToken;

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

    } catch (err) {
        console.error(err);
        results.innerHTML = `<p>❌ Error: ${err.message}</p>`;
    }
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
