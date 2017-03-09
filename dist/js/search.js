define(function(require) {
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  // load up the icon object from whats in the DOM
  var
    x, l, y, t,
    iconElement,
    tags,
    pack,
    isResult,
    totalResults,
    clipboardTimer,
    icons = [],
    eleObj,
    iconElements = document.getElementsByTagName("li"),
    searchInput = document.getElementById("search"),
    iconsUL = document.getElementById("icons");

  for (x = 0, l = iconElements.length; x < l; x++) {
    iconElement = iconElements[x];

    tags = iconElement.getAttribute("data-tags");
    pack = iconElement.getAttribute("data-pack");

    eleObj = {
      el: iconElement,
      tags: tags ? tags.split(',') : [],
      show: true,
      code: getContentForIcon(iconElement),
      animation: (iconElement.getAttribute("data-animation") === "true")
    };
    icons.push(eleObj);

  }
  totalResults = icons.length;

  // search
  function onSearchFocus() {
    iconsUL.className = "search-init";
    searchInput.className = "has-text"
    this.placeholder = "";
  }
  addEvent(searchInput, "focus", onSearchFocus);

  function onSearchBlur() {
    iconsUL.className = "";
    this.placeholder = "Search";
    if (totalResults < 1 || this.value.trim() === "") {
      this.value = "";
      this.className = "";
      showAll();
    }
  }
  addEvent(searchInput, "blur", onSearchBlur);

  function onSearchKeyUp(e) {
    var keyCode = e.which || e.keyCode;
    if (keyCode === 27) {
      this.value = "";
      searchInput.className = "";
      this.blur();
    } else if (this.value.trim() === "") {
      showAll();
      this.value = "";
      iconsUL.className = "search-init";
    } else {
      iconsUL.className = "search-results";
      searchQuery(this.value);
    }
  }
  addEvent(searchInput, "keyup", onSearchKeyUp);

  function searchQuery(query) {
    if (!query) return;

    totalResults = 0;

    query = query.trim().toLowerCase();

    var terms = query.split(' ');

    if (terms.length < 1) {
      showAll();
      iconsUL.className = "search-init";
      return;
    }

    iconsUL.className = "search-results";
    searchInput.className = "has-text";

    // set all to show
    for (var x=0; x<icons.length;x++) {
      icons[x].show = true;
    }

    // filter down for each term in the query
    for (t = 0; t < terms.length; t++) {
      for (var x=0; x<icons.length;x++) {
        if (!icons[x].show) continue;
        isResult = false;
        for (y = 0; y < icons[x].tags.length; y++) {
          if (icons[x].tags[y].indexOf(terms[t]) > -1) {
            isResult = true;
            break;
          }
        }
        if (!isResult) {
          icons[x].show = false;
        }
      }
    }

    // show or hide
    for (var x=0; x<icons.length;x++) {
      if (icons[x].show) {
        totalResults++;
        if (icons[x].el.style.display !== "inline-block") {
          icons[x].el.style.display = "inline-block";
        }
      } else {
        if (icons[x].el.style.display !== "none") {
          icons[x].el.style.display = "none";
        }
      }
    }
  }

  function showAll() {
    totalResults = icons.length;
    for (var x=0; x<icons.length;x++) {
      icons[x].show = true;
      if (icons[x].el.style.display !== "inline-block") {
        icons[x].el.style.display = "inline-block";
      }
    }
  }

  function addEvent(el, ev, fn) {
    if (el.addEventListener) {
      el.addEventListener(ev, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + ev, fn);
    } else {
      el['on' + ev] = fn;
    }
  }

  var iconName = document.getElementById("icon-name");
  var iconCode = document.getElementById("icon-code");

  var mouseOverTimeout;

  function getContentForIcon(iconElement) {
    var inputEle = iconElement.getElementsByClassName('_code');
    return inputEle[0].value
  }

})