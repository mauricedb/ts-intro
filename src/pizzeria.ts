const formatCurrency = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
}).format;

interface Pizza {
  name: string;
  price: number;
  imageUrl: string;
  imageCredit: string;
  extras: ExtraIngredient[];
}

interface ExtraIngredient {
  name: string;
  price: number;
}

interface OrderItem {
  name: string;
  price: number;
  extras: ExtraIngredient[];
}

const order: OrderItem[] = [];
const formToPizzaMap = new WeakMap<HTMLElement, Pizza>();
const pizzas: Pizza[] = [
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
    price: 13.5,
    imageUrl: './images/saundarya-srinivasan-60nzTP7_hMQ-unsplash.jpg',
    imageCredit: 'Photo by Saundarya Srinivasan on Unsplash',
    extras: [
      { name: 'Cheese', price: 0.5 },
      { name: 'Tomatoes', price: 0.5 },
      { name: 'Mushroom', price: 0.6 },
    ],
  },
];

interface MyHTMLDialogElement extends HTMLElement {
  showModal: Function;
}

function checkout(amount, account) {
  document.getElementById('checkout-amount').innerText = formatCurrency(amount);
  document.getElementById('checkout-account').innerText = account;
  (
    document.getElementById('checkout-dialog') as MyHTMLDialogElement
  ).showModal();
}

function addPizza(e: SubmitEvent) {
  e.preventDefault();

  const formElement = e.target as HTMLFormElement;
  const pizza = formToPizzaMap.get(formElement);
  const formInputElements = Array.from(
    formElement.elements
  ) as HTMLInputElement[];

  const selectedExtraElements = formInputElements
    .filter((element) => element.type === 'checkbox' && element.checked)
    .map((element) => element.value);

  const extraToppings = pizza.extras.filter((extra) =>
    selectedExtraElements.includes(extra.name)
  );
  const price = extraToppings.reduce(
    (acc, extra) => acc + extra.price,
    pizza.price
  );

  const itemOrderd: OrderItem = {
    name: pizza.name,
    price: price,
    extras: extraToppings,
  };

  order.push(itemOrderd);

  renderOrder();
}

function renderOrderTotal() {
  const orderTotalElement = document.getElementById('order-total');
  const totalPrice = order.reduce((acc, item) => acc + item.price, 0);
  orderTotalElement.innerHTML = formatCurrency(totalPrice);
}

function renderOrder() {
  const orderElement = document.getElementById('order');
  orderElement.innerHTML = order.length ? '' : 'No items in the order yet';

  for (const orderItem of order) {
    const orderItemElement = document.createElement('li');
    orderItemElement.classList.add('list-group-item');
    orderItemElement.classList.add('d-flex');
    orderItemElement.classList.add('justify-content-between');
    orderItemElement.classList.add('align-items-start');

    const extraToppings =
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
      const id = crypto.randomUUID();

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
  const extraToppings = renderExtraToppings(pizza.extras);

  const pizzaElement = document.createElement('article');
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
  const menuElement = document.getElementById('menu');
  menuElement.innerHTML = '';

  for (const pizza of pizzas) {
    const pizzaElement = renderPizza(pizza);
    const formElement = pizzaElement.querySelector('form');
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
