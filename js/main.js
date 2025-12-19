/* global $ */

function smoothScrollTo(target) {
  const el = document.querySelector(target);
  if (!el) return;
  const offset = el.getBoundingClientRect().top + window.pageYOffset - 72;
  window.scrollTo({ top: offset, behavior: "smooth" });
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const mobile = document.getElementById("mobile-menu");
  toggle?.addEventListener("click", () => {
    mobile?.classList.toggle("open");
  });

  document.querySelectorAll("nav a, .nav-mobile a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        mobile?.classList.remove("open");
        smoothScrollTo(href);
      }
    });
  });

  window.addEventListener("scroll", () => {
    const fromTop = window.scrollY + 90;
    document
      .querySelectorAll("main section[id]")
      .forEach((section) => {
        const id = section.getAttribute("id");
        const link = document.querySelector(`.nav-desktop a[href="#${id}"]`);
        if (!link) return;
        if (
          section.offsetTop <= fromTop &&
          section.offsetTop + section.offsetHeight > fromTop
        ) {
          link.classList.add("is-active");
        } else {
          link.classList.remove("is-active");
        }
      });
  });
}

function setupInView() {
  const items = document.querySelectorAll(".fade-up, .fade-in");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

function setupBookingForm() {
  const form = document.querySelector(".booking-bar");
  const tabs = document.querySelectorAll(".booking-tabs .tab");

  if (!form) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const required = form.querySelectorAll("[required]");
    let valid = true;
    required.forEach((field) => {
      if (!field.value) {
        valid = false;
        field.classList.add("field-error");
      } else {
        field.classList.remove("field-error");
      }
    });
    if (!valid) {
      alert("Vui lòng điền đầy đủ thông tin đặt phòng.");
      return;
    }
    alert("Cảm ơn bạn! Chúng tôi sẽ liên hệ để xác nhận đặt phòng.");
  });
}

function setupContactForm() {
  const form = document.getElementById("booking-form");
  const bookingForm = document.getElementById("booking-request-form");
  
  if (!$("#booking-notification").length) {
    $("body").append(`
      <div id="booking-notification" class="booking-notification" style="display: none;">
        <div class="notification-content">
          <span class="notification-icon">✓</span>
          <span class="notification-message"></span>
        </div>
      </div>
    `);
  }

  const showNotification = (message, type = "success") => {
    const $notification = $("#booking-notification");
    $notification
      .removeClass("success error")
      .addClass(type)
      .find(".notification-message")
      .text(message);
    
    $notification.find(".notification-icon").text(type === "success" ? "✓" : "✗");
    
    $notification.fadeIn(400, function() {
      setTimeout(() => {
        $notification.fadeOut(400);
      }, 5000);
    });
  };
  
  const setupForm = (formElement) => {
    if (!formElement) return;

    formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const required = formElement.querySelectorAll("[required]");
      let valid = true;
      required.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add("field-error");
          field.style.borderColor = "#e74c3c";
        } else {
          field.classList.remove("field-error");
          field.style.borderColor = "#ddd";
        }
      });

      const emailField = formElement.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          valid = false;
          emailField.classList.add("field-error");
          emailField.style.borderColor = "#e74c3c";
          showNotification("Email không hợp lệ. Vui lòng kiểm tra lại.", "error");
        }
      }

      const checkinField = formElement.querySelector("#booking-checkin");
      const checkoutField = formElement.querySelector("#booking-checkout");
      if (checkinField && checkoutField && checkinField.value && checkoutField.value) {
        const checkin = new Date(checkinField.value);
        const checkout = new Date(checkoutField.value);
        if (checkout <= checkin) {
          valid = false;
          checkoutField.classList.add("field-error");
          checkoutField.style.borderColor = "#e74c3c";
          showNotification("Ngày trả phòng phải sau ngày nhận phòng.", "error");
        }
      }

      if (!valid) {
        if (!$("#booking-notification").is(":visible")) {
          showNotification("Vui lòng điền đầy đủ và đúng thông tin.", "error");
        }
        return;
      }

      formElement.reset();
      
      showNotification(
        "Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.",
        "success"
      );
    });

    formElement.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("input", () => {
        field.classList.remove("field-error");
        field.style.borderColor = "";
      });
    });
  };

  setupForm(form);
  setupForm(bookingForm);
}

