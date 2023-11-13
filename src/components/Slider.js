/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { map, addIndex } from "ramda";
import MaxIcon from "../assets/max.svg";

function Slider(props) {
  const { images } = props;
  const { id } = props;
  const [isCarousel, setIsCarousel] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedButton, setSelectedButton] = useState(1);
  const [isDraggingCaption, setIsDraggingCaption] = useState(false);
  const isDraggingCaptionRef = useRef(isDraggingCaption);
  isDraggingCaptionRef.current = isDraggingCaption;
  const mapWithIndex = addIndex(map);

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  useEffect(() => {
    const ele = document.getElementById(`images_${id}`);
    if (ele) {
      ele.addEventListener("mousedown", mouseDownHandler);
      ele.addEventListener("touchstart", touchDownHandler);
    }

    return () => {
      if (ele) {
        ele.removeEventListener("mousedown", mouseDownHandler);
        ele.removeEventListener("touchstart", touchDownHandler);
      }
    };
  }, []);

  const moveHandler = (x, y) => {
    const ele = document.getElementById(`images_${id}`);
    const dx = x - pos.x;
    const dy = y - pos.y;
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
    const widthParent = document.getElementsByClassName(
      "wrapper-content-slider"
    )[0].offsetWidth;
    let middleScreen = widthParent / 2;
    const imageElements = ele.getElementsByClassName("image_content");
    let actualMoreCentered;
    let minDistance = Infinity;

    const leftContainer = ele.getBoundingClientRect().left;
    const rightContainer = ele.getBoundingClientRect().right;

    for (let i = 0; i < imageElements.length; i++) {
      const imageElement = imageElements[i];
      const imageRect = imageElement.getBoundingClientRect();
      const imageWidth = imageRect.width;
      const imageCenter = imageRect.left + imageWidth / 2;
      const valueCompare = Math.abs(imageCenter - middleScreen);

      if (i === 0 && leftContainer === imageRect.left) {
        setSelectedButton(1);
        break;
      }

      if (i === imageElements.length - 1) {
        if (rightContainer === imageRect.right) {
          actualMoreCentered = i + 1;
          break;
        }
      }

      if (valueCompare < minDistance) {
        actualMoreCentered = i + 1;
        minDistance = valueCompare;
      }
    }

    if (actualMoreCentered !== undefined) {
      setSelectedButton(actualMoreCentered);
    }
  };

  const mouseMoveHandler = (e) => {
    if (isDraggingCaptionRef.current) {
      return false;
    }
    setIsDragging(true);
    moveHandler(e.clientX, e.clientY);

    const ele = document.getElementById(`images_${id}`);
    ele.scrollTop = 0;
  };

  const touchMoveHandler = (e) => {
    const touch = e.touches[0];
    moveHandler(touch.pageX, touch.pageY);
  };

  const mouseDownHandler = (e) => {
    const ele = document.getElementById(`images_${id}`);
    if (ele) {
      const widthParent = document.getElementsByClassName(
        "wrapper-content-slider"
      )[0].offsetWidth;
      const isCarousel = ele.scrollWidth > widthParent;
      if (isCarousel) {
        ele.style.userSelect = "none";

        pos = {
          left: ele.scrollLeft,
          top: ele.scrollTop,
          x: e.clientX,
          y: e.clientY,
        };

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
      }
    }
  };

  const touchDownHandler = (e) => {
    const ele = document.getElementById(`images_${id}`);
    if (ele) {
      const widthParent = document.getElementsByClassName(
        "wrapper-content-slider"
      )[0].offsetWidth;
      const isCarousel = ele.scrollWidth > widthParent;
      if (isCarousel) {
        ele.style.userSelect = "none";

        const touch = e.touches[0];

        pos = {
          left: ele.scrollLeft,
          top: ele.scrollTop,
          x: touch.clientX,
          y: touch.clientY,
        };

        document.addEventListener("touchmove", touchMoveHandler);
        document.addEventListener("touchend", touchUpHandler);
      }
    }
  };

  const mouseUpHandler = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
    const ele = document.getElementById(`images_${id}`);
    ele.style.removeProperty("user-select");

    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  const touchUpHandler = () => {
    const ele = document.getElementById(`images_${id}`);
    ele.style.removeProperty("user-select");

    document.removeEventListener("touchmove", touchMoveHandler);
    document.removeEventListener("touchend", touchUpHandler);
  };

  const handleMouseEnter = () => {
    const ele = document.getElementById(`images_${id}`);
    if (ele) {
      const widthParent = document.getElementsByClassName(
        "wrapper-content-slider"
      )[0].offsetWidth;
      setIsCarousel(ele.scrollWidth > widthParent);
    }
  };

  return images.length > 0 ? (
    <>
      <div className="wrapper-content-slider">
        <div
          className={`image_container ${isCarousel ? "" : "center"}`}
          id={`images_${id}`}
          onMouseEnter={handleMouseEnter}
        >
          {mapWithIndex((i, index) => {
            return (
              <div
                key={index}
                className="image_content"
                id={`ic_${id}_${index + 1}`}
              >
                <div>
                  <img
                    className="image"
                    alt={i.alt}
                    src={i.src}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    draggable="false"
                  />
                  <div className="max_image">
                    <img src={MaxIcon} alt="max" draggable="false" />
                  </div>
                </div>
              </div>
            );
          }, images)}
        </div>
      </div>
    </>
  ) : (
    ""
  );
}

export default Slider;
