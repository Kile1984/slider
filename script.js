"use strict";

// Global
const durationInput = document.querySelector("#ms-input-duration");
let currentSlide;

// Option for slider
const sliderOptions = function () {
  // Select elements
  const selectBox = document.querySelector(".animation-select-box");
  const option = document.querySelector(".option");
  const icon = document.querySelector(".icon");
  const sliderMenu = document.querySelector(".slider-menu");
  const animationInput = document.querySelector(".animation-input");
  const autoplayCheckbox = document.querySelector(".autoplay-checkbox");
  let inputValue = ""; //I don`t want pass input.value like argument from eventListener to submit

  // Open select options
  selectBox.addEventListener("click", function () {
    option.classList.toggle("open");
    icon.classList.toggle("rotate");
    sliderMenu.classList.toggle("height");
    animationInput.classList.toggle("shadow");
  });

  // Close select options
  document.querySelectorAll(".option-animation").forEach((o) => {
    option.addEventListener("click", function () {
      option.classList.remove("open");
      sliderMenu.classList.remove("height");
    });
  });

  // Changing select input value
  option.addEventListener("click", function (e) {
    stopInterval();
    inputValue = e.target.dataset.value;
    animationInput.value =
      inputValue[0].slice().toUpperCase() + inputValue.slice(1);
    submit();
  });

  // Submit event listeners
  const submit = function () {
    // Set durationInput readonly
    if (autoplayCheckbox.checked) {
      durationInput.value = 3;
      durationInput.removeEventListener("keyup", submit);
      durationInput.setAttribute("readonly", true);
      durationInput.classList.add("readonly");
    } else {
      durationInput.addEventListener("keyup", submit);
      durationInput.removeAttribute("readonly", true);
      durationInput.classList.remove("readonly");
    }

    // Calling slider with options
    if (inputValue !== "") {
      slider(
        durationInput.value,
        inputValue,
        autoplayCheckbox.checked,
        currentSlide
      );
    } else {
      slider(
        durationInput.value,
        animationInput.value,
        autoplayCheckbox.checked,
        currentSlide
      );
    }
  };

  // Adding event listeners
  durationInput.addEventListener("keyup", submit);
  animationInput.addEventListener("keyup", submit);
  autoplayCheckbox.addEventListener("change", submit);
};

// Calling options
sliderOptions();

// Slider elements
let dotsCreated = false;
let interval;
let autoplayInterval;
const sliderElement = document.querySelector(".slider");

// Define function's outside slider scope
//
// Stop autoplay interval
const stopInterval = function () {
  clearInterval(autoplayInterval);
};

// Start autoplay interval
const startInterval = function () {
  autoplayInterval = setInterval(interval, 3000);
};

// Adding event listener on "mouseover" and "mouseleave"
const addAutoplayEventListeners = function () {
  sliderElement.addEventListener("mouseover", stopInterval);
  sliderElement.addEventListener("mouseleave", startInterval);
};

// Removing event listener on "mouseover" and "mouseleave"
const removeAutoplayEventListeners = function () {
  sliderElement.removeEventListener("mouseover", stopInterval);
  sliderElement.removeEventListener("mouseleave", startInterval);
};

// Capturing current slide index
function setCurrentSlide(current) {
  currentSlide = current;
}

// Slider function
function slider(
  duration = 3,
  animation = "linear",
  autoplay = false,
  currentSlide = 0
) {
  // Select elements
  const slide = document.querySelectorAll(".slide");
  const arrowLeft = document.querySelector(".arrow-left");
  const arrowRight = document.querySelector(".arrow-right");
  const dotContainer = document.querySelector(".dots");
  const imagesLength = slide.length;

  // Interval
  interval = function () {
    prevSlide();
  };

  // Checkbox is checked
  if (autoplay) {
    // Disable arrows click
    arrowLeft.classList.add("disable");
    arrowRight.classList.add("disable");

    addAutoplayEventListeners();
    setTimeout(function () {
      interval();
      autoplayInterval = setInterval(interval, 3000);
    }, 500);
  } else {
    // Enable arrows click
    arrowLeft.classList.remove("disable");
    arrowRight.classList.remove("disable");

    removeAutoplayEventListeners();

    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }

  // Slider transition
  slide.forEach((slide) => {
    slide.style.transition = `all ${animation} ${duration / 10}s`;
  });

  // Create dots
  const createDots = function () {
    slide.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  // Activ dot
  const activeDots = function (slide) {
    // Remembar on autoplay image index

    slide = currentSlide;

    document.querySelectorAll(".dots__dot").forEach((dot) => {
      dot.classList.remove("dots__dot--active");
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // Event click dot
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;

      currentSlide = Number(slide);
      setCurrentSlide(currentSlide);

      activeDots(slide);
      goToSlide(slide);
    }
  });

  // Previous slide
  const prevSlide = function () {
    if (currentSlide === imagesLength - 1) {
      currentSlide = 0;
      setCurrentSlide(currentSlide);
    } else {
      currentSlide++;
      setCurrentSlide(currentSlide);
    }

    goToSlide(currentSlide);
    activeDots(currentSlide);
  };

  // Next slide
  const nextSlide = function () {
    if (currentSlide === 0) {
      currentSlide = imagesLength - 1;
      setCurrentSlide(currentSlide);
    } else {
      currentSlide--;
      setCurrentSlide(currentSlide);
    }

    goToSlide(currentSlide);
    activeDots(currentSlide);
  };

  // Slide
  function goToSlide(current) {
    slide.forEach((img, i) => {
      img.style.transform = `translateX(${100 * (i - current)}%)`;
    });
  }

  // Event handlers
  arrowLeft.addEventListener("click", prevSlide);
  arrowRight.addEventListener("click", nextSlide);

  // Init state
  function init() {
    goToSlide(currentSlide);

    if (!dotsCreated) createDots();

    activeDots(0);

    dotsCreated = true;
  }
  init();
}

slider();
