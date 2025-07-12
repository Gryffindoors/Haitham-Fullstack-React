// src/orders/OrderGUIModal.jsx
import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useMenuData } from "../context/MenuContext";
import FormattedText from "../utils/FormattedText";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import toast from "react-hot-toast";
 

import { MdLocalDrink } from "react-icons/md";
import { FaSnowflake } from "react-icons/fa";
import {
    GiMeal,
    GiKnifeFork,
    GiCoffeeCup,
    GiFrenchFries,
    GiDonut,
} from "react-icons/gi";
import CartPreview from "./components/CartPreview";
import CheckoutModal from "./CheckoutModal";

const categoryIcons = {
    Drinks: MdLocalDrink,
    Food: GiKnifeFork,
    Cold: FaSnowflake,
    Hot: GiCoffeeCup,
    Meals: GiMeal,
    Snacks: GiFrenchFries,
    Sweets: GiDonut,
};

const OrderGUIModal = ({ onClose, initialData = null }) => {
    const { lang } = useLanguage();
    const { items: menuItems = [], categories: menuCategories = [], loading } = useMenuData();
    const [showCheckout, setShowCheckout] = useState(false);

    const [selectedMain, setSelectedMain] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (initialData?.items?.length) {
            const mappedItems = initialData.items.map((item) => ({
                id: item.menu_item_id,
                name: item.name,
                name_ar: item.name_ar,
                price: parseFloat(item.unit_price),
                quantity: item.quantity,
            }));
            setCart(mappedItems);
        }
    }, [initialData]);

    useEffect(() => {
        if (loading) toast.loading("Loading menu...", { id: "menu-loading" });
        else toast.dismiss("menu-loading");
    }, [loading]);

    const mainCategories = menuCategories.filter((c) => c.parent === null);
    const subCategories = menuCategories.filter((c) => c.parent?.name === selectedMain?.name);
    const filteredItems = menuItems.filter((i) => i.category?.id === selectedSub?.id);

    const updateQuantity = (item, delta) => {
        setCart((prev) => {
            const exists = prev.find((p) => p.id === item.id);
            if (!exists && delta > 0) return [...prev, { ...item, quantity: 1 }];
            return prev
                .map((p) =>
                    p.id === item.id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
                )
                .filter((p) => p.quantity > 0);
        });
    };

    const total = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] h-[90vh] overflow-hidden flex relative">
                {/* Left Panel */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h2 className="text-xl font-bold text-center mb-4">
                        <FormattedText id="select_category" />
                    </h2>

                    <Swiper slidesPerView={2.5} spaceBetween={10} className="mb-4">
                        {mainCategories.map((cat) => {
                            const Icon = categoryIcons[cat.name] || MdLocalDrink;
                            return (
                                <SwiperSlide key={cat.id}>
                                    <button
                                        className={`w-full p-4 border rounded-lg shadow-sm flex flex-col items-center gap-2 transition hover:scale-105 ${selectedMain?.id === cat.id ? "bg-yellow-100" : "bg-white"}`}
                                        onClick={() => {
                                            setSelectedMain(cat);
                                            setSelectedSub(null);
                                        }}
                                    >
                                        <Icon size={32} />
                                        <FormattedText>{lang === "ar" ? cat.name_ar : cat.name}</FormattedText>
                                    </button>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {selectedMain && (
                        <>
                            <h3 className="text-lg font-semibold mt-4 mb-2">
                                <FormattedText id="select_subcategory" />
                            </h3>
                            <div className="flex gap-3 flex-wrap mb-4">
                                {subCategories.map((sub) => (
                                    <button
                                        key={sub.id}
                                        className={`px-4 py-2 border rounded-full text-sm transition ${selectedSub?.id === sub.id ? "bg-yellow-500 text-white" : "bg-gray-100"}`}
                                        onClick={() => setSelectedSub(sub)}
                                    >
                                        <FormattedText>{lang === "ar" ? sub.name_ar : sub.name}</FormattedText>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {selectedSub && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative border rounded-xl p-2 shadow hover:shadow-lg transition group"
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-24 object-cover rounded"
                                    />
                                    <div className="mt-2 text-sm text-center font-semibold">
                                        <FormattedText>{lang === "ar" ? item.name_ar : item.name}</FormattedText>
                                    </div>
                                    <div className="text-center text-xs text-gray-600">
                                        <FormattedText>{parseFloat(item.price).toFixed(2)}</FormattedText>
                                    </div>
                                    <div className="mt-2 flex justify-center gap-1">
                                        <button
                                            onClick={() => updateQuantity(item, -1)}
                                            className="px-2 py-0.5 text-sm bg-gray-200 rounded hover:bg-red-300"
                                        >
                                            −
                                        </button>
                                        <span className="min-w-[24px] text-center">
                                            {cart.find((c) => c.id === item.id)?.quantity || 0}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item, 1)}
                                            className="px-2 py-0.5 text-sm bg-gray-200 rounded hover:bg-green-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="w-[320px] border-l bg-gray-50 p-4 flex flex-col h-full">
                    {cart.length === 0 ? (
                        <div className="text-gray-500 text-sm text-center mt-8">
                            <FormattedText id="empty_cart" defaultMessage="Your cart is empty" />
                            <div className="mt-2">You can go back and add items.</div> {/* Optional extra content */}
                        </div>
                    ) : (
                        <CartPreview
                            cart={cart}
                            total={total}
                            updateQuantity={updateQuantity}
                            onCheckout={() => setShowCheckout(true)}
                        />
                    )}

                    {showCheckout && (
                        <CheckoutModal
                            cart={cart}
                            onClose={() => setShowCheckout(false)}
                            onSubmit={(data) => {
                                setShowCheckout(false);
                                onClose();
                            }}
                        />

                    )}

                    <button
                        onClick={onClose}
                        className="mt-auto w-full text-sm bg-red-100 text-red-700 border border-red-300 py-2 rounded hover:bg-red-200 transition"
                    >
                        <FormattedText id="cancel" defaultMessage="Cancel" />
                    </button>
                </div>



                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-lg"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default OrderGUIModal;
