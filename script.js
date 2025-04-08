const productos = [
  { nombre: 'Zapatillas Urbanas', precio: 39990, categoria: 'zapatos', imagen: 'images/zapatillas.jpg' },
  { nombre: 'Zapatos Cuero', precio: 59990, categoria: 'zapatos', imagen: 'images/zapatos-cuero.jpg' },
  { nombre: 'Botines Deportivos', precio: 49990, categoria: 'zapatos', imagen: 'images/botines.jpg' },
  { nombre: 'Polera Blanca', precio: 14990, categoria: 'poleras', imagen: 'images/polera-blanca.jpg' },
  { nombre: 'Polera Negra', precio: 16990, categoria: 'poleras', imagen: 'images/polera-negra.jpg' },
  { nombre: 'Polera Diseño', precio: 18990, categoria: 'poleras', imagen: 'images/polera-diseno.jpg' },
  { nombre: 'Gorro Invierno', precio: 9990, categoria: 'gorros', imagen: 'images/gorro-invierno.jpg' },
  { nombre: 'Gorro Deportivo', precio: 11990, categoria: 'gorros', imagen: 'images/gorro-deportivo.jpg' },
  { nombre: 'Gorro Estilo', precio: 12990, categoria: 'gorros', imagen: 'images/gorro-estilo.jpg' }
];

const contenedor = document.getElementById('productos');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total');
const modal = document.getElementById('modal-carrito');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

productos.forEach(prod => {
  const div = document.createElement('div');
  div.className = 'producto';
  div.setAttribute('data-categoria', prod.categoria);
  div.innerHTML = `
    <img src="${prod.imagen}" alt="${prod.nombre}">
    <h3>${prod.nombre}</h3>
    <p>$${prod.precio.toLocaleString()}</p>
    <button onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})">Agregar</button>
  `;
  contenedor.appendChild(div);
});

function actualizarContador() {
  document.getElementById('contador-carrito').textContent = carrito.length;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  actualizarContador();
  renderCarrito();
}

function renderCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;
  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.nombre} - $${item.precio.toLocaleString()} <button onclick="eliminarDelCarrito(${index})">Eliminar</button>`;
    listaCarrito.appendChild(li);
    total += item.precio;
  });
  totalCarrito.textContent = `Total: $${total.toLocaleString()}`;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarContador();
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  actualizarContador();
  renderCarrito();
}

function mostrarModalCarrito() {
  modal.style.display = 'block';
  renderCarrito();
}

function cerrarModalCarrito() {
  modal.style.display = 'none';
}

window.onclick = function (event) {
  if (event.target === modal) {
    cerrarModalCarrito();
  }
}

function aplicarFiltros() {
  const texto = document.getElementById('buscador').value.toLowerCase();
  const categoria = document.getElementById('filtro').value;

  document.querySelectorAll('.producto').forEach(prod => {
    const nombre = prod.querySelector('h3').textContent.toLowerCase();
    const cat = prod.getAttribute('data-categoria');
    const matchText = nombre.includes(texto);
    const matchCat = categoria === 'todos' || cat === categoria;
    prod.style.display = (matchText && matchCat) ? '' : 'none';
  });
}

document.getElementById('buscador').addEventListener('input', aplicarFiltros);
document.getElementById('filtro').addEventListener('change', aplicarFiltros);

actualizarContador();

paypal.Buttons({
  createOrder: function (data, actions) {
    const total = carrito.reduce((sum, item) => sum + item.precio, 0) / 1000;
    return actions.order.create({
      purchase_units: [{ amount: { value: total.toFixed(2) } }]
    });
  },
  onApprove: function (data, actions) {
    return actions.order.capture().then(function (details) {
      alert('Pago realizado por ' + details.payer.name.given_name);
      vaciarCarrito();
      cerrarModalCarrito();
    });
  }
}).render('#paypal-button-container');
