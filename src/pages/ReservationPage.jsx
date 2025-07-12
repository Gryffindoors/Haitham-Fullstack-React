// pages/ReservationPage.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Floor1View from "../tables/Floor1View";
import Floor2View from "../tables/Floor2View";
import FormattedText from "../utils/FormattedText.jsx"; // adjust path


export default function ReservationPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-center">
        <FormattedText capitalizeText id="table_reservations" />
      </h1>
      <Swiper
        loop={true}
        spaceBetween={40}
        slidesPerView={1}
        className="w-full"
      >
        <SwiperSlide>
          <Floor1View />
        </SwiperSlide>
        <SwiperSlide>
          <Floor2View />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