function setupHeroSlider() {
  if (document.body.classList.contains("page-services")) return;

  const slides = [
    {
      img: "Image/Header_1.png",
      title: "Tuyệt tác nghỉ dưỡng giữa lòng Đảo Ngọc.",
      body:
        "Tạm gác lại những ồn ào của phố thị để đắm mình vào bản giao hưởng của sóng và gió. Tại The Palm Hideaway, chúng tôi kiến tạo một ốc đảo biệt lập bên bờ biển Ông Lang, nơi thiên nhiên nguyên sơ sẽ ôm ấp và chữa lành mọi giác quan của bạn.",
    },
    {
      img: "Image/45.jpg",
      title: "Chạm tay vào thiên nhiên.",
      body:
        "Đánh thức buổi sáng trong không gian kiến trúc Eco-chic mộc mạc, nơi hương gỗ tự nhiên hòa quyện cùng vị mặn mòi của biển cả. Mỗi căn Bungalow là một thế giới riêng tư tuyệt đối, với tầm nhìn vô cực hướng thẳng ra đại dương bao la.",
    },
    {
      img: "Image/46.jpg",
      title: "Bản giao hưởng của hương vị.",
      body:
        "Thưởng thức tinh hoa ẩm thực địa phương được nâng tầm nghệ thuật trong không gian lãng mạn dưới ánh nến. Hãy để vị giác của bạn bùng nổ với những mẻ hải sản tươi sống nhất, được đánh bắt trong ngày và chế biến ngay bên bờ biển rì rào sóng vỗ.",
    },
  ];

  const layers = Array.from(document.querySelectorAll(".hero-bg-layer"));
  const copy = document.querySelector(".hero-copy");
  const headline = document.querySelector(".hero-headline");
  const body = document.querySelector(".hero-body");
  if (!layers.length || !copy || !headline || !body) return;

  let current = 0;
  function showSlide(next) {
    const currentLayer = layers[current];
    const nextLayer = layers[next];

    currentLayer.classList.remove("active");
    currentLayer.classList.add("exit");
    nextLayer.classList.remove("exit");
    nextLayer.classList.add("active");

    copy.classList.remove("anim-enter");
    copy.classList.add("anim-exit");
    setTimeout(() => {
      headline.textContent = slides[next].title;
      body.textContent = slides[next].body;
      copy.classList.remove("anim-exit");
      void copy.offsetWidth;
      copy.classList.add("anim-enter");
    }, 350);

    current = next;
  }

  setInterval(() => {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }, 10000);
}

function setupIntroType() {
  const active = document.querySelector(".intro-text--active");
  if (!active) return;
  const text = active.textContent;
  active.textContent = "";
  const frag = document.createDocumentFragment();
  [...text].forEach((ch) => {
    const span = document.createElement("span");
    span.textContent = ch;
    frag.appendChild(span);
  });
  active.appendChild(frag);

  const sticky = document.querySelector(".intro-sticky");
  if (!sticky) return;
  const spans = Array.from(active.querySelectorAll("span"));
  const total = spans.length;

  const controller = () => {
    const rect = sticky.getBoundingClientRect();
    const viewport = window.innerHeight;
    const start = viewport * 0.2;
    const end = viewport * 1.6;
    const progress = Math.min(Math.max((start - rect.top) / (end - start), 0), 1);
    const revealCount = Math.floor(progress * total);
    spans.forEach((s, i) => {
      if (i < revealCount) s.classList.add("is-on");
      else s.classList.remove("is-on");
    });
  };

  window.addEventListener("scroll", controller, { passive: true });
  controller();
}

