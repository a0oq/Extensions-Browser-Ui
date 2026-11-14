let switchBtn = document.querySelector(".theme-icon");
document.documentElement.dataset.theme = getItem("Theme") || "light";

document.documentElement.dataset.theme == "light"
  ? moonSunSwitch("moon", "sun")
  : moonSunSwitch("sun", "moon");

switchBtn.addEventListener("click", function () {
  let changeDataTheme = document.documentElement.dataset.theme;
  if (changeDataTheme == "dark") {
    document.documentElement.dataset.theme = "light";
    saveItem("Theme", "light");
    moonSunSwitch("moon", "sun");
  } else {
    document.documentElement.dataset.theme = "dark";
    saveItem("Theme", "dark");
    moonSunSwitch("sun", "moon");
  }
});

function moonSunSwitch(iconToShow, iconToHide) {
  document.querySelector(`.${iconToShow}`).classList.add("icon");
  document.querySelector(`.${iconToHide}`).classList.remove("icon");
}

let extensionsData = await fetch("data.json");
let extensionsDataArray = await extensionsData.json();

let filterBtns = document.querySelectorAll(".filter button");

loopForData(getExtensionsData(), getItem("FilterStatus") || "all");

filterBtns.forEach((el) => {
  el.addEventListener("click", function () {
    saveItem("FilterStatus", el.dataset.status);
    loopForData(getExtensionsData(), el.dataset.status);
  });
});

function loopForData(theDataArray, filterStatus = "all") {
  filterBtns.forEach((e) => e.classList.remove("selected-filter"));
  document.querySelector(`.${filterStatus}`).classList.add("selected-filter");
  document.querySelector(".cards-container").innerHTML = "";
  let filteredData = theDataArray.filter((obj) => {
    if (filterStatus == "all") return true;
    return filterStatus == "active" ? obj.isActive : !obj.isActive;
  });
  filteredData.forEach((obj) => createCradElement(obj));
}

function createCradElement(obj) {
  let card = document.createElement("div");
  card.classList.add("card");

  let iconAndInfo = document.createElement("div");
  iconAndInfo.classList.add("icon-and-info");

  let info = document.createElement("div");
  info.classList.add("info");

  let cardH3 = document.createElement("h3");
  cardH3.textContent = obj.name;

  let cardP = document.createElement("p");
  cardP.textContent = obj.description;

  let cardImg = document.createElement("img");
  cardImg.src = obj.logo;

  info.appendChild(cardH3);
  info.appendChild(cardP);

  iconAndInfo.appendChild(cardImg);
  iconAndInfo.appendChild(info);

  card.appendChild(iconAndInfo);

  let removeAndToggle = document.createElement("div");
  removeAndToggle.classList.add("remove-and-toggle");

  let remove = document.createElement("button");
  remove.classList.add("remove");
  remove.textContent = "Remove";

  let toggle = document.createElement("div");
  toggle.classList.add("toggle");
  obj.isActive == true
    ? toggle.setAttribute("data-status", true)
    : toggle.setAttribute("data-status", false);
  toggleSwitch(toggle, obj.isActive);

  removeAndToggle.appendChild(remove);
  removeAndToggle.appendChild(toggle);

  card.appendChild(removeAndToggle);
  document.querySelector(".cards-container").appendChild(card);
}

let containerOfCrads = document.querySelector(".cards-container");
containerOfCrads.addEventListener("click", function (e) {
  let card = e.target.closest(".card");
  console.log(card);
  let cardName = card.querySelector("h3").textContent;
  console.log(cardName);

  let remove = e.target.closest(".remove");

  let toggle = e.target.closest(".toggle");
  let toggleBtn = card.querySelector(".toggle");
  console.log(toggleBtn);

  if (remove) {
    let newExtensionsData = getExtensionsData().filter(
      (data) => cardName != data.name,
    );
    saveItem("ExtensionsData", newExtensionsData);
    document.querySelector(".card").remove();
  }
  if (toggle) {
    console.log(toggle.getAttribute("data-status"));
    changeToggleSwitch(
      toggleBtn,
      toggleBtn.getAttribute("data-status") === "true",
      cardName,
    );
    setTimeout(
      loopForData,
      500,
      getExtensionsData(),
      getItem("FilterStatus") || "all",
    );
  }
});

function toggleSwitch(toggle, statusOfActive) {
  if (statusOfActive == true) {
    toggle.style.setProperty("--circle-movement", "");
    toggle.classList.remove("toggle-inactive");
    console.log("reached");
  } else {
    toggle.style.setProperty("--circle-movement", "3px");
    toggle.classList.add("toggle-inactive");
  }
}

function changeToggleSwitch(toggleBtn, statusOfActive, extensionName) {
  if (statusOfActive == true) {
    statusOfActive = false;
    let newExtensionsData = getExtensionsData().map((obj) =>
      extensionName == obj.name ? { ...obj, isActive: false } : obj,
    );
    saveItem("ExtensionsData", newExtensionsData);
    toggleSwitch(toggleBtn, statusOfActive);
  } else {
    statusOfActive = true;
    let newExtensionsData = getExtensionsData().map((obj) =>
      extensionName == obj.name ? { ...obj, isActive: true } : obj,
    );
    saveItem("ExtensionsData", newExtensionsData);
    toggleSwitch(toggleBtn, statusOfActive);
  }
}

function saveItem(itemName, data) {
  return window.localStorage.setItem(itemName, JSON.stringify(data));
}

function getItem(itemName) {
  return JSON.parse(window.localStorage.getItem(itemName));
}

function getExtensionsData() {
  return getItem("ExtensionsData") || extensionsDataArray;
}
