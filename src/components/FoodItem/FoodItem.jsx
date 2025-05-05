import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ id, image, name, price, desc, stock }) => {

    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

    // Function to handle the add to cart functionality
    const handleAddToCart = (id) => {
        if (stock > 0) {
            addToCart(id);
        }
    };

    // Get cart item quantity with fallback to 0
    const quantity = cartItems && cartItems[id] ? cartItems[id] : 0;

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url + "/images/" + image} alt={name} />
                {stock === 0 ? (
                    <div className="out-of-stock"></div>
                ) : quantity === 0 ? (
                    <img className='add' onClick={() => handleAddToCart(id)} src={assets.add_icon_white} alt="Add to Cart" />
                ) : (
                    <div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="Remove from Cart" />
                        <p>{quantity}</p>
                        <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="Add more" />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="Rating Stars" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className={`food-item-stock ${stock === 0 ? 'unavailable' : 'available'}`}>
                    Stocks :{stock === 0 ? " Unavailable" : ` ${stock}`}
                </p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    )
}

export default FoodItem;
