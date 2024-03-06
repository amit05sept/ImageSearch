const Access_Key = "sPJW0plVWUaVwWZHdTKlkONf5XLfNs2MAeXeKj-gof4";
const inputBox = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const container = document.querySelector(".container");
const DataContainer = document.querySelector(".showData");
const loader = document.querySelector(".loader");
// const showMore = document.querySelector(".showMore");
let page = 1;


// show data on DOM
const showData = function (datas) {
  datas.forEach((data) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const link = document.createElement("a");

    img.src = data.urls.small;
    img.alt = data.alt_description;
    img.classList.add("images");

    link.href = data.links.html;
    link.textContent = data.alt_description;
    link.target = "_blank";

    div.appendChild(img);
    div.appendChild(link);
    div.classList.add("card");

    DataContainer.appendChild(div);
  });
};

// One sec Pause for loader 
const OneSecPause = function () {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 700);
  });
};

// gets data from API
const getData = async function (searchValue, pageNo, load = false) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${searchValue} &per_Page=1&page=${pageNo} age&client_id=${Access_Key}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    if (load) {
      loader.classList.remove("hidden");
      await OneSecPause();
      loader.classList.add("hidden");
    }
    //   console.log(data.results);
    showData(data.results);
    page++;
  } catch (err) {
    console.log(err);
  }
};
// initial screen 
getData("random", 1);

// search button click event
searchBtn.addEventListener("click", () => {
  const searchValue = inputBox.value;
  page = 1;
  DataContainer.innerHTML = "";
  console.log(searchValue);
  getData(searchValue, page);
});

// input box enter event
inputBox.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    searchBtn.click();
  }
});

// showMore.addEventListener("click",()=>{
//     const searchValue = inputBox.value;
//     console.log(searchValue,page);
//     getData(searchValue,++page);
// });

// Data on scroll reaching to end 
const getScrollData = function () {
  const searchValue = inputBox.value;
  if (!searchValue) return;
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 100
  ) {
    console.log("hi");
    console.log(searchValue, page);
    // getData(searchValue, page,true);
    getData(searchValue, page, true);
  }
};

// throttling,
const throttling = function (fn, d) {
  let isRunning = false;
  return function (...args) {
    if (!isRunning) {
      isRunning = true;
      fn.apply(this, args);

      setTimeout(() => {
        isRunning = false;
      }, d);
    }
  };
};


// debouncing
const debouncing = function (fn, d) {
  let timer;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arg);
    }, d);
  };
};

// we are debouncing the scroll, user waits for 500 milisec then call the scroll event
const windowThrottle = debouncing(getScrollData, 500);

// window.addEventListener("scroll", (e) => {
//   // console.log(window.scrollY);
//   const searchValue = inputBox.value;
//   if(!searchValue)return;
//   if (
//     window.scrollY + window.innerHeight >=
//     document.documentElement.scrollHeight
//   ) {
//     console.log("hi");
//     console.log(searchValue, page);
//     // getData(searchValue, page,true);
//     getData(searchValue, page, true);
//     // .then(() => {
//     //     // After loading new data, scroll to a specific position
//     //     window.scrollTo({
//     //       top: document.documentElement.scrollHeight, // Scroll to the bottom of the page
//     //       behavior: 'smooth' // Optionally, use smooth scrolling
//     //     });
//     //   });
//   }
// });

// scroll even listner 
window.addEventListener("scroll", () => {
  windowThrottle();
});
