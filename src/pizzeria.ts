var formatCurrency = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
}).format;

var order = [];
var formToPizzaMap = new WeakMap();
var pizzas = [
  {
    name: 'Pepperoni Pizza',
    price: 14.5,
    imageUrl: './images/fernando-andrade-_P76trHTWDE-unsplash.jpg',
    imageCredit: 'Photo by Fernando Andrade on Unsplash',
    extras: [
      { name: 'Cheese', price: 0.5 },
      { name: 'Pepperoni', price: 0.75 },
    ],
  },
  {
    name: 'Green and red bell pepper and cheese',
    price: 12.5,
    imageUrl: './images/foad-roshan-Y6OgisiGBjM-unsplash.jpg',
    imageCredit: 'Photo by Foad Roshan on Unsplash',
    extras: [
      { name: 'Cheese', price: 0.5 },
      { name: 'Pepperoni', price: 0.75 },
      { name: 'Green and red bell pepper', price: 0.5 },
    ],
  },
  {
    name: 'Pizza with Olives',
    price: 12,
    imageUrl: './images/rahul-upadhyay-yDKHJxfiWDk-unsplash.jpg',
    imageCredit: 'Photo by Rahul Upadhyay on Unsplash',
    extras: [
      { name: 'Cheese', price: 0.5 },
      { name: 'Tomatoes', price: 0.5 },
      { name: 'Olives', price: 0.6 },
    ],
  },
  {
    name: 'Pizza Tomatoes',
    price: 10,
    imageUrl: './images/saahil-khatkhate-kfDsMDyX1K0-unsplash.jpg',
    imageCredit: 'Photo by Saahil Khatkhate on Unsplash',
    extras: [
      { name: 'Cheese', price: 0.5 },
      { name: 'Tomatoes', price: 0.5 },
    ],
  },
  {
    name: 'Pizza with Spinache',
    price: '13.5',
    imageUrl: './images/saundarya-srinivasan-60nzTP7_hMQ-unsplash.jpg',
    imageCredit: 'Photo by Saundarya Srinivasan on Unsplash',
    extras: [
      { name: 'Cheese', price: 0.5 },
      { name: 'Tomatoes', price: 0.5 },
      { name: 'Mushroom', price: 0.6 },
    ],
  },
];

function checkout(amount, account) {
  document.getElementById('checkout-amount').innerText = formatCurrency(amount);
  document.getElementById('checkout-account').innerText = account;
  document.getElementById('checkout-dialog').showModal();
}

function addPizza(e) {
  e.preventDefault();

  var formElement = e.srcElement;
  var pizza = formToPizzaMap.get(formElement);
  var formInputElements = Array.from(formElement.elements);

  var selectedExtraElements = formInputElements
    .filter((element) => element.type === 'checkbox' && element.checked)
    .map((element) => element.value);

  var extraToppings = pizza.extras.filter((extra) =>
    selectedExtraElements.includes(extra.name)
  );
  var price = extraToppings.reduce(
    (acc, extra) => acc + extra.price,
    pizza.price
  );

  var itemOrderd = {
    name: pizza.name,
    price: price,
    extras: extraToppings,
  };

  order.push(itemOrderd);

  renderOrder();
}

function renderOrderTotal() {
  var orderTotalElement = document.getElementById('order-total');
  var totalPrice = order.reduce((acc, item) => acc + item.price, 0);
  orderTotalElement.innerHTML = totalPrice;
}

function renderOrder() {
  var orderElement = document.getElementById('order');
  orderElement.innerHTML = order.length ? '' : 'No items in the order yet';

  for (orderItem of order) {
    var orderItemElement = document.createElement('li');
    orderItemElement.classList.add('list-group-item');
    orderItemElement.classList.add('d-flex');
    orderItemElement.classList.add('justify-content-between');
    orderItemElement.classList.add('align-items-start');

    var extraToppings =
      orderItem.extras.map((extra) => `<li>${extra.name}</li>`).join('') ||
      '<li>No extras</li>';

    orderItemElement.innerHTML = `
      <div class="ms-2 me-auto">
        <div class="fw-bold">${orderItem.name}</div>
        <ul>${extraToppings}</ul>
      </div>
      <span class="badge bg-primary rounded-pill">${formatCurrency(
        orderItem.price
      )}</span>
  `;

    orderElement.appendChild(orderItemElement);
  }

  renderOrderTotal();
}

function renderExtraToppings(extras) {
  return extras
    .map((extra) => {
      var id = crypto.randomUUID();

      return `
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="${
    extra.name
  }" id="${id}"/>
  <label class="form-check-label" for="${id}">
    ${extra.name} (+${formatCurrency(extra.price)})
  </label>
</div>`;
    })
    .join('');
}

function renderPizza(pizza) {
  var extraToppings = renderExtraToppings(pizza.extras);

  var pizzaElement = document.createElement('article');
  pizzaElement.classList.add('card', 'mb-3');
  pizzaElement.innerHTML = `
  <form onsubmit="addPizza(event)">
    <div class="row g-0">
      <div class="col-md-3">
        <img
          class="img-fluid rounded-start" 
          src="${pizza.imageUrl}"
          alt="${pizza.name}"
          title="${pizza.imageCredit}"
        />
      </div>
      <div class="col-md-9">
        <div class="card-body">
          <h5 class="card-title">${pizza.name}</h5>
          <h6 class="card-title float-end">${formatCurrency(pizza.price)}</h6>
          <h6 class="mt-5">Extra Toppings</h6>
          ${extraToppings}
          <button type="submit" class="btn btn-primary">Add</button>
        </div>
        
      </div>
    </div>
  </form>`;

  return pizzaElement;
}

function renderMenu() {
  var menuElement = document.getElementById('menu');
  menuElement.innerHTML = '';

  for (pizza of pizzas) {
    var pizzaElement = renderPizza(pizza);
    var formElement = pizzaElement.querySelector('form');
    formToPizzaMap.set(formElement, pizza);

    menuElement.appendChild(pizzaElement);
  }
}

function renderCheckout() {
  document.getElementById('checkout-button').addEventListener('click', () => {
    const account = 1234567890;
    const amount = order.reduce((sum, item) => sum + item.price, 0);

    checkout(amount, account);
  });
}

renderMenu();
renderOrder();
renderCheckout();