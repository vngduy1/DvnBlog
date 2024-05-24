import { Button } from "flowbite-react";
import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="">
      {isVisible && (
        <Button
          className="fixed bottom-4 right-4 bg-cyan-400 white 
        border rounded-lg p-1 cursor-pointer"
          onClick={scrollToTop}
        >
          Top
        </Button>
      )}{" "}
    </div>
  );
};

export default ScrollToTopButton;
