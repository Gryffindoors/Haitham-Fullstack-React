// src/orders/components/CartPreview.jsx
import React from "react";
import FormattedText from "../../utils/FormattedText";
import { useLanguage } from "../../context/LanguageContext";

const CartPreview = ({ cart, total, updateQuantity, onCheckout }) => {
    const { lang } = useLanguage();

    return (
        <div className="mt-auto bg-white border-t p-4 shadow-inner">
            <h4 className="text-lg font-bold mb-2">
                <FormattedText id="your_cart" />
            </h4>
            <div className="max-h-40 overflow-y-auto mb-2 pr-1">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center mb-2 border-b pb-1"
                    >
                        <div className="flex-1 text-sm">
                            <FormattedText>{lang === "ar" ? item.name_ar : item.name}</FormattedText>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => updateQuantity(item, -1)}
                                className="px-2 py-0.5 bg-gray-200 text-sm rounded hover:bg-red-300"
                            >
                                −
                            </button>
                            <span className="px-2 min-w-[24px] text-center">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(item, 1)}
                                className="px-2 py-0.5 bg-gray-200 text-sm rounded hover:bg-green-300"
                            >
                                +
                            </button>
                        </div>
                        <div className="text-xs text-gray-600 ml-3">
                            {(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center font-bold">
                <span>
                    <FormattedText id="total" />:
                </span>
                <span>{total.toFixed(2)}</span>
            </div>

            <button
                onClick={onCheckout}
                className="mt-3 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
            >
                <FormattedText id="finalize_order" />
            </button>
        </div>
    );
};

export default CartPreview;
