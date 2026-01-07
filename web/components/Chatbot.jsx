import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Chatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    orderDetails: "",
  });
  const [currentStep, setCurrentStep] = useState("greeting");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const greetingSentRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset greeting when chatbot closes
  useEffect(() => {
    if (!isOpen) {
      greetingSentRef.current = false;
    }
  }, [isOpen]);

  // Send greeting only once when chatbot opens for the first time
  useEffect(() => {
    if (isOpen && !greetingSentRef.current && messages.length === 0) {
      greetingSentRef.current = true;
      setTimeout(() => {
        addBotMessage(t("chatbot.greeting"));
        setTimeout(() => {
          addBotMessage(t("chatbot.options"));
        }, 1000);
      }, 500);
    }
  }, [isOpen, t]); // Include t for translation

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { type: "bot", text, timestamp: new Date() },
    ]);
    setIsTyping(false);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text, timestamp: new Date() },
    ]);
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    addUserMessage(text);
    setIsTyping(true);

    // Process user input
    setTimeout(() => {
      processUserInput(text.toLowerCase());
    }, 500);
  };

  const processUserInput = (input) => {
    // Handle order flow steps first (these take priority)
    if (currentStep === "order_name") {
      setUserInfo((prev) => ({ ...prev, name: input }));
      setCurrentStep("order_phone");
      addBotMessage(t("chatbot.orderPhone").replace("{name}", input));
      return;
    }

    if (currentStep === "order_phone") {
      const phone = input.replace(/\D/g, "");
      if (phone.length < 10) {
        addBotMessage(t("chatbot.invalidPhone"));
        return;
      }
      setUserInfo((prev) => ({ ...prev, phone }));
      setCurrentStep("order_address");
      addBotMessage(t("chatbot.orderAddress") + " your delivery address?");
      return;
    }

    if (currentStep === "order_address") {
      setUserInfo((prev) => ({ ...prev, address: input }));
      setCurrentStep("order_details");
      addBotMessage(t("chatbot.orderDetails"));
      return;
    }

    if (currentStep === "order_details") {
      setUserInfo((prev) => ({ ...prev, orderDetails: input }));
      setCurrentStep("order_confirm");
      const orderSummary = `${t("chatbot.orderSummary")}:\n\n${t("common.name")}: ${userInfo.name}\n${t("common.phone")}: ${userInfo.phone}\n${t("common.address")}: ${userInfo.address}\n${t("order.orderItems")}: ${input}\n\n${t("chatbot.confirmOrder")}`;
      addBotMessage(orderSummary);
      return;
    }

    if (
      currentStep === "order_confirm" &&
      (input.includes("yes") ||
        input.includes("confirm") ||
        input.includes("send"))
    ) {
      sendOrderToWhatsApp();
      return;
    }

    // Reset order flow if user says cancel/no
    if (
      (input.includes("cancel") ||
        input.includes("no") ||
        input.includes("stop")) &&
      currentStep.startsWith("order_")
    ) {
      setCurrentStep("idle");
      setUserInfo({ name: "", phone: "", address: "", orderDetails: "" });
      addBotMessage(t("chatbot.orderCancelled"));
      return;
    }

    // Comprehensive knowledge base - Order related
    if (
      input.includes("order") ||
      input.includes("place order") ||
      input.includes("buy") ||
      input.includes("purchase") ||
      input === "1"
    ) {
      if (!currentStep.startsWith("order_")) {
        setCurrentStep("order_name");
        addBotMessage(t("chatbot.orderName"));
      }
      return;
    }

    if (
      input.includes("how to order") ||
      input.includes("how do i order") ||
      input.includes("order process")
    ) {
      addBotMessage(t("chatbot.howToOrder"));
      return;
    }

    if (
      input.includes("modify order") ||
      input.includes("change order") ||
      input.includes("edit order")
    ) {
      addBotMessage(t("chatbot.modifyOrder"));
      return;
    }

    if (input.includes("cancel order") || input.includes("cancel my order")) {
      addBotMessage(
        t("chatbot.cancelOrder") + "ll process your cancellation immediately.",
      );
      return;
    }

    if (
      input.includes("track order") ||
      input.includes("order status") ||
      input.includes("where is my order")
    ) {
      addBotMessage(
        t("chatbot.trackOrder") +
          "ll send confirmation messages for order updates",
      );
      return;
    }

    // Menu related
    if (
      input.includes("menu") ||
      input.includes("what do you serve") ||
      input.includes("what food") ||
      input.includes("items") ||
      input === "2"
    ) {
      addBotMessage(t("chatbot.menuInfo"));
      return;
    }

    if (
      input.includes("price") ||
      input.includes("cost") ||
      input.includes("how much") ||
      input.includes("pricing")
    ) {
      addBotMessage(t("chatbot.pricing"));
      return;
    }

    if (
      input.includes("customize") ||
      input.includes("custom") ||
      input.includes("mix and match")
    ) {
      addBotMessage(t("chatbot.customize"));
      return;
    }

    if (input.includes("what is tiffin") || input.includes("tiffin")) {
      addBotMessage(t("chatbot.tiffin"));
      return;
    }

    // Delivery related
    if (
      input.includes("delivery") ||
      input.includes("deliver") ||
      input.includes("when will") ||
      input === "3"
    ) {
      addBotMessage(t("chatbot.deliveryInfo"));
      return;
    }

    if (
      input.includes("delivery time") ||
      input.includes("when do you deliver") ||
      input.includes("delivery hours")
    ) {
      addBotMessage(t("chatbot.deliveryTime"));
      return;
    }

    if (
      input.includes("delivery area") ||
      input.includes("where do you deliver") ||
      input.includes("service area") ||
      input.includes("coverage")
    ) {
      addBotMessage(t("chatbot.deliveryArea"));
      return;
    }

    if (
      input.includes("free delivery") ||
      input.includes("delivery charge") ||
      input.includes("shipping")
    ) {
      addBotMessage(t("chatbot.deliveryCharge"));
      return;
    }

    if (input.includes("minimum order") || input.includes("min order")) {
      addBotMessage(
        t("chatbot.minOrder") + "s no minimum order requirement otherwise.",
      );
      return;
    }

    if (
      input.includes("not available") ||
      input.includes("not home") ||
      input.includes("missed delivery")
    ) {
      addBotMessage(
        t("chatbot.notAvailable") +
          "t be available during delivery:\n• Inform us in advance via WhatsApp\n• Arrange for someone else to receive\n• We can reschedule for another time\n• Contact: +91-9958983578",
      );
      return;
    }

    // Payment related
    if (
      input.includes("payment") ||
      input.includes("pay") ||
      input.includes("cash") ||
      input.includes("upi") ||
      input.includes("online payment")
    ) {
      addBotMessage(t("chatbot.payment"));
      return;
    }

    // Account related
    if (
      input.includes("account") ||
      input.includes("login") ||
      input.includes("register") ||
      input.includes("sign up") ||
      input === "4"
    ) {
      addBotMessage(t("chatbot.accountSupport"));
      return;
    }

    if (
      input.includes("forgot password") ||
      input.includes("reset password") ||
      input.includes("password")
    ) {
      addBotMessage(t("chatbot.password") + "ll help you reset it securely.");
      return;
    }

    if (
      input.includes("order history") ||
      input.includes("past orders") ||
      input.includes("my orders")
    ) {
      addBotMessage(t("chatbot.orderHistory"));
      return;
    }

    // Contact related
    if (
      input.includes("contact") ||
      input.includes("phone") ||
      input.includes("number") ||
      input.includes("call") ||
      input.includes("whatsapp")
    ) {
      addBotMessage(t("chatbot.contact") + "re available 7 days a week!");
      return;
    }

    if (
      input.includes("address") ||
      input.includes("location") ||
      input.includes("where are you")
    ) {
      addBotMessage(t("chatbot.address"));
      return;
    }

    // Hours/Timings
    if (
      input.includes("hours") ||
      input.includes("timing") ||
      input.includes("open") ||
      input.includes("close") ||
      input.includes("when are you")
    ) {
      addBotMessage(t("chatbot.hours"));
      return;
    }

    if (
      input.includes("weekend") ||
      input.includes("saturday") ||
      input.includes("sunday") ||
      input.includes("holiday")
    ) {
      addBotMessage(t("chatbot.weekend"));
      return;
    }

    // Food quality related
    if (
      input.includes("vegetarian") ||
      input.includes("veg") ||
      input.includes("non-veg") ||
      input.includes("pure veg")
    ) {
      addBotMessage(t("chatbot.vegetarian"));
      return;
    }

    if (
      input.includes("fresh") ||
      input.includes("quality") ||
      input.includes("hygienic") ||
      input.includes("clean")
    ) {
      addBotMessage(t("chatbot.quality"));
      return;
    }

    if (
      input.includes("oil") ||
      input.includes("spicy") ||
      input.includes("spices")
    ) {
      addBotMessage(t("chatbot.oilSpices"));
      return;
    }

    // Subscription/Offers
    if (
      input.includes("subscription") ||
      input.includes("subscribe") ||
      input.includes("weekly") ||
      input.includes("monthly") ||
      input.includes("offer") ||
      input.includes("discount")
    ) {
      addBotMessage(t("chatbot.subscription"));
      return;
    }

    // General support
    if (
      input.includes("help") ||
      input.includes("support") ||
      input.includes("assistance") ||
      input.includes("problem")
    ) {
      addBotMessage(
        t("chatbot.help") +
          "m here to help! I can assist with:\n\n• Placing orders\n• Menu & pricing\n• Delivery information\n• Account management\n• Payment methods\n• Special offers\n\n📱 Support page: /support\n❓ FAQ page: /faq\n📞 Contact: +91-9958983578\n\nWhat would you like to know?",
      );
      return;
    }

    if (
      input.includes("about") ||
      input.includes("who are you") ||
      input.includes("homiebites")
    ) {
      addBotMessage(t("chatbot.about"));
      return;
    }

    // Order flow steps
    if (currentStep === "order_name") {
      setUserInfo((prev) => ({ ...prev, name: input }));
      setCurrentStep("order_phone");
      addBotMessage(t("chatbot.orderPhone").replace("{name}", input));
      return;
    }

    if (currentStep === "order_phone") {
      const phone = input.replace(/\D/g, "");
      if (phone.length < 10) {
        addBotMessage(t("chatbot.invalidPhone"));
        return;
      }
      setUserInfo((prev) => ({ ...prev, phone }));
      setCurrentStep("order_address");
      addBotMessage(t("chatbot.orderAddress") + " your delivery address?");
      return;
    }

    if (currentStep === "order_address") {
      setUserInfo((prev) => ({ ...prev, address: input }));
      setCurrentStep("order_details");
      addBotMessage(t("chatbot.orderDetails"));
      return;
    }

    if (currentStep === "order_details") {
      setUserInfo((prev) => ({ ...prev, orderDetails: input }));
      setCurrentStep("order_confirm");
      const orderSummary = `${t("chatbot.orderSummary")}:\n\n${t("common.name")}: ${userInfo.name}\n${t("common.phone")}: ${userInfo.phone}\n${t("common.address")}: ${userInfo.address}\n${t("order.orderItems")}: ${input}\n\n${t("chatbot.confirmOrder")}`;
      addBotMessage(orderSummary);
      return;
    }

    if (
      currentStep === "order_confirm" &&
      (input.includes("yes") ||
        input.includes("confirm") ||
        input.includes("send"))
    ) {
      sendOrderToWhatsApp();
      return;
    }

    // Helper function to navigate to links
    const navigateToLink = (url, message) => {
      addBotMessage(message || `Opening ${url}...`);
      setTimeout(() => {
        if (url.startsWith("http")) {
          window.open(url, "_blank", "noopener");
        } else {
          window.location.href = url;
        }
      }, 500);
    };

    // Links and navigation
    if (
      input.includes("menu page") ||
      input.includes("view menu") ||
      input.includes("go to menu")
    ) {
      navigateToLink("/menu", t("chatbot.openingMenu"));
      return;
    }

    if (
      input.includes("faq page") ||
      input.includes("view faq") ||
      input.includes("go to faq")
    ) {
      navigateToLink("/faq", t("chatbot.openingFaq"));
      return;
    }

    if (
      input.includes("support page") ||
      input.includes("view support") ||
      input.includes("go to support")
    ) {
      navigateToLink("/support", t("chatbot.openingSupport"));
      return;
    }

    if (
      input.includes("gallery") ||
      input.includes("food gallery") ||
      input.includes("photos")
    ) {
      navigateToLink("/#gallery", t("chatbot.openingGallery"));
      return;
    }

    if (
      input.includes("contact") &&
      (input.includes("page") || input.includes("section"))
    ) {
      navigateToLink("/#contact", t("chatbot.openingContact"));
      return;
    }

    if (
      input.includes("home") ||
      input.includes("homepage") ||
      input.includes("main page")
    ) {
      navigateToLink("/", t("chatbot.openingHome"));
      return;
    }

    // Default response
    addBotMessage(t("chatbot.defaultResponse"));
  };

  const sendOrderToWhatsApp = () => {
    const message = `🍽️ *${t("chatbot.orderFromChatbot")}*

👤 *${t("chatbot.customerDetails")}:*
${t("common.name")}: ${userInfo.name}
${t("common.phone")}: ${userInfo.phone}
${t("common.address")}: ${userInfo.address}

📋 *${t("order.orderItems")}:*
${userInfo.orderDetails}

${t("chatbot.pleaseConfirm")}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/919958983578?text=${encodedMessage}`,
      "_blank",
      "noopener",
    );

    addBotMessage(t("chatbot.orderSent"));
    setCurrentStep("idle");
    setUserInfo({ name: "", phone: "", address: "", orderDetails: "" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const input = inputRef.current;
      if (input && input.value.trim()) {
        handleSendMessage(input.value);
        input.value = "";
      }
    }
  };

  const quickActions = [
    { text: t("chatbot.quickOrder"), action: () => handleSendMessage("order") },
    {
      text: t("chatbot.quickMenu"),
      action: () => (window.location.href = "/menu"),
    },
    {
      text: t("chatbot.quickDelivery"),
      action: () => handleSendMessage("delivery"),
    },
  ];

  return (
    <>
      <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3>HomieBites Assistant</h3>
              <p className="chatbot-status">{t("chatbot.online")}</p>
            </div>
          </div>
          <button
            className="chatbot-close"
            onClick={() => {
              setIsOpen(false);
              // Reset messages when closing
              setMessages([]);
              setCurrentStep("greeting");
              greetingSentRef.current = false;
            }}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.length === 0 && (
            <div className="chatbot-welcome">
              <p>{t("chatbot.welcome")}</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`chatbot-message ${msg.type}`}>
              <div className="message-content">
                {msg.text.split("\n").map((line, i) => {
                  // Check if line contains links
                  const hasLinks = /(https?:\/\/[^\s]+|\/[a-z#]+)/g.test(line);
                  if (hasLinks) {
                    const parts = line.split(/(https?:\/\/[^\s]+|\/[a-z#]+)/g);
                    return (
                      <p key={i}>
                        {parts.map((part, j) => {
                          if (/^https?:\/\//.test(part)) {
                            return (
                              <a
                                key={j}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="message-link"
                              >
                                {part}
                              </a>
                            );
                          } else if (/^\/[a-z#]/.test(part)) {
                            return (
                              <a
                                key={j}
                                href={part}
                                className="message-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.location.href = part;
                                }}
                              >
                                {part}
                              </a>
                            );
                          }
                          return <span key={j}>{part}</span>;
                        })}
                      </p>
                    );
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="chatbot-message bot typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length > 0 && messages.length < 3 && (
          <div className="chatbot-quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="chatbot-quick-btn"
                onClick={action.action}
              >
                {action.text}
              </button>
            ))}
          </div>
        )}

        <div className="chatbot-input-container">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder={t("chatbot.typeMessage")}
            onKeyPress={handleKeyPress}
          />
          <button
            className="chatbot-send"
            onClick={() => {
              if (inputRef.current && inputRef.current.value.trim()) {
                handleSendMessage(inputRef.current.value);
                inputRef.current.value = "";
              }
            }}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <button
        className="chatbot-toggle"
        onClick={() => {
          const newIsOpen = !isOpen;
          setIsOpen(newIsOpen);
          // Reset when closing chatbot
          if (!newIsOpen) {
            setMessages([]);
            setCurrentStep("greeting");
            greetingSentRef.current = false;
          }
        }}
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <i className="fa-solid fa-times"></i>
        ) : (
          <i className="fa-solid fa-comments"></i>
        )}
      </button>
    </>
  );
};

export default Chatbot;
