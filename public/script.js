const categories = document.querySelectorAll(".category");
const productsDiv = document.querySelector(".products");
const productInfoDiv = document.querySelector(".product-info");
const orderFormDiv = document.querySelector(".orderform");
const orderSummaryDiv = document.querySelector(".order-summary");
const orderListDiv = document.querySelector(".order-list");
const orderSummaryDetailsDiv = document.querySelector("#order-summary-details");
const orderListUl = document.querySelector("#order-list-ul");
const orderForm = document.getElementById("order-form");
const citySelect = document.getElementById("city");
const cityOtherInput = document.getElementById("city-other");
const categoriesContainer = document.querySelector(".categories");
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function updateOrderList() {
  orderListUl.innerHTML = "";
  orders.forEach((order, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            Замовлення #${index + 1} - Дата: ${order.date}, Ціна: ${
      order.price
    } грн
            <button onclick="showOrderDetails(${index})">Деталі</button>
            <button onclick="deleteOrder(${index})">Видалити</button>
        `;
    orderListUl.appendChild(listItem);
  });
}

citySelect.addEventListener("change", () => {
  if (citySelect.value === "Інше місто") {
    cityOtherInput.style.display = "block";
    cityOtherInput.setAttribute("required", "required");
  } else {
    cityOtherInput.style.display = "none";
    cityOtherInput.removeAttribute("required");
  }
});

const categoriesData = {
  Ноутбуки: [
    "MacBook Air 2020 M1 512 Gb Space Gray",
    "MacBook Air 2022 M2 512 Gb Space Gray",
  ],
  Смартфони: [
    "iPhone 14 Pro 128Gb Purple",
    "iPhone 14 Pro 256Gb Gold",
    "iPhone 14 Pro 512Gb Silver",
  ],
  Планшети: ["iPad 10.2 128 Gb Silver", "iPad 10.2 256 Gb Gold"],
};

const productInfoData = {
  "MacBook Air 2020 M1 512 Gb Space Gray": {
    name: "MacBook Air 2020 M1 512 Gb Space Gray",
    price: 39999,
  },
  "MacBook Air 2022 M2 512 Gb Space Gray": {
    name: "MacBook Air 2022 M2 512 Gb Space Gray",
    price: 63999,
  },
  "iPhone 14 Pro 128Gb Purple": {
    name: "iPhone 14 Pro 128Gb Purple",
    price: 44999,
  },
  "iPhone 14 Pro 256Gb Gold": {
    name: "iPhone 14 Pro 256Gb Gold",
    price: 47999,
  },
  "iPhone 14 Pro 512Gb Silver": {
    name: "iPhone 14 Pro 512Gb Silver",
    price: 49999,
  },
  "iPad 10.2 128 Gb Silver": {
    name: "iPad 10.2 128 Gb Silver",
    price: 13999,
  },
  "iPad 10.2 256 Gb Gold": {
    name: "iPad 10.2 256 Gb Gold",
    price: 15999,
  },
};

categoriesContainer.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("category")) {
    categories.forEach((item) => {
      if (item == e.target) {
        displayProducts(item.textContent);
      }
    });
  }
});

function displayProducts(categoryName) {
  productsDiv.innerHTML = "";

  const productList = categoriesData[categoryName];
  if (productList) {
    productList.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.textContent = product;
      productItem.classList.add("product-item");
      productsDiv.appendChild(productItem);
      productsDiv.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("product-item")) {
          productList.forEach((item) => {
            if (item == e.target.textContent) {
              displayProductInfo(item);
            }
          });
        }
      });
      productsDiv.appendChild(productItem);
    });
  }
}

function displayProductInfo(productName) {
  productInfoDiv.innerHTML = "";

  const productInfo = productInfoData[productName];
  if (productInfo) {
    const productInfoItem = document.createElement("div");
    productInfoItem.innerHTML = `
            <h3>${productInfo.name}</h3>
            <p>Ціна: ${productInfo.price} грн</p>
            <button onclick="showOrderForm('${productInfo.name}', ${productInfo.price})">Купити</button>
        `;
    productInfoDiv.appendChild(productInfoItem);
  }
}

function showOrderForm(productName, productPrice) {
  const productInfo = productInfoData[productName];
  if (productInfo) {
    const orderFormProductName = document.createElement("input");
    orderFormProductName.type = "hidden";
    orderFormProductName.name = "product-name";
    orderFormProductName.value = productName;
    orderForm.appendChild(orderFormProductName);

    const categoriesDiv = document.querySelector(".categories");
    const productsDiv = document.querySelector(".products");
    const productInfoDiv = document.querySelector(".product-info");
    categoriesDiv.style.display = "none";
    productsDiv.style.display = "none";
    productInfoDiv.style.display = "none";

    orderFormDiv.style.display = "block";
  }
}

function showOrderDetails(orderIndex) {
  const order = orders[orderIndex];
  if (order) {
    const orderDetails = `
            <p><strong>Замовлення #${orderIndex + 1}</strong></p>
            <p><strong>Дата:</strong> ${order.date}</p>
            <p><strong>Продукт:</strong> ${order.productName}</p>
            <p><strong>ПІБ покупця:</strong> ${order.customerName}</p>
            <p><strong>Місто:</strong> ${order.city}</p>
            <p><strong>Склад Нової пошти:</strong> ${order.deliveryPoint}</p>
            <p><strong>Спосіб оплати:</strong> ${order.paymentMethod}</p>
            <p><strong>Кількість:</strong> ${order.quantity}</p>
            <p><strong>Коментар:</strong> ${order.comment}</p>
        `;

    orderSummaryDetailsDiv.innerHTML = orderDetails;
    orderFormDiv.style.display = "none";
    orderSummaryDiv.style.display = "block";
  }
}

function deleteOrder(orderIndex) {
  orders.splice(orderIndex, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  updateOrderList();
}

orderForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formElements = orderForm.elements;

  if (orderForm.checkValidity()) {
    const customerName = formElements["customer-name"].value;
    const city = formElements["city"].value;
    const deliveryPoint = formElements["delivery-point"].value;
    const paymentMethod = formElements["payment-method"].value;
    const quantity = parseInt(formElements["quantity"].value);
    const comment = formElements["comment"].value;
    const productName = formElements["product-name"].value;
    const otherCity = formElements["city-other"].value;

    const date = new Date().toLocaleDateString();
    const price = productInfoData[productName].price * quantity;

    const order = {
      date,
      productName,
      customerName,
      city: city === "Інше місто" ? otherCity : city,
      deliveryPoint,
      paymentMethod,
      quantity,
      comment,
      price,
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    updateOrderList();

    const orderSummary = `
        <p><strong>Продукт:</strong> ${productName}</p>
        <p><strong>ПІБ покупця:</strong> ${customerName}</p>
        <p><strong>Місто:</strong> ${
          city === "Інше місто" ? otherCity : city
        }</p>
        <p><strong>Склад Нової пошти:</strong> ${deliveryPoint}</p>
        <p><strong>Спосіб оплати:</strong> ${paymentMethod}</p>
        <p><strong>Кількість:</strong> ${quantity}</p>
        <p><strong>Коментар:</strong> ${comment}</p>
    `;

    orderSummaryDetailsDiv.innerHTML = orderSummary;
    orderFormDiv.style.display = "none";
    orderSummaryDiv.style.display = "block";
  }
});

updateOrderList();
function showOrderList(arg) {
  let noneVal = "none";
  let blockVal = "block";

  const categoriesDiv = document.querySelector(".categories");
  const productsDiv = document.querySelector(".products");
  const productInfoDiv = document.querySelector(".product-info");

  if (arg === "hide") {
    noneVal = "block";
    blockVal = "none";
  } else if (arg === "show") {
    orderFormDiv.style.display = noneVal;
    orderSummaryDiv.style.display = noneVal;
  }

  categoriesDiv.style.display = noneVal;
  productsDiv.style.display = noneVal;
  productInfoDiv.style.display = noneVal;
  orderListDiv.style.display = blockVal;
}

updateOrderList();
let count = false;

document.getElementById("my-orders-btn").addEventListener("click", () => {
  if (count) {
    showOrderList("hide");
  } else {
    showOrderList("show");
  }
  count = !count;
});
