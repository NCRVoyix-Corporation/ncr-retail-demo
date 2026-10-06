import React, { useState } from 'react';
import { Carousel, CarouselItem, CarouselIndicators } from 'reactstrap';

const items = [
  {
    src: '/images/fresh-food.png',
    altText: 'Fresh Food, Every Day',
    caption: 'Fresh Food, Every Day',
    link: '/category/abaaeea3'
  },
  {
    src: '/images/kitchen-home.png',
    altText: 'Kitchen Essentials for Your Home',
    caption: 'Kitchen Essentials for Your Home',
    link: '/category/d78b0d8b'
  }
];

const HomeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };
  const slides = items.map((item) => {
    return (
      <CarouselItem onExiting={() => setAnimating(true)} onExited={() => setAnimating(false)} key={item.src}>
        <img src={item.src} alt={item.altText} style={{ width: '100%', objectFit: 'cover', minHeight: '400px' }} />
        <div className="carousel-caption d-block text-left">
          <div className="container">
            <h3 className="inner-text">{item.caption}</h3>
            <span>
              <a href={item.link} className="btn btn-success">
                Shop Now
              </a>
            </span>
          </div>
        </div>
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
    </Carousel>
  );
};

export default HomeCarousel;
