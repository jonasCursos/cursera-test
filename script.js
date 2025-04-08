let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const botones = document.querySelectorAll('.producto button');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total');

// Agregar producto al carrito
botones.forEach(boton => {
  boton.addEventListener('click', () => {
    const producto = boton.closest('.producto');
    const nombre = producto.querySelector('h3').textContent;
    const precioTexto = producto.querySelector('p').textContent.replace('$', '');
    const precio = parseFloat(precioTexto);

    carrito.push({ nombre, precio });
    actualizarCarrito();
  });
});

// Mostrar el carrito
function actualizarCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(0)}
      <button onclick="eliminarDelCarrito(${index})">X</button>
    `;
    listaCarrito.appendChild(li);
    total += item.precio;
  });

  totalCarrito.textContent = `Total: $${total.toFixed(0)}`;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Filtro por categoría
document.getElementById('filtro').addEventListener('change', () => {
  const valor = document.getElementById('filtro').value;
  document.querySelectorAll('.producto').forEach(prod => {
    const categoria = prod.getAttribute('data-categoria');
    prod.style.display = (valor === 'todos' || categoria === valor) ? '' : 'none';
  });
});

// Buscador
document.getElementById('buscador').addEventListener('input', () => {
  const texto = document.getElementById('buscador').value.toLowerCase();
  document.querySelectorAll('.producto').forEach(prod => {
    const nombre = prod.querySelector('h3').textContent.toLowerCase();
    prod.style.display = nombre.includes(texto) ? '' : 'none';
  });
});

// Mostrar el carrito al cargar
actualizarCarrito();
