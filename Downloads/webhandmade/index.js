document.addEventListener("DOMContentLoaded", function () {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    const cartIcon = document.querySelector(".fa-shopping-cart");
    const cartModal = document.getElementById("cartModal");
    const closeCart = document.getElementById("closeCart");
    const cartItemsList = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const confirmPaymentBtn = document.getElementById("confirmPayment");
    const successModal = document.getElementById("successModal");
    const closeSuccessModalBtn = document.getElementById("closeSuccessModal");

    // Mở giỏ hàng
    cartIcon.addEventListener("click", function () {
        cartModal.classList.remove("hidden");
    });

    // Đóng giỏ hàng
    closeCart.addEventListener("click", function () {
        cartModal.classList.add("hidden");
    });

    // Cập nhật giao diện giỏ hàng
    function updateCartUI() {
        cartItemsList.innerHTML = "";
        let totalPrice = 0;

        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            cartItemsList.innerHTML += `
                <li class="flex items-center justify-between border-b pb-2">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded">
                    <div class="flex-1 ml-4">
                        <p class="font-semibold">${item.name}</p>
                        <div class="flex items-center space-x-2">
                            <button class="decrease px-2 py-1 bg-gray-300" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase px-2 py-1 bg-gray-300" data-index="${index}">+</button>
                        </div>
                    </div>
                    <p class="text-red-500 font-semibold">${itemTotal.toLocaleString()}đ</p>
                </li>
            `;
        });

        totalPriceElement.innerText = `${totalPrice.toLocaleString()}đ`;

        // Gán sự kiện tăng/giảm số lượng
        document.querySelectorAll(".increase").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cartItems[index].quantity += 1;
                saveCart();
            });
        });

        document.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity -= 1;
                } else {
                    cartItems.splice(index, 1);
                }
                saveCart();
            });
        });
    }

    // Lưu giỏ hàng vào localStorage và cập nhật giao diện
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        updateCartUI();
    }

    // Xóa giỏ hàng hoàn toàn
    function clearCart() {
        cartItems = [];
        saveCart();
    }

    // Thêm sản phẩm vào giỏ hàng
    document.querySelectorAll(".add-to-cart, .buy-now").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseInt(this.getAttribute("data-price"));
            const image = this.getAttribute("data-image");

            const existingItem = cartItems.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ name, price, image, quantity: 1 });
            }

            saveCart();

            // Nếu là nút "Mua ngay", mở giỏ hàng ngay lập tức
            if (this.classList.contains("buy-now")) {
                cartModal.classList.remove("hidden");
            }
        });
    });

    // Thanh toán
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener("click", function () {
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            let message = "";

            if (selectedMethod === "cod") {
                message = "Bạn đã chọn thanh toán khi nhận hàng.";
            } else if (selectedMethod === "bank") {
                message = "Bạn đã chọn chuyển khoản ngân hàng.";
            } else if (selectedMethod === "momo") {
                message = "Bạn đã chọn thanh toán qua ví Momo.";
            }

            clearCart(); // Xóa giỏ hàng sau khi thanh toán
            document.getElementById("paymentMessage").innerText = message;
            cartModal.classList.add("hidden");
            successModal.classList.remove("hidden");
        });
    }

    // Đóng modal thông báo thành công
    if (closeSuccessModalBtn) {
        closeSuccessModalBtn.addEventListener("click", function () {
            successModal.classList.add("hidden");
        });
    }

    // Cập nhật giao diện lần đầu khi trang tải
    updateCartUI();
});
