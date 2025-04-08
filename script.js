const productos = [
  {
    nombre: 'Zapatillas Urbanas',
    precio: 39990,
    categoria: 'zapatos',
    imagen: 'https://images.unsplash.com/photo-1618354691361-dc5872ef85b3?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Zapatos Cuero',
    precio: 59990,
    categoria: 'zapatos',
    imagen: 'https://images.unsplash.com/photo-1584942532218-d042a6aeb3d0?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Botines Deportivos',
    precio: 49990,
    categoria: 'zapatos',
    imagen: 'https://images.unsplash.com/photo-1606816272193-d8ab38aa17f4?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Polera Blanca',
    precio: 14990,
    categoria: 'poleras',
    imagen: 'https://images.unsplash.com/photo-1542062703-3a6f2b160f18?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Polera Negra',
    precio: 16990,
    categoria: 'poleras',
    imagen: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Polera Diseño',
    precio: 18990,
    categoria: 'poleras',
    imagen: 'https://images.unsplash.com/photo-1616594039964-dbd622ff4685?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Gorro Invierno',
    precio: 9990,
    categoria: 'gorros',
    imagen: 'https://images.unsplash.com/photo-1578687286623-5f70d8c70d90?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Gorro Deportivo',
    precio: 11990,
    categoria: 'gorros',
    imagen: 'https://images.unsplash.com/photo-1605741014760-7c6c974f30da?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Gorro Estilo',
    precio: 12990,
    categoria: 'gorros',
    imagen: 'https://images.unsplash.com/photo-1606813909227-1fe1d8e11fc4?auto=format&fit=crop&w=400&q=80'
  }
];

const contenedor = document.getElementById('productos');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total');
const modal = document.getElementById('modal-carrito');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderProductos() {
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
}

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

window.onclick = function(event) {
  if (event.target == modal) {
    cerrarModalCarrito();
  }
}

renderProductos();
actualizarContador();

// PayPal pago simulado
paypal.Buttons({
  createOrder: function(data, actions) {
    const total = carrito.reduce((sum, item) => sum + item.precio, 0) / 1000;
    return actions.order.create({
      purchase_units: [{ amount: { value: total.toFixed(2) } }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Pago realizado por ' + details.payer.name.given_name);
      vaciarCarrito();
      cerrarModalCarrito();
    });
  }
}).render('#paypal-button-container');
