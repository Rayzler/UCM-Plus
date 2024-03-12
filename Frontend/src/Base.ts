function showLoading() {
    return new Promise((res, rej) => {
        const loading = document.querySelector(".fullpage-wrapper");
        const bottom = document.querySelector("#rect-bottom");
        if (!loading || !bottom) {
            rej(":(");
            return;
        }

        loading.classList.remove("d-none");
        bottom.classList.remove("d-none");

        setTimeout(() => {
            loading.classList.remove("hide-loading");
            loading.classList.add("show-loading");
        }, 1);

        setTimeout(() => {
            res(":)");
        }, 750);
    });
}

function hideLoading() {
    const loading = document.querySelector(".fullpage-wrapper");
    const bottom = document.querySelector("#rect-bottom");
    if (!loading || !bottom) {
        return;
    }

    loading.classList.remove("show-loading");
    loading.classList.add("hide-loading");

    setTimeout(() => {
        loading.classList.add("d-none");
        bottom.classList.add("d-none");
    }, 750);
}

export {showLoading, hideLoading};