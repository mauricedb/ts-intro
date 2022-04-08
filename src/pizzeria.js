var formatCurrency = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
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
        ]
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
        ]
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
        ]
    },
    {
        name: 'Pizza Tomatoes',
        price: 10,
        imageUrl: './images/saahil-khatkhate-kfDsMDyX1K0-unsplash.jpg',
        imageCredit: 'Photo by Saahil Khatkhate on Unsplash',
        extras: [
            { name: 'Cheese', price: 0.5 },
            { name: 'Tomatoes', price: 0.5 },
        ]
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
        ]
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
        .filter(function (element) { return element.type === 'checkbox' && element.checked; })
        .map(function (element) { return element.value; });
    var extraToppings = pizza.extras.filter(function (extra) {
        return selectedExtraElements.includes(extra.name);
    });
    var price = extraToppings.reduce(function (acc, extra) { return acc + extra.price; }, pizza.price);
    var itemOrderd = {
        name: pizza.name,
        price: price,
        extras: extraToppings
    };
    order.push(itemOrderd);
    renderOrder();
}
function renderOrderTotal() {
    var orderTotalElement = document.getElementById('order-total');
    var totalPrice = order.reduce(function (acc, item) { return acc + item.price; }, 0);
    orderTotalElement.innerHTML = totalPrice;
}
function renderOrder() {
    var orderElement = document.getElementById('order');
    orderElement.innerHTML = order.length ? '' : 'No items in the order yet';
    for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
        orderItem = order_1[_i];
        var orderItemElement = document.createElement('li');
        orderItemElement.classList.add('list-group-item');
        orderItemElement.classList.add('d-flex');
        orderItemElement.classList.add('justify-content-between');
        orderItemElement.classList.add('align-items-start');
        var extraToppings = orderItem.extras.map(function (extra) { return "<li>".concat(extra.name, "</li>"); }).join('') ||
            '<li>No extras</li>';
        orderItemElement.innerHTML = "\n      <div class=\"ms-2 me-auto\">\n        <div class=\"fw-bold\">".concat(orderItem.name, "</div>\n        <ul>").concat(extraToppings, "</ul>\n      </div>\n      <span class=\"badge bg-primary rounded-pill\">").concat(formatCurrency(orderItem.price), "</span>\n  ");
        orderElement.appendChild(orderItemElement);
    }
    renderOrderTotal();
}
function renderExtraToppings(extras) {
    return extras
        .map(function (extra) {
        var id = crypto.randomUUID();
        return "\n<div class=\"form-check\">\n  <input class=\"form-check-input\" type=\"checkbox\" value=\"".concat(extra.name, "\" id=\"").concat(id, "\"/>\n  <label class=\"form-check-label\" for=\"").concat(id, "\">\n    ").concat(extra.name, " (+").concat(formatCurrency(extra.price), ")\n  </label>\n</div>");
    })
        .join('');
}
function renderPizza(pizza) {
    var extraToppings = renderExtraToppings(pizza.extras);
    var pizzaElement = document.createElement('article');
    pizzaElement.classList.add('card', 'mb-3');
    pizzaElement.innerHTML = "\n  <form onsubmit=\"addPizza(event)\">\n    <div class=\"row g-0\">\n      <div class=\"col-md-3\">\n        <img\n          class=\"img-fluid rounded-start\" \n          src=\"".concat(pizza.imageUrl, "\"\n          alt=\"").concat(pizza.name, "\"\n          title=\"").concat(pizza.imageCredit, "\"\n        />\n      </div>\n      <div class=\"col-md-9\">\n        <div class=\"card-body\">\n          <h5 class=\"card-title\">").concat(pizza.name, "</h5>\n          <h6 class=\"card-title float-end\">").concat(formatCurrency(pizza.price), "</h6>\n          <h6 class=\"mt-5\">Extra Toppings</h6>\n          ").concat(extraToppings, "\n          <button type=\"submit\" class=\"btn btn-primary\">Add</button>\n        </div>\n        \n      </div>\n    </div>\n  </form>");
    return pizzaElement;
}
function renderMenu() {
    var menuElement = document.getElementById('menu');
    menuElement.innerHTML = '';
    for (var _i = 0, pizzas_1 = pizzas; _i < pizzas_1.length; _i++) {
        pizza = pizzas_1[_i];
        var pizzaElement = renderPizza(pizza);
        var formElement = pizzaElement.querySelector('form');
        formToPizzaMap.set(formElement, pizza);
        menuElement.appendChild(pizzaElement);
    }
}
function renderCheckout() {
    document.getElementById('checkout-button').addEventListener('click', function () {
        var account = 1234567890;
        var amount = order.reduce(function (sum, item) { return sum + item.price; }, 0);
        checkout(amount, account);
    });
}
renderMenu();
renderOrder();
renderCheckout();
