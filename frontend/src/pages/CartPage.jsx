
import React from 'react';
import { Link } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const {
    cart,
    itemCount,
    total,
    cartMessage,
    setQuantity,
    removeFromCart
  } = useCart();

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">YOUR ORDER</p>
        <h1>Shopping cart</h1>
      </div>

      <StatusMessage
        type={cartMessage.startsWith('Only') ? 'error' : 'info'}
      >
        {cartMessage}
      </StatusMessage>

      {cart.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is empty</h2>

          <Link className="button" to="/">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.productId}>
                <div>
                  <h2>{item.name}</h2>

                  <p>
                    ₱{Number(item.price).toLocaleString('en-PH')} each
                  </p>
                </div>

                <div>
                  <label htmlFor={`quantity-${item.productId}`}>
                    Quantity
                  </label>

                  <div
                    className="quantity-controls"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        setQuantity(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <input
                      id={`quantity-${item.productId}`}
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(event) =>
                        setQuantity(
                          item.productId,
                          Number(event.target.value)
                        )
                      }
                      style={{
                        width: '65px',
                        textAlign: 'center'
                      }}
                    />

                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      disabled={item.quantity >= item.stock}
                      onClick={() =>
                        setQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <small>
                    Available stock: {item.stock}
                  </small>
                </div>

                <strong>
                  ₱
                  {(Number(item.price) * item.quantity)
                    .toLocaleString('en-PH')}
                </strong>

                <button
                  type="button"
                  className="danger"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="summary">
            <h2>Order summary</h2>

            <p>
              <span>Items</span>
              <strong>{itemCount}</strong>
            </p>

            <p className="summary-total">
              <span>Total</span>
              <strong>
                ₱{total.toLocaleString('en-PH')}
              </strong>
            </p>

            <Link className="button full" to="/checkout">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
