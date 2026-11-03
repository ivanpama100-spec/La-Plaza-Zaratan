(() => {
  const business = window.BUSINESS;

  document.querySelectorAll("[data-phone]").forEach((link) => {
    link.href = business.phoneLink;
    if (link.classList.contains("footer-phone") || link.closest(".contact-detail")) {
      link.textContent = business.phoneDisplay;
    }
  });

  document.querySelectorAll("[data-maps]").forEach((link) => {
    link.href = business.mapsUrl;
  });

  document.querySelectorAll("[data-address]").forEach((link) => {
    const address = business.structuredAddress;
    link.replaceChildren(
      document.createTextNode(address.streetAddress),
      document.createElement("br"),
      document.createTextNode(
        `${address.postalCode} ${address.addressLocality}, ${address.addressRegion}`,
      ),
    );
  });

  const addMeta = (property, content) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.append(meta);
    }
    meta.content = content;
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: business.name,
    telephone: business.phoneLink.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      ...business.structuredAddress,
    },
    hasMap: business.mapsUrl,
  };
  let canonicalBase = null;
  if (business.canonicalUrl) {
    try {
      canonicalBase = new URL(business.canonicalUrl);
      if (!canonicalBase.pathname.endsWith("/")) canonicalBase.pathname += "/";
    } catch {
      canonicalBase = null;
    }
  }
  if (canonicalBase) {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = business.canonicalUrl;
    document.head.append(canonical);
    localBusinessSchema.url = business.canonicalUrl;
    localBusinessSchema["@id"] = `${business.canonicalUrl}#business`;
    addMeta("og:url", business.canonicalUrl);
    addMeta(
      "og:image",
      new URL("assets/images/tabla-abaceria.jpg", canonicalBase).href,
    );
    addMeta("og:image:alt", "Tabla variada para compartir en La Plaza Zaratán");
  }
  const schemaScript = document.createElement("script");
  schemaScript.type = "application/ld+json";
  schemaScript.textContent = JSON.stringify(localBusinessSchema);
  document.head.append(schemaScript);

  const review = business.reviews;
  if (review) {
    const rating = document.querySelector("[data-review-rating]");
    const count = document.querySelector("[data-review-count]");
    const summary = document.querySelector(".reviews-summary");
    const source = document.querySelector("[data-review-source]");
    const scoreGroup = document.querySelector(".review-score");
    const topics = document.querySelector("#review-topics");

    if (rating) rating.textContent = review.rating;
    if (count) count.textContent = review.countLabel;
    if (summary) summary.textContent = review.summary;
    if (source) source.textContent = `${review.sourceNote} Consulta: ${review.checkedAt}.`;
    if (scoreGroup) {
      scoreGroup.setAttribute(
        "aria-label",
        `Valoración de Google: ${review.rating} sobre 5 y ${review.countLabel.toLowerCase()}`,
      );
    }
    if (topics) {
      topics.replaceChildren(
        ...review.topics.map((topic) => {
          const item = document.createElement("li");
          item.textContent = topic;
          return item;
        }),
      );
    }
  }

  const menuList = document.querySelector("#menu-list");
  const searchInput = document.querySelector("#menu-search");
  const resultCount = document.querySelector("#menu-result-count");
  const filterButtons = [...document.querySelectorAll(".menu-filter")];
  let activeCategory = "Todos";

  const normalizeSearch = (value) =>
    value
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es");

  const renderMenu = () => {
    if (!menuList || !searchInput) return;

    const query = normalizeSearch(searchInput.value);
    const items = window.MENU_DATA.filter((item) => item.status === "confirmed")
      .filter((item) => activeCategory === "Todos" || item.category === activeCategory)
      .filter((item) =>
        normalizeSearch(
          `${item.name} ${item.description || ""} ${item.category}`,
        ).includes(query),
      );

    menuList.replaceChildren();
    if (resultCount) {
      resultCount.textContent = `${items.length} ${items.length === 1 ? "plato encontrado" : "platos encontrados"}.`;
    }

    const categories = [...new Set(items.map((item) => item.category))];
    categories.forEach((category) => {
      const section = document.createElement("section");
      section.className = "menu-group";

      const heading = document.createElement("h3");
      heading.className = "menu-group-title";
      heading.textContent = category;
      section.append(heading);

      const grid = document.createElement("div");
      grid.className = "menu-items-grid";

      items
        .filter((item) => item.category === category)
        .forEach((item) => {
          const card = document.createElement("article");
          card.className = "menu-card";

          const body = document.createElement("div");
          body.className = "menu-card-body";

          const title = document.createElement("h4");
          title.textContent = item.name;
          body.append(title);

          if (item.description) {
            const description = document.createElement("p");
            description.className = "menu-card-description";
            description.textContent = item.description;
            body.append(description);
          }

          const prices = document.createElement("div");
          prices.className = "menu-prices";
          item.prices.forEach((priceItem) => {
            const priceLine = document.createElement("div");
            priceLine.className = "menu-price-line";

            const label = document.createElement("span");
            label.textContent = priceItem.label;

            const value = document.createElement("strong");
            value.textContent = priceItem.value;

            priceLine.append(label, value);
            prices.append(priceLine);
          });

          body.append(prices);
          card.append(body);
          grid.append(card);
        });

      section.append(grid);
      menuList.append(section);
    });

    if (items.length === 0) {
      const note = document.createElement("p");
      note.className = "menu-empty";
      note.textContent = "No hay resultados. Prueba otro nombre o cambia la categoría.";
      menuList.append(note);
    }
  };

  if (searchInput) searchInput.addEventListener("input", renderMenu);
  filterButtons.forEach((button) =>
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      filterButtons.forEach((filter) => {
        const selected = filter === button;
        filter.classList.toggle("is-active", selected);
        filter.setAttribute("aria-pressed", String(selected));
      });
      renderMenu();
    }),
  );
  renderMenu();

  const specialties = document.querySelector("#specialty-grid");
  if (specialties) {
    window.SPECIALTIES.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "specialty-card";

      const photo = document.createElement("div");
      photo.className = "image-frame specialty-photo";

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.alt;
      image.loading = "lazy";
      image.decoding = "async";
      image.width = item.imageWidth || 800;
      image.height = item.imageHeight || 900;
      image.addEventListener("error", () => photo.classList.add("image-unavailable"), { once: true });

      const number = document.createElement("span");
      number.className = "specialty-number";
      number.setAttribute("aria-hidden", "true");
      number.textContent = String(index + 1).padStart(2, "0");

      const imageNote = document.createElement("span");
      imageNote.className = "image-note";
      imageNote.textContent = "Imagen recibida · confirmar";
      photo.append(image, number, imageNote);

      const title = document.createElement("h3");
      title.textContent = item.title;

      const description = document.createElement("p");
      description.textContent = item.text;

      const link = document.createElement("a");
      link.href = "#carta";
      link.append(document.createTextNode("Consultar carta "));

      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      link.append(arrow);

      card.append(photo, title, description, link);
      specialties.append(card);
    });
  }

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  if (toggle && nav) {
    const closeNav = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector(".sr-only").textContent = "Abrir menú";
      nav.classList.remove("is-open");
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.querySelector(".sr-only").textContent = open ? "Abrir menú" : "Cerrar menú";
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        toggle.focus();
      }
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
