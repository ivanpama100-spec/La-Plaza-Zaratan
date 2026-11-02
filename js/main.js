(() => {
  const business = window.BUSINESS;
  document.querySelectorAll("[data-phone]").forEach(link => {
    link.href = business.phoneLink;
    if (link.classList.contains("footer-phone") || link.closest(".contact-detail")) link.textContent = business.phoneDisplay;
  });
  document.querySelectorAll("[data-maps]").forEach(link => link.href = business.mapsUrl);
  document.querySelectorAll("[data-address]").forEach(link => link.innerHTML = business.address.replace(", 47610", "<br>47610"));
  const menuList = document.querySelector("#menu-list");
  const searchInput = document.querySelector("#menu-search");
  const filterButtons = [...document.querySelectorAll(".menu-filter")];
  let activeCategory = "Todos";
  const renderMenu = () => {
    const query = searchInput.value.trim().toLocaleLowerCase("es");
    const items = window.MENU_DATA.filter(item => item.status === "confirmed")
      .filter(item => activeCategory === "Todos" || item.category === activeCategory)
      .filter(item => `${item.name} ${item.description || ""} ${item.category}`.toLocaleLowerCase("es").includes(query));
    menuList.replaceChildren();
    const groups = [...new Set(items.map(item => item.category))];
    groups.forEach(category => {
      const section = document.createElement("section"); section.className = "menu-group";
      const heading = document.createElement("h3"); heading.className = "menu-group-title"; heading.textContent = category; section.append(heading);
      const grid = document.createElement("div"); grid.className = "menu-items-grid";
      items.filter(item => item.category === category).forEach(item => {
        const card = document.createElement("article"); card.className = item.image ? "menu-card has-image" : "menu-card no-image";
        if (item.image) {
          const media = document.createElement("div"); media.className = "menu-card-media";
          const image = document.createElement("img"); image.src = item.image; image.alt = item.imageAlt || `Imagen de referencia: ${item.name}`; image.loading = "lazy"; image.width = 800; image.height = 520;
          const badge = document.createElement("span"); badge.className = "menu-image-badge"; badge.textContent = "Imagen de referencia"; media.append(image, badge); card.append(media);
        }
        const body = document.createElement("div"); body.className = "menu-card-body";
        const title = document.createElement("h4"); title.textContent = item.name; body.append(title);
        if (item.description) { const description = document.createElement("p"); description.className = "menu-card-description"; description.textContent = item.description; body.append(description); }
        const prices = document.createElement("div"); prices.className = "menu-prices";
        item.prices.forEach(priceItem => {
          const priceLine = document.createElement("div"); priceLine.className = "menu-price-line";
          const label = document.createElement("span"); label.textContent = priceItem.label;
          const value = document.createElement("strong"); value.textContent = priceItem.value;
          priceLine.append(label, value); prices.append(priceLine);
        });
        body.append(prices); card.append(body); grid.append(card);
      });
      section.append(grid); menuList.append(section);
    });
    if (!items.length) {
      const note = document.createElement("p"); note.className = "menu-empty";
      note.textContent = "No hay resultados con esa búsqueda. Prueba otro nombre o cambia la categoría.";
      menuList.append(note);
    }
  };
  searchInput.addEventListener("input", renderMenu);
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    filterButtons.forEach(filter => { const selected = filter === button; filter.classList.toggle("is-active", selected); filter.setAttribute("aria-pressed", String(selected)); });
    renderMenu();
  }));
  renderMenu();
  const specialties = document.querySelector("#specialty-grid");
  window.SPECIALTIES.forEach((item, index) => {
    const card = document.createElement("article"); card.className = "specialty-card";
    const photo = document.createElement("div"); photo.className = "image-frame specialty-photo";
    const image = document.createElement("img"); image.src = item.image; image.alt = item.alt; image.loading = "lazy"; image.width = 800; image.height = 900;
    const number = document.createElement("span"); number.className = "specialty-number"; number.setAttribute("aria-hidden", "true"); number.textContent = String(index + 1).padStart(2, "0"); photo.append(image, number);
    const imageNote = document.createElement("span"); imageNote.className = "image-note"; imageNote.textContent = "Imagen recibida · confirmar"; photo.append(imageNote);
    const title = document.createElement("h3"); title.textContent = item.title;
    const description = document.createElement("p"); description.textContent = item.text;
    const link = document.createElement("a"); link.href = "#carta"; link.append(document.createTextNode("Consultar carta "));
    const arrow = document.createElement("span"); arrow.setAttribute("aria-hidden", "true"); arrow.textContent = "→"; link.append(arrow);
    card.append(photo, title, description, link); specialties.append(card);
  });
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const closeNav = () => { toggle.setAttribute("aria-expanded", "false"); toggle.querySelector(".sr-only").textContent = "Abrir menú"; nav.classList.remove("is-open"); };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.querySelector(".sr-only").textContent = open ? "Abrir menú" : "Cerrar menú";
    nav.classList.toggle("is-open", !open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", event => { if (event.key === "Escape") { closeNav(); toggle.focus(); } });
  document.querySelector("#year").textContent = new Date().getFullYear();
  if (business.canonicalUrl) {
    const canonical = document.createElement("link"); canonical.rel = "canonical"; canonical.href = business.canonicalUrl; document.head.append(canonical);
  }
})();
