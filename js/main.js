$(document).ready(function () {
  let portfolioTemplate = $('#portfolio-template').html();
  Mustache.parse(portfolioTemplate);

  const numPortfolioInit = 6, numPortfolioLoad = 4;
  let portfolios;

  // Get data
  $.getJSON("./data/portfolios.json", data => {
    portfolios = data.projects;
    addPortfolio(numPortfolioInit);
  });

  // Render more portfolio after clicking this button
  $("#btn-see-more").click(function () {
    addPortfolio(numPortfolioLoad);
  });

  // Display side bar menu when clicking on toggle menu
  $("#my-toggle-menu, .nav-item").click(function () {
    $("#my-side-bar").toggleClass("responsive");
    $("#my-toggle-menu").toggleClass("responsive");
  });

  // Open link all links in a new tab, except links with '#' in the beginning
  $("a:not([href^='#'])").attr("target", "_blank");

  // Smooth scrolling
  $("a[href*='#']:not([href='#'])").click(function () {
    let target = $(this).attr("href");
    scrollTo(target);
    event.preventDefault();
  });

  // Scroll to top as "intro" section
  let $myScrollTop = $("#my-scroll-top");
  $myScrollTop.click(function () {
    scrollTo($("#intro"));
  });

  // Hide or show "back to top" button when scrolling page
  showOrHideBackToTopButton();

  let debounceTimer;
  $(window).scroll(function () {
    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(function () {
      showOrHideBackToTopButton();
      handleScrollLazyLoading();
    }, 100);
  });

  function showOrHideBackToTopButton() {
    if ($(window).scrollTop() > 150) $myScrollTop.show();
    else $myScrollTop.hide();
  }

  // Load profile image 
  lazyLoadingImage(document.querySelector(".img-profile"));

  function lazyLoadingImage(imgElm) {
    const dataSrc = imgElm.getAttribute("data-src");
    const img = new Image();
    img.src = dataSrc;
    img.onload = () => {
      imgElm.setAttribute("src", dataSrc);
      imgElm.classList.add("visible");
    }
  }

  // Scroll to target
  function scrollTo(target) {
    $('html,body').stop().animate({
      scrollTop: $(target).offset().top
    }, 1000);
  }

  function addPortfolio(numPortfolio) {
    for (let i = 0; i < numPortfolio; i++) {
      const item = portfolios.pop();
      if (item) {
        const rendered = Mustache.render(portfolioTemplate, item);
        $("#my-portfolios").append(rendered);
      }
    }

    handleScrollLazyLoading();

    if (portfolios.length === 0)
      $("#btn-see-more").css("display", "none");
  }

  function handleScrollLazyLoading() {
    const imgElms = $("#my-portfolios").find(".lazy-image").not(".visible");
    for (let i = 0; i < imgElms.length; i++) {
      if (elementInViewport(imgElms[i])) {
        lazyLoadingImage(imgElms[i]);
      }
    }
  }

  // Check if a DOM element is in the viewport
  function elementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0
      && rect.left >= 0
      && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    )
  }
});
