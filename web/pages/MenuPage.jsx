import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useLanguage } from "../contexts/LanguageContext";
import { useNotification } from "../contexts/NotificationContext";
import { getMenuData, getMenuDataSync } from "../lib/menuData";
import "../styles/chatbot.css";
import "./MenuPage.css";

export default function MenuPage() {
  const { t } = useLanguage();
  const { success, error, info } = useNotification();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await getMenuData();
        if (data && Array.isArray(data) && data.length > 0) {
          setMenuData(data);
        } else {
          console.warn("Menu data is empty or invalid");
          setMenuData([]);
        }
      } catch (error) {
        console.error("Error loading menu data:", error);
        // Fallback to sync version
        try {
          const syncData = getMenuDataSync();
          if (syncData && Array.isArray(syncData) && syncData.length > 0) {
            setMenuData(syncData);
          } else {
            setMenuData([]);
          }
        } catch (syncError) {
          console.error("Error loading menu from cache:", syncError);
          setMenuData([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Wrap in try-catch to prevent unhandled errors
    try {
      loadMenu().catch((err) => {
        console.error("loadMenu promise rejected:", err);
        setIsLoading(false);
        setMenuData([]);
      });
    } catch (err) {
      console.error("loadMenu threw synchronously:", err);
      setIsLoading(false);
      setMenuData([]);
    }
  }, []);

  const addToCart = (categoryId, itemId, itemName, itemPrice) => {
    const key = `${categoryId}-${itemId}`;
    setCart((prev) => {
      const newQuantity = (prev[key]?.quantity || 0) + 1;
      return {
        ...prev,
        [key]: {
          name: itemName,
          price: itemPrice,
          quantity: newQuantity,
        },
      };
    });
    info(`${itemName} added to cart!`);
  };

  const removeFromCart = (key) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const itemName = newCart[key]?.name;
      if (newCart[key].quantity > 1) {
        newCart[key].quantity -= 1;
        info(`${itemName} quantity decreased`);
      } else {
        delete newCart[key];
        info(`${itemName} removed from cart`);
      }
      return newCart;
    });
  };

  const FREE_DELIVERY_THRESHOLD = 100;
  const DELIVERY_CHARGE = 20;

  const getSubtotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getDeliveryCharge = () => {
    const subtotal = getSubtotal();
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryCharge();
  };

  const getAmountNeededForFreeDelivery = () => {
    const subtotal = getSubtotal();
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    return FREE_DELIVERY_THRESHOLD - subtotal;
  };

  // Show free delivery notification when close to threshold
  useEffect(() => {
    const subtotal = getSubtotal();
    if (subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD) {
      const amountNeeded = getAmountNeededForFreeDelivery();
      if (amountNeeded > 0 && amountNeeded <= 20) {
        info(`Add ₹${amountNeeded} more for free delivery!`);
      }
    }
  }, [cart, info]);

  const handleWhatsAppOrder = () => {
    if (Object.keys(cart).length === 0) {
      error(
        t("menu.emptyCart") ||
          "Your cart is empty. Please add items to place an order.",
      );
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      error(t("menu.customerInfo") || "Please fill in all customer details.");
      return;
    }

    const items = Object.entries(cart).map(([, item]) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderData = {
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      items: items,
      total: getTotal(),
      subtotal: getSubtotal(),
      deliveryCharge: getDeliveryCharge(),
    };

    // Order saved directly to WhatsApp

    const itemsText = items
      .map(
        (item) =>
          `${item.name} x${item.quantity} (₹${item.price * item.quantity})`,
      )
      .join("\n");

    const deliveryText =
      getDeliveryCharge() === 0
        ? "✅ *Free Delivery*"
        : `🚚 *Delivery Charge: ₹${getDeliveryCharge()}*`;

    const message = `🍽️ *Order from HomieBites*

👤 *Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

📋 *Order Items:*
${itemsText}

💰 *Subtotal: ₹${getSubtotal()}*
${deliveryText}
💰 *Grand Total: ₹${getTotal()}*

Please confirm this order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/919958983578?text=${encodedMessage}`,
      "_blank",
      "noopener",
    );

    setCart({});
    setCustomerInfo({ name: "", phone: "", address: "" });

    success(
      t("order.orderPlaced") ||
        "Order sent to WhatsApp! Our team will confirm shortly.",
    );
  };

  const openOrderModal = () => {
    // Order modal functionality can be added here if needed
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className="menu-page">
        <div className="menu-header">
          <button className="btn btn-ghost" onClick={() => navigate("/")}>
            ← {t("common.back")}
          </button>
          <h1>{t("menu.title")}</h1>
        </div>

        <div className="menu-content">
          {isLoading ? (
            <div className="menu-loading-state">
              <p>{t("common.loading")}</p>
            </div>
          ) : menuData.length === 0 ? (
            <div className="menu-empty-state">
              <p>{t("menu.noItems")}</p>
            </div>
          ) : (
            <div className="menu-categories">
              {menuData.map((category) => (
                <div key={category.id} className="menu-category">
                  <h2 className="category-title">{category.category}</h2>
                  {category.description && (
                    <p className="category-desc">{category.description}</p>
                  )}

                  <div className="menu-items">
                    {category.items.map((item) => {
                      const key = `${category.id}-${item.id}`;
                      const cartItem = cart[key];

                      return (
                        <div key={item.id} className="menu-item">
                          <div className="item-info">
                            <h3 className="item-name">{item.name}</h3>
                            <p className="item-price">₹{item.price}</p>
                          </div>
                          <div className="item-actions">
                            {cartItem ? (
                              <div className="cart-controls">
                                <button
                                  className="btn btn-qty"
                                  onClick={() => removeFromCart(key)}
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="qty-value">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  className="btn btn-qty"
                                  onClick={() =>
                                    addToCart(
                                      category.id,
                                      item.id,
                                      item.name,
                                      item.price,
                                    )
                                  }
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-primary btn-small btn-full"
                                onClick={() =>
                                  addToCart(
                                    category.id,
                                    item.id,
                                    item.name,
                                    item.price,
                                  )
                                }
                              >
                                {t("common.add")}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>{t("menu.cart")}</h3>
              {Object.keys(cart).length > 0 && (
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => setCart({})}
                >
                  {t("common.remove")}
                </button>
              )}
            </div>

            <div className="cart-sidebar-content">
              {Object.keys(cart).length === 0 ? (
                <div className="cart-empty-state">
                  <div className="cart-empty-icon"></div>
                  <h4 className="cart-empty-title">
                    {t("menu.emptyCartTitle") || "Your cart is empty"}
                  </h4>
                  <p className="cart-empty-message">
                    {t("menu.emptyCartMessage") ||
                      "Add some delicious and healthy food to get started!"}
                  </p>
                </div>
              ) : (
                <div className="cart-items">
                  {Object.entries(cart).map(([key, item]) => (
                    <div key={key} className="cart-item">
                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">
                          ₹{item.price} × {item.quantity} = ₹
                          {item.price * item.quantity}
                        </span>
                      </div>
                      <button
                        className="btn btn-ghost"
                        onClick={() => removeFromCart(key)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {Object.keys(cart).length > 0 && (
                <>
                  <div className="cart-total">
                    <div className="total-row">
                      <span>{t("menu.subtotal")}:</span>
                      <span>₹{getSubtotal()}</span>
                    </div>
                    <div className="total-row">
                      <span>{t("menu.deliveryCharge")}:</span>
                      <span
                        className={
                          getDeliveryCharge() === 0 ? "free-delivery" : ""
                        }
                      >
                        {getDeliveryCharge() === 0
                          ? t("menu.freeDelivery")
                          : `₹${getDeliveryCharge()}`}
                      </span>
                    </div>
                    {getAmountNeededForFreeDelivery() > 0 && (
                      <div className="free-delivery-message">
                        <i className="fa-solid fa-truck"></i>
                        {t("menu.freeDeliveryMessage").replace(
                          "{amount}",
                          getAmountNeededForFreeDelivery(),
                        )}
                      </div>
                    )}
                    <div className="total-row grand-total">
                      <span>{t("menu.grandTotal")}:</span>
                      <span className="total-amount">₹{getTotal()}</span>
                    </div>
                  </div>

                  <div className="customer-form">
                    <input
                      type="text"
                      placeholder={t("order.customerName")}
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="tel"
                      placeholder={t("order.customerPhone")}
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                    <textarea
                      placeholder={t("order.deliveryAddress")}
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                      required
                      rows="3"
                    />
                  </div>
                </>
              )}
            </div>

            {Object.keys(cart).length > 0 && (
              <div className="cart-sidebar-footer">
                <button
                  className="btn btn-secondary btn-full"
                  onClick={handleWhatsAppOrder}
                >
                  <i className="fa-brands fa-whatsapp"></i>{" "}
                  {t("order.sendWhatsApp")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
      <Chatbot />
    </>
  );
}
