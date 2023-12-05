const socket = io();

socket.on('success', (success) => {
  let successBtn = document.querySelector('.success');
  successBtn.style.display = 'block';
  setTimeout(() => {
    successBtn.style.display = 'none';
  }, 3000);
});

socket.on('error', (error) => {
  let errorBtn = document.querySelector('.error');
  errorBtn.style.display = 'block';
  setTimeout(() => {
    errorBtn.style.display = 'none';
  }, 3000)
})

socket.on('productAdded', (product) => {
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  productCard.id = product.id;

  productCard.innerHTML = `
    <img src="https://source.unsplash.com/480x300/?foods&random=${product.id}" alt="">
    <div class="product-info">
      <h3>${product.title}</h3>
      <p><span>Descripción:</span> <br> ${product.description}</p>
      <p><span>Stock disponible:</span> ${product.stock}</p>
      <p>$${product.price}</p>
    </div>
  `;

  const productsList = document.querySelector('.products-list');
  productsList.appendChild(productCard);
});

document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.product-delete');

  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', (e) => {
      const productId = deleteButton.getAttribute('data-product-id');
      console.log('Product ID:', productId);
      fetch(`/delete-product/${productId}`, { method: 'DELETE' })
        .then(response => {
          console.log('Response:', response);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          socket.emit('productDeleted', productId);
        })
        .catch(error => console.error('Error deleting product:', error));
    });
  });
});



socket.on('productDeleted', (deletedProductId) => {
  const deletedProductCard = document.querySelector(`.product-card[data-product-id="${deletedProductId}"]`);
  if (deletedProductCard) {
    deletedProductCard.remove();
  }
});