function setupRoomsScroll() {
  const section = document.querySelector(".rooms");
  const pin = document.querySelector(".rooms-pin");
  const rail = document.querySelector(".room-rail");
  const cards = rail ? Array.from(rail.querySelectorAll(".room-card")) : [];
  if (!section || !pin || !rail || cards.length === 0) return;

  const compute = () => {
    const header = document.querySelector(".site-header");
    const headerH = header ? header.offsetHeight : 0;
    pin.style.top = `${headerH}px`;

    const viewport = window.innerWidth;
    const viewportH = window.innerHeight - headerH;
    const first = cards[0];
    const last = cards[cards.length - 1];
    const center = viewport / 2;

    const firstCenter = first.offsetLeft + first.offsetWidth / 2;
    const lastCenter = last.offsetLeft + last.offsetWidth / 2;

    const startShift = center - firstCenter;
    const endShift = center - lastCenter;
    const travel = startShift - endShift;

    section.style.minHeight = `${viewportH + Math.abs(travel) + headerH}px`;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const start = sectionTop - headerH;
    const scrollSpan = section.offsetHeight - viewportH;
    const end = start + scrollSpan;

    const onScroll = () => {
      const y = window.scrollY;
      const progress = Math.min(Math.max((y - start) / (end - start), 0), 1);
      const shift = startShift - travel * progress;
      rail.style.transform = `translateX(${shift}px)`;
    };

    window.removeEventListener("scroll", rail._roomsHandler || (() => {}));
    rail._roomsHandler = onScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  window.addEventListener("resize", compute);
  compute();
}

function setupOffersScroll() {
  const section = document.querySelector(".offers");
  const pin = document.querySelector(".offers-pin");
  const rail = document.querySelector(".offer-rail");
  const cards = rail ? Array.from(rail.querySelectorAll(".offer-card")) : [];
  if (!section || !pin || !rail || cards.length === 0) return;

  const compute = () => {
    const header = document.querySelector(".site-header");
    const headerH = header ? header.offsetHeight : 0;
    pin.style.top = `${headerH}px`;

    const viewport = window.innerWidth;
    const viewportH = window.innerHeight - headerH;
    const first = cards[0];
    const last = cards[cards.length - 1];
    const center = viewport / 2;

    const firstCenter = first.offsetLeft + first.offsetWidth / 2;
    const lastCenter = last.offsetLeft + last.offsetWidth / 2;

    const startShift = center - firstCenter;
    const endShift = center - lastCenter;
    const travel = startShift - endShift;

    section.style.minHeight = `${viewportH + Math.abs(travel) + headerH}px`;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const start = sectionTop - headerH;
    const scrollSpan = section.offsetHeight - viewportH;
    const end = start + scrollSpan;

    const onScroll = () => {
      const y = window.scrollY;
      const progress = Math.min(Math.max((y - start) / (end - start), 0), 1);
      const shift = startShift - travel * progress;
      rail.style.transform = `translateX(${shift}px)`;
    };

    window.removeEventListener("scroll", rail._offersHandler || (() => {}));
    rail._offersHandler = onScroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  window.addEventListener("resize", compute);
  compute();
}

function setupTestimonials() {
  const section = document.querySelector(".testimonials");
  if (!section) return;

  const titleEl = section.querySelector(".testimonial-title");
  const subtitleEl = section.querySelector(".testimonial-subtitle");
  const quoteEl = section.querySelector(".testimonial-quote");
  const prevBtn = section.querySelector(".testimonial-nav.prev");
  const nextBtn = section.querySelector(".testimonial-nav.next");

  const testimonials = [
    {
      title: "Minh Nhật & Lan Phương | Honeymoon Traveler (Hà Nội)",
      subtitle: "Hơn cả một kỳ nghỉ, đó là giấc mơ có thật.",
      quote:
        "Tôi đã đặt gói trăng mật và thực sự bất ngờ. Đội ngũ The Palm không chỉ đặt phòng, họ đã 'thiết kế' riêng cho vợ chồng tôi một bữa tối bí mật dưới ánh nến ngay trên bãi biển. Sự tinh tế và riêng tư tuyệt đối tại đây là điều mà chúng tôi chưa từng tìm thấy ở bất kỳ đâu khác.",
    },
    {
      title: "Gia đình chị Thu Hà | Family Vacation (TP. HCM)",
      subtitle: "Ngôi nhà thứ hai bên bờ biển Ông Lang",
      quote:
        "Hilltop Pool Villa là lựa chọn hoàn hảo cho cả nhà. Bọn trẻ mê mẩn hồ bơi riêng, còn vợ chồng tôi tìm thấy sự bình yên hiếm có khi ngắm hoàng hôn từ trên đồi. Điều ấn tượng nhất là sự tận tâm của nhân viên, họ chăm sóc từng bữa ăn cho các bé chu đáo như người thân trong gia đình.",
    },
    {
      title: "David & Sarah | International Travelers (Australia)",
      subtitle: "Tuyệt tác giấu mình giữa thiên nhiên",
      quote:
        "Chúng tôi đã dành tuần trăng mật tại Oceanfront Bungalow và thực sự không muốn rời đi. Cảm giác thức dậy với tiếng sóng vỗ ngay bên tai và ngắm hoàng hôn đỏ rực từ ban công riêng tư là một trải nghiệm siêu thực. Cảm ơn The Palm Hideaway đã kiến tạo nên những ký ức đẹp nhất cho khởi đầu mới của chúng tôi.",
    },
    {
      title: "Trần Quốc Thái | Architect (Đà Nẵng)",
      subtitle: "Không gian chữa lành thân - tâm - trí",
      quote:
        "Là một kiến trúc sư, tôi bị chinh phục hoàn toàn bởi cách resort nương tựa vào thiên nhiên. Không bê tông hóa, chỉ có gỗ, đá và những tán cây cổ thụ bao bọc lấy từng bungalow. Một nơi trốn hoàn hảo để tái tạo năng lượng và tìm lại sự cân bằng sau những dự án dài nơi phố thị.",
    },
  ];

  let current = 0;

  const setButtonState = (btn, enabled) => {
    if (!btn) return;
    btn.disabled = !enabled;
    btn.classList.toggle("is-disabled", !enabled);
  };

  const render = () => {
    const t = testimonials[current];
    if (titleEl) titleEl.textContent = t.title;
    if (subtitleEl) subtitleEl.textContent = t.subtitle;
    if (quoteEl) quoteEl.textContent = `"${t.quote}"`;

    setButtonState(prevBtn, current > 0);
    setButtonState(nextBtn, current < testimonials.length - 1);
  };

  prevBtn?.addEventListener("click", () => {
    if (current <= 0) return;
    current -= 1;
    render();
  });

  nextBtn?.addEventListener("click", () => {
    if (current >= testimonials.length - 1) return;
    current += 1;
    render();
  });

  render();
}

function setupMarqueeFill() {
  const tracks = document.querySelectorAll(
    ".marquee-track, .offers-track, .moment-track"
  );
  const fillOne = (track) => {
    const spans = Array.from(track.querySelectorAll("span"));
    if (!spans.length) return;
    const viewport = window.innerWidth;
    let total = track.scrollWidth;
    let i = 0;
    while (total < viewport * 2.2 && i < 20) {
      spans.forEach((span) => {
        const clone = span.cloneNode(true);
        track.appendChild(clone);
      });
      total = track.scrollWidth;
      i += 1;
    }
  };

  const fillAll = () => tracks.forEach((t) => fillOne(t));
  fillAll();
  window.addEventListener("resize", fillAll);
}

function setupRoomModal() {
  const modal = document.getElementById("room-modal");
  if (!modal) return;

  const modalImg = document.getElementById("room-modal-img");
  const modalTitle = document.getElementById("room-modal-title");
  const modalSub = document.getElementById("room-modal-sub");
  const modalMeta = document.getElementById("room-modal-meta");
  const modalPrice = document.getElementById("room-modal-price");
  const modalDetails = document.getElementById("room-modal-details");
  const modalBook = document.getElementById("room-modal-book");
  const closeBtn = modal.querySelector(".room-modal__close");
  const closeBtn2 = modal.querySelector(".room-modal__close-btn");
  const overlay = modal.querySelector(".room-modal__overlay");

  const roomDetails = {
    "Oceanfront Bungalow": {
      image: "Image/6.png",
      title: "Oceanfront Bungalow",
      sub: "Căn gỗ mộc sát biển, chỉ cách sóng nước vài bước chân.",
      meta: "45m² · 2 Người · Hướng biển",
      price: "Từ 2,500,000 VND/đêm",
      details: [
        "Phòng ngủ với giường king size",
        "Ban công riêng hướng biển",
        "Phòng tắm với bồn tắm ngoài trời",
        "Điều hòa và quạt trần",
        "Minibar đầy đủ tiện nghi",
        "WiFi miễn phí tốc độ cao"
      ]
    },
    "Hilltop Pool Villa": {
      image: "Image/5.png",
      title: "Hilltop Pool Villa",
      sub: "Biệt thự trên đồi với hồ bơi cực riêng tư, ôm trọn hoàng hôn.",
      meta: "120m² · 4 Người · Hồ bơi riêng",
      price: "Từ 5,800,000 VND/đêm",
      details: [
        "2 phòng ngủ với giường king size",
        "Hồ bơi riêng 25m²",
        "Sân thượng ngắm hoàng hôn",
        "Phòng khách rộng rãi",
        "Bếp đầy đủ tiện nghi",
        "Dịch vụ butler 24/7",
        "Xe đưa đón sân bay miễn phí"
      ]
    },
    "Garden Family Suite": {
      image: "Image/7.png",
      title: "Garden Family Suite",
      sub: "Không gian rộng rãi, ẩn mình giữa vườn dừa xanh mát, yên tĩnh tuyệt đối.",
      meta: "80m² · 4 Người · Hướng vườn",
      price: "Từ 3,200,000 VND/đêm",
      details: [
        "2 phòng ngủ riêng biệt",
        "Phòng khách và bếp nhỏ",
        "Sân vườn riêng tư",
        "Điều hòa và quạt trần",
        "TV màn hình phẳng",
        "WiFi miễn phí",
        "Phù hợp cho gia đình có trẻ em"
      ]
    },
    "Sky Panorama Suite": {
      image: "Image/8.png",
      title: "Sky Panorama Suite",
      sub: "Ban công rộng đón trọn vòm trời, tầm nhìn vịnh và thung lũng tre xanh trùng điệp.",
      meta: "68m² · 4 Người · View toàn cảnh",
      price: "Từ 4,500,000 VND/đêm",
      details: [
        "Phòng ngủ master với giường king",
        "Phòng ngủ phụ với 2 giường đơn",
        "Ban công rộng 15m²",
        "View toàn cảnh 360 độ",
        "Phòng tắm sang trọng",
        "Minibar và coffee maker",
        "Dịch vụ room service"
      ]
    },
    "Ocean Edge Villa": {
      image: "Image/9.png",
      title: "Ocean Edge Villa",
      sub: "Biệt thự vươn sát bờ đá, vài bước chạm tay vào sóng biển lấp lánh.",
      meta: "98m² · 2 Người · Đối diện biển",
      price: "Từ 6,200,000 VND/đêm",
      details: [
        "Phòng ngủ master view biển",
        "Hồ bơi vô cực riêng",
        "Sân hiên riêng tư",
        "Phòng tắm với bồn tắm ngoài trời",
        "Bếp đầy đủ tiện nghi",
        "Dịch vụ spa tại phòng",
        "Bữa sáng tại phòng miễn phí"
      ]
    }
  };

  const packageDetails = {
    "Honeymoon Package": {
      image: "Image/12.jpg",
      title: "Honeymoon Package",
      sub: "Kỳ Trăng Mật Ngọt Ngào",
      meta: "3 ngày 2 đêm · Oceanfront Bungalow",
      price: "Chỉ từ 8,500,000 VND",
      details: [
        "3 ngày 2 đêm tại Oceanfront Bungalow",
        "Bữa tối riêng tư trên bãi biển với ánh nến",
        "Liệu trình Spa đôi 90 phút",
        "Rượu vang chào mừng trong phòng",
        "Bữa sáng tại phòng miễn phí",
        "Trang trí phòng đặc biệt cho tuần trăng mật",
        "Dịch vụ tư vấn lịch trình riêng"
      ]
    },
    "Family Package": {
      image: "Image/13.jpg",
      title: "Family Package",
      sub: "Mùa Hè Gắn Kết",
      meta: "2 đêm · Garden Pool Villa 2 phòng ngủ",
      price: "Trọn gói 12,000,000 VND / 2 đêm",
      details: [
        "Kỳ nghỉ tại Biệt thự Garden Pool 2 phòng ngủ",
        "Tiệc nướng BBQ sân vườn cho cả gia đình",
        "Miễn phí giường phụ cho trẻ em",
        "Các hoạt động vui chơi cho bé (vẽ tranh, làm đồ thủ công)",
        "Bữa sáng buffet cho cả gia đình",
        "Dịch vụ trông trẻ (theo yêu cầu)",
        "Tặng kèm tour khám phá thiên nhiên cho trẻ em"
      ]
    },
    "Workation Retreat": {
      image: "Image/14.png",
      title: "Workation Retreat",
      sub: "Văn Phòng Bên Bờ Biển",
      meta: "Từ 7 đêm · Giảm 30%",
      price: "Chỉ từ 1,800,000 VND / đêm",
      details: [
        "Ưu đãi giảm 30% cho kỳ nghỉ dài hạn từ 7 đêm",
        "Wifi tốc độ cao riêng biệt (100Mbps)",
        "Miễn phí giặt ủi hằng ngày",
        "Cà phê không giới hạn tại quầy bar",
        "Không gian làm việc riêng tư tại phòng",
        "Bàn làm việc ergonomic và ghế thoải mái",
        "Dịch vụ in ấn và photocopy miễn phí",
        "Hỗ trợ setup video call với background view biển"
      ]
    }
  };

  const normalizeName = (name) => {
    return name.replace(/[''']/g, "'").trim();
  };

  const findItemInData = (name, data) => {
    const normalized = normalizeName(name);
    if (data[normalized]) {
      return { item: data[normalized], key: normalized };
    }
    const foundKey = Object.keys(data).find(key => {
      return normalizeName(key).toLowerCase() === normalized.toLowerCase();
    });
    if (foundKey) {
      return { item: data[foundKey], key: foundKey };
    }
    return null;
  };

  const openModal = (itemName, type = "room") => {
    let item, finalType;
    const normalized = normalizeName(itemName);
    
    if (type === "package") {
      const result = findItemInData(normalized, packageDetails);
      if (result) {
        item = result.item;
        finalType = "package";
      } else {
        const roomResult = findItemInData(normalized, roomDetails);
        if (roomResult) {
          item = roomResult.item;
          finalType = "room";
        } else {
          return;
        }
      }
    } else {
      const result = findItemInData(normalized, roomDetails);
      if (result) {
        item = result.item;
        finalType = "room";
      } else {
        const packageResult = findItemInData(normalized, packageDetails);
        if (packageResult) {
          item = packageResult.item;
          finalType = "package";
        } else {
          return;
        }
      }
    }

    modalImg.src = item.image;
    modalImg.alt = item.title;
    modalTitle.textContent = item.title;
    modalSub.textContent = item.sub;
    modalMeta.textContent = item.meta;
    modalPrice.textContent = item.price;

    const detailsTitle = finalType === "package" ? "Chi tiết gói" : "Tiện nghi phòng";
    modalDetails.innerHTML = `
      <h3>${detailsTitle}</h3>
      <ul>
        ${item.details.map(detail => `<li>${detail}</li>`).join("")}
      </ul>
    `;

    $(modal).fadeIn(300);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    $(modal).fadeOut(300);
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", closeModal);
  closeBtn2?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $(modal).is(":visible")) {
      closeModal();
    }
  });

  document.addEventListener("click", function(e) {
    const link = e.target.closest("a");
    
    if (link && link.textContent.trim() === "Xem thêm") {
      const roomCard = link.closest(".room-card");
      const offerCard = link.closest(".offer-card");
      const card = roomCard || offerCard;
      
      if (card) {
        const titleEl = card.querySelector("h3");
        if (titleEl) {
          const itemName = titleEl.textContent.trim();
          const type = offerCard ? "package" : "room";
          
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          openModal(itemName, type);
          return false;
        }
      }
    }
  }, true);
}

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupInView();
  setupBookingForm();
  setupContactForm();
  setupHeroSlider();
  setupIntroType();
  setupRoomsScroll();
  setupOffersScroll();
  setupTestimonials();
  setupMarqueeFill();
  setupRoomModal();

  // Mark sections for animation
    document.querySelectorAll(".card, .service-card, .room-card").forEach((el) => {
    el.classList.add("fade-up");
  });
});

