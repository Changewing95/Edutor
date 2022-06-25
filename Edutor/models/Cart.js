let cart = null;

module.exports = class Cart{
    static save(product){

        if (cart === null){
            cart = {products: [], totalPrice:0, CartCount:0};
        }
        const existingProductIndex = cart.products.findIndex(p => p.id == product.id); //check if product still exists
        // console.log('existing prod index = ',existingProductIndex);
        if(existingProductIndex>=0){ //exists in the cart
            const existingProduct = cart.products[existingProductIndex];
            existingProduct.qty += 1
        }else{ //does not exist in the cart
            product.qty = 1;
            cart.products.push(product);
            // console.log(cart.products[0].name,'djwehndjwk');
        }
        cart.totalPrice += Number(product.price);
        cart.CartCount += 1;
    }

    static getCart(){
        return cart.products;
    }
    
    static getCartTotal(){
        return cart.totalPrice;
    }

    static getCartCount(){
        return cart.CartCount;
    }

    static delete(productId){
        const isExisting = cart.products.findIndex(p => p.id == productId);
        if (isExisting>=0){
            const deletedProduct = cart.products[isExisting];
            cart.totalPrice -= deletedProduct.price * deletedProduct.qty
            cart.products.splice(isExisting,1);
            cart.CartCount -= deletedProduct.qty;
        }
    }
}