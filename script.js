function goToHome() {
  window.location.href = "homePage.html";
}

// ========== Greeting ==========
const greetings = [
  "Hello! Welcome to MR.COFFEE.",
  "Halo! Selamat datang di MR.COFFEE.",
  "안녕하세요! MR.COFFEE에 오신 것을 환영합니다.",
  "こんにちは! MR.COFFEEへようこそ。",
  "你好! 欢迎来到 MR.COFFEE。",
  "Aloha! Welina mai iā MR.COFFEE.",
  "Bonjour! Bienvenue chez MR.COFFEE."
];

let greetIndex = 0;
let charIndex = 0;
const typingSpeed = 61;
const delayBetween = 950;

function typeGreeting() {
  const target = document.getElementById("typing-text");
  if (!target) return;

  if (charIndex < greetings[greetIndex].length) {
    target.textContent += greetings[greetIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeGreeting, typingSpeed);
  } else {
    setTimeout(() => {
      target.textContent = "";
      charIndex = 0;
      greetIndex = (greetIndex + 1) % greetings.length;
      typeGreeting();
    }, delayBetween);
  }
}

document.addEventListener('DOMContentLoaded', typeGreeting);

//slider
const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.nav.left');
const btnRight = document.querySelector('.nav.right');

if (track && slides.length > 0) {
  const firstSlide = slides[0].cloneNode(true);
  const lastSlide = slides[slides.length - 1].cloneNode(true);
  track.appendChild(firstSlide);
  track.insertBefore(lastSlide, slides[0]);

  let index = 1;
  let slideInterval;
  const slideWidth = slides[0].offsetWidth;
  track.style.transform = `translateX(-${slideWidth * index}px)`;

  window.addEventListener('resize', () => {
    clearInterval(slideInterval);
    track.style.transition = 'none';
    track.style.transform = `translateX(-${slides[0].offsetWidth * index}px)`;
    startAutoSlide();
  });

  function moveToSlide(i) {
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${slides[0].offsetWidth * i}px)`;
  }

  function nextSlide() {
    index++;
    moveToSlide(index);
  }

  function prevSlide() {
    index--;
    moveToSlide(index);
  }

  btnRight?.addEventListener('click', () => {
    if (index >= slides.length) {
      index = 1;
      track.style.transition = 'none';
      track.style.transform = `translateX(-${slides[0].offsetWidth * index}px)`;
    } else {
      nextSlide();
    }
  });

  btnLeft?.addEventListener('click', () => {
    if (index <= 0) {
      index = slides.length - 2;
      track.style.transition = 'none';
      track.style.transform = `translateX(-${slides[0].offsetWidth * index}px)`;
    } else {
      prevSlide();
    }
  });

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      nextSlide();
      if (index >= slides.length) {
        index = 1;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${slides[0].offsetWidth * index}px)`;
      }
    }, 3000);
  }

  startAutoSlide();
}


// ========== Menu Filtering ==========
function filterMenu(category) {
  const items = document.querySelectorAll('.product-card');
  items.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    item.style.display = (itemCategory === category || category === '') ? 'block' : 'none';
  });
}

// ========== Rewards Popup ==========
function promptAppDownload() {
  alert("Please download our app to claim this reward!");
}

// ========== Order Form Validation & Modal ==========
document.addEventListener('DOMContentLoaded', () => {
  const orderBtn = document.getElementById('orderNowBtn');
  const modal = document.getElementById('orderModal');
  const closeBtn = document.getElementById('closeModal');

  orderBtn?.addEventListener('click', () => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const address = document.getElementById('address');

    let valid = true;
    [name, email, address].forEach(field => {
      field.style.borderColor = '#ccc';
    });

    if (name.value.trim().length < 3) {
      name.style.borderColor = 'red';
      valid = false;
    }
    if (!email.value.includes('@') || !email.value.includes('.')) {
      email.style.borderColor = 'red';
      valid = false;
    }
    if (address.value.trim().length < 5) {
      address.style.borderColor = 'red';
      valid = false;
    }
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!valid) {
      alert("Please fill out your information correctly.");
      return;
    }

    // Tampilkan modal
    modal.style.display = 'block';

    // Reset form & cart
    name.value = '';
    email.value = '';
    address.value = '';
    document.getElementById('product').value = '';
    document.getElementById('addons').value = '';
    document.getElementById('total').value = '';
    cart = [];
    updateCartUI();
  });

  // ✅ Tambahkan handler untuk tombol close modal
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
});


// ========== Automatic Cart Input Price ==========
document.addEventListener('DOMContentLoaded', () => {
  const productSelect = document.getElementById('product');
  const totalInput = document.getElementById('total');

  const prices = {
    originalespresso: 25000,
    brownsugaroatmilk: 28000,
    chocolatteorange: 30000,
    originalfrappe: 30000,
    matchafrappe: 35000,
    caramelfrappucino: 35000,
    brewedcoffee: 20000,
    lowcaloriebrewed: 20000,
    caramelhazelnut: 28000,
    croissant: 20000,
    cromboloni: 25000,
    donut: 12000,
    pretzel: 20000
  };

  if (productSelect) {
    productSelect.addEventListener('change', () => {
      const selected = productSelect.value;
      totalInput.value = prices[selected] || 0;
    });
  }

  // Tombol Add to Cart & Checkout
  const addToCartBtn = document.getElementById('add-to-cart');
  const checkoutBtn = document.getElementById('checkout');

  if (addToCartBtn) addToCartBtn.addEventListener('click', handleAddToCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
});

let cart = [];

// ========== Adding Item to Cart ==========
function handleAddToCart() {
  const productSelect = document.getElementById('product');
  const totalInput = document.getElementById('total');
  const product = productSelect.value;
  const price = parseInt(totalInput.value || 0);

  if (!product || price === 0) {
    alert("Please select a product first.");
    return;
  }

  cart.push({ product, price });
  updateCartUI();

  // Reset pilihan
  productSelect.value = '';
  totalInput.value = '';
}

// ========== Show Cart ==========
function updateCartUI() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const emptyMessage = document.getElementById('empty-cart-message');

  if (!cartItems || !cartCount || !cartTotal || !emptyMessage) return;

  cartItems.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
  }

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${index + 1}. ${capitalize(item.product)} - Rp${item.price.toLocaleString('id-ID')}
      <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>`;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = total.toLocaleString('id-ID');
}

// ========== Remove an Item ==========
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// ========== Clear Cart ==========
function clearCart() {
  cart = [];
  updateCartUI();
}

// ========== Checkout ==========
function handleCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const orderDetails = cart.map(item => `${capitalize(item.product)} - Rp${item.price.toLocaleString('id-ID')}`).join('\n');
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  alert(`Your order:\n${orderDetails}\n\nTotal: Rp${totalAmount.toLocaleString('id-ID')}`);

  cart = [];
  updateCartUI();
}

// ========== Scroll to Top ==========
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ========== Utility ==========
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

