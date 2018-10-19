class Cart {
    constructor(source, container = '.shoppingCart') {
        this.source = source;
        this.container = container;
        this.countGoods = 0;
        this.amount = 0;
        this.cartItems = [];
        this._init(this.source);
    }


    _renderItem(product) {
        Cart._showAmount(this.cartItems);

        let $container = $('<div/>', {
            class: 'productInCart',
            'data-product': product.id_product
        });
        let $delBtn = $(`<div class="deleteProduct"><img src="../img/delBtn.png" alt="del"></div>`).on('click', () => {
            this._remove(product.id_product);
        });
        $container.append($delBtn);
        $container.append($(`<div class="productInCartInfo"><a href="${product.link}"><h4>${product.product_name}</h4></a></div>`));
        $container.append($(`<p><span class="productQuantity">${product.quantity}</span> x <span class="productPriceCart">${product.price}</span> ₽</p>`));
        $('.cartFlexIn').append($container);
    }

    _renderSum(amount) {
        $('.totalPrice > span').text(`Всего: ${amount} ₽`);
    }

    _init(source) {
        this._renderSum(this.amount);
        console.log();
        //localStorage.clear();
        if (!localStorage.getItem('myCart')) {
            fetch(source)
                .then(result => result.json())
                .then(data => {
                    for (let product of data.contents) {
                        this.cartItems.push(product);
                        this._renderItem(product);
                    }
                    this.countGoods = data.countGoods;
                    this.amount = data.amount;
                    localStorage.setItem('myCart', JSON.stringify(this.cartItems));
                    console.log('Items added');
                    this._renderSum(data.amount, data.countGoods);
                })
        } else {
            console.log(JSON.parse(localStorage.getItem('myCart')));
            this.cartItems = JSON.parse(localStorage.getItem('myCart'));
            for (let product of this.cartItems) {
                this._renderItem(product);
                this._updateCart(product);
                this.amount += product.price * product.quantity;
                console.log(this.amount);
                this._renderSum(this.amount)
            }
        }
    }

    _updateCart(product) {
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.productQuantity').text(product.quantity);
        $container.find('.productPriceCart').text(`${product.quantity * product.price}`);
    }

    _addProduct(element) {
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: productId,
                price: +$(element).data('price'),
                product_name: $(element).data('name'),
                quantity: 1,
                img: $(element).data('img')
            };
            this.cartItems.push(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
            this._renderItem(product);
        }
        localStorage.setItem('myCart', JSON.stringify(this.cartItems));
        this._renderSum(this.amount, this.countGoods);
    }

    _remove(id_product) {
        let find = this.cartItems.find(product => product.id_product === id_product);
        if (find.quantity > 1) {
            find.quantity--;
            this._updateCart(find);
        } else {
            let $container = $(`div[data-product="${id_product}"]`);
            this.cartItems.splice(this.cartItems.indexOf(find), 1);
            $container.remove();
        }
        this.countGoods--;
        this.amount -= find.price;
        localStorage.setItem('myCart', JSON.stringify(this.cartItems));
        this._renderSum(this.amount, this.countGoods);
        Cart._hideAmount(this.cartItems);
    }

    static _hideAmount(amount) {
        if (amount.length === 0) {
            $('.countGoods').addClass('hideAmount');
        }
    }

    static _showAmount(amount) {
        if (amount.length > 0) {
            $('.countGoods').removeClass('hideAmount');
        }
    }
}