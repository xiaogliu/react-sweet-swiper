import React from "react";
import PropTypes from "prop-types";
// import BpkSmallChevronRight from "bpk-component-icon/sm/chevron-right";
// import BpkSmallChevronLeft from "bpk-component-icon/sm/chevron-left";
import { debounce } from "lodash";
// import { cssModules } from "bpk-react-utils";
import classNames from "classnames/bind";
// import { withLargeButtonAlignment } from "bpk-component-icon";

import STYLES from "./Swiper.css";

const cls = classNames.bind(STYLES);
// const AlignedSmallChevronLeft = withLargeButtonAlignment(BpkSmallChevronLeft);
// const AlignedSmallChevronRight = withLargeButtonAlignment(BpkSmallChevronRight);

import Slider, { Range } from "rc-slider";

const INITIAL_INDEX = 0;
const INITIAL_TRANSLATE = 0;
const DEBOUNCE_TIME = 150;
const DEFAULT_NAV_BTN_BACKGROUND_COLOR = "rgb(241, 242, 248, 0.59)";

class Swiper extends React.Component {
  constructor(props) {
    super(props);

    this.swiperRef = React.createRef();
    this.swiperWrapperRef = React.createRef();

    this.state = {
      swiperWidth: undefined,
      swiperChildrenWidth: undefined,
      hiddenPrevBtn: true,
      hiddenNextBtn: false
    };

    this.endIndex = undefined;
    this.swiperSingleChildWidth = undefined;
    this.currentChildLength = 0;
    this.currentIndex = INITIAL_INDEX;
    this.translateValue = INITIAL_TRANSLATE;
  }

  componentDidMount() {
    const { children, itemsPerGroup } = this.props;

    this.currentChildLength = children.length;

    if (children.length <= itemsPerGroup) {
      this.setState({
        hiddenNextBtn: true
      });
    }
    this.getWidth();
    window.addEventListener("resize", debounce(this.getWidth, DEBOUNCE_TIME));
  }

  componentDidUpdate() {
    const { swiperWidth } = this.state;
    const { children } = this.props;
    const { offsetWidth } = this.swiperRef.current;
    if (
      swiperWidth !== offsetWidth ||
      this.currentChildLength !== children.length
    ) {
      this.getWidth();
      this.currentChildLength = children.length;
    }
  }

  getWidth = () => {
    const { children, itemsPerGroup } = this.props;
    const { offsetWidth } = this.swiperRef.current;
    this.swiperSingleChildWidth = offsetWidth / itemsPerGroup;

    this.endIndex =
      children.length % itemsPerGroup === 0
        ? children.length / itemsPerGroup - 1
        : Math.floor(children.length / itemsPerGroup);

    this.setState({
      swiperWidth: offsetWidth,
      swiperChildrenWidth: this.swiperSingleChildWidth * children.length
    });
  };

