class Product {
    constructor(id, title, price, link, description, img = "https://placehold.it/200x150", container = ".productsBlock"){
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.img = img;
        this.link = link;
        this.container = container;
        this._render(this.container);
    }
    _render(container){
        let $product = $('<div/>', {
                class: 'product'
            }),
            $imageBlock = $('<div/>',{
                class: 'imageBlock'
            }),
            $link = $('<a/>', {
                href: this.link
            }),
            $img = $('<img/>', {
                src: this.img
            });

        $img.appendTo($link);
        $link.appendTo($imageBlock);
        $imageBlock.appendTo($product);

        let $productInfo = $('<div/>', {
            class: 'productInfo'
            }),
            $productName = $('<h4/>', {
                class:'productName',
                text: this.title
            }),
            $productDescription = $('<p/>',{
                class: 'productDescription',
                text: `${this.description}`
            });
            $link = $('<a/>', {
                href: this.link
            });

        $productName.appendTo($link);
        $link.appendTo($productInfo);
        $productDescription.appendTo($productInfo);
        $productInfo.appendTo($product);

        let $buyBlock = $('<div/>', {
                class: 'buyBlock'
            }),
            $price = $('<div/>',{
                class: 'productPrice',
                text: `${this.price} руб.`}),
            $buyBtn = $("<button/>", {
                class: "addToCart",
                text: "В корзину!",
                "data-id": this.id,
                "data-price": this.price,
                "data-name": this.title,
                "data-img": this.img
            });

        $price.appendTo($buyBlock);
        $buyBtn.appendTo($buyBlock);
        $buyBlock.appendTo($product);
        $product.appendTo(container);

    }
}