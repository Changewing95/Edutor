let cart = null;

module.exports = class Cart{
    static save(product){
        if(cart){ //cart is not a null

        }else{
            cart = {product: [], totalPrice:0};

            product.qty = 1
            cart.products.push(product);
            cart.totalPrice = product.price;
        }
    }

    static getCart(){
        return cart;
    }
}