  clickNav(type) {
    const { swiperWidth, swiperChildrenWidth } = this.state;
    const { itemsPerGroup, spaceBetween } = this.props;
    const moveFactor = type === "next" ? 1 : -1;

    const boundaryCondition = {
      START: this.currentIndex === 0,
      NEXT_LAST_STEP:
        type === "next" && this.currentIndex === this.endIndex - 1,
      END: this.currentIndex === this.endIndex,
      PREV_LAST_STEP: type === "prev" && this.currentIndex === 1
    };

    if (
      (type === "prev" && this.currentIndex > INITIAL_INDEX) ||
      (type === "next" && this.currentIndex < this.endIndex)
    ) {
      if (boundaryCondition.START) {
        this.translateValue =
          itemsPerGroup % 1 === 0
            ? swiperWidth
            : swiperWidth - (3 / 4) * this.swiperSingleChildWidth;
      } else {
        this.translateValue =
          itemsPerGroup % 1 === 0
            ? this.translateValue + swiperWidth * moveFactor
            : this.translateValue +
              (swiperWidth / itemsPerGroup) *
                Math.floor(itemsPerGroup) *
                moveFactor;
      }

      if (boundaryCondition.NEXT_LAST_STEP) {
        this.translateValue = swiperChildrenWidth - swiperWidth + spaceBetween;
      }

      if (boundaryCondition.END) {
        this.translateValue =
          itemsPerGroup % 1 === 0
            ? swiperChildrenWidth - swiperWidth * 2
            : swiperChildrenWidth -
              swiperWidth * 2 +
              (3 / 4) * this.swiperSingleChildWidth;
      }

      if (boundaryCondition.PREV_LAST_STEP) {
        this.translateValue = 0;
      }

      this.swiperWrapperRef.current.style.transform = `translate3d(-${this.translateValue}px, 0, 0)`;

      this.currentIndex = this.currentIndex + moveFactor;
      const generalObject = {
        hiddenPrevBtn: false,
        hiddenNextBtn: false
      };
      if (this.currentIndex === INITIAL_INDEX) {
        generalObject.hiddenPrevBtn = true;
      }
      if (this.currentIndex === this.endIndex) {
        generalObject.hiddenNextBtn = true;
      }

      this.setState(generalObject);
    }
  }

  render() {
    const {
      children,
      spaceBetween,
      itemsPerGroup,
      navButtonBackgroundColor,
      navButtonForegroundColor,
      className,
      prevNavBtnClassName,
      nextNavBtnClassName,
      buttonPosition
    } = this.props;

    if (!children || !children.length || !Number(itemsPerGroup)) {
      return null;
    }

    const { swiperWidth, hiddenPrevBtn, hiddenNextBtn } = this.state;

    // if you wrap react custom component but not html standard element directly, you must guarantee
    //  that the html standard element of swiper after rendered can get the style from here
    const styledChildren = children.map(child =>
      React.cloneElement(child, {
        style: {
          marginRight: `${spaceBetween}px`,
          width: `${swiperWidth / itemsPerGroup - spaceBetween}px`,
          flexShrink: 0,
          minWidth: 0,
          maxWidth: "9999px"
        }
      })
    );

    const navBtnCommonProps = {
      iconOnly: true,
      backgroundColor: navButtonBackgroundColor,
      foregroundColor: navButtonForegroundColor
    };

    return (
      <div
        ref={this.swiperRef}
        className={cls("Swiper", className)}
        style={{
          position: buttonPosition === "outer" ? "static" : "relative",
        }}
      >
        <section ref={this.swiperWrapperRef} className={STYLES.Swiper__wrapper}>
          {styledChildren}
        </section>
        <button
          onClick={() => this.clickNav("prev")}
          className={cls(
            "Swiper__prevBtn",
            "Swiper__navBtn",
            hiddenPrevBtn && "Swiper__prevBtnHide",
            prevNavBtnClassName
          )}
        >
          left
        </button>
        <button
          onClick={() => this.clickNav("next")}
          className={cls(
            "Swiper__nextBtn",
            "Swiper__navBtn",
            hiddenNextBtn && "Swiper__nextBtnHide",
            nextNavBtnClassName
          )}
        >
          right
        </button>
      </div>
    );
  }
}

Swiper.propTypes = {
  children: PropTypes.node.isRequired,
  itemsPerGroup: PropTypes.number.isRequired,
  spaceBetween: PropTypes.number,
  navButtonBackgroundColor: PropTypes.string,
  navButtonForegroundColor: PropTypes.string,
  className: PropTypes.string,
  prevNavBtnClassName: PropTypes.string,
  nextNavBtnClassName: PropTypes.string,
  buttonPosition: PropTypes.string
};

Swiper.defaultProps = {
  navButtonBackgroundColor: DEFAULT_NAV_BTN_BACKGROUND_COLOR,
  navButtonForegroundColor: '#0ff',
  spaceBetween: 0,
  className: null,
  prevNavBtnClassName: null,
  nextNavBtnClassName: null,
  buttonPosition: "inner"
};

export default Swiper;